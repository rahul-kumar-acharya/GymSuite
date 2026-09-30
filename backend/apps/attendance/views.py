from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attendance
from .serializers import AttendanceSerializer
from apps.members.models import Member
from django.utils import timezone
from apps.accounts.permissions import CanManageAttendance
from django.core import signing
from apps.accounts.permissions import CanAccessAttendanceQr, CanManageAttendance
from apps.accounts.services import record_audit
from apps.memberships.models import MemberMembership

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [CanManageAttendance]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['date', 'method', 'member']
    search_fields = ['member__full_name', 'member__member_id_code']
    ordering_fields = ['date', 'check_in']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return Attendance.objects.none()
        return Attendance.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

    def get_permissions(self):
        if self.action == 'qr_token':
            return [CanAccessAttendanceQr()]
        return super().get_permissions()

    @action(detail=False, methods=['get'], url_path='qr-token')
    def qr_token(self, request):
        member = getattr(request.user, 'member_profile', None)
        if not member:
            return Response({'error': 'Only member accounts can request a personal QR code.'}, status=status.HTTP_403_FORBIDDEN)
        token = signing.dumps({'member_id': member.id, 'gym_id': member.gym_id}, salt='gymsuite-attendance')
        return Response({'token': token, 'member_code': member.member_id_code, 'member_name': member.full_name})

    @action(detail=False, methods=['post'], url_path='scan')
    def scan(self, request):
        token = request.data.get('token')
        if not token:
            return Response({'error': 'QR token is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            payload = signing.loads(token, salt='gymsuite-attendance', max_age=86400)
        except signing.BadSignature:
            return Response({'error': 'This QR code is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if payload.get('gym_id') != request.user.gym_id:
            return Response({'error': 'This member belongs to another gym.'}, status=status.HTTP_403_FORBIDDEN)
        member = Member.objects.filter(id=payload.get('member_id'), gym=request.user.gym).first()
        if not member:
            return Response({'error': 'Member not found.'}, status=status.HTTP_404_NOT_FOUND)
        today = timezone.localdate()
        if not MemberMembership.objects.filter(
            gym=request.user.gym,
            member=member,
            status__in=['ACTIVE', 'EXPIRING_SOON'],
            start_date__lte=today,
            end_date__gte=today,
        ).exists():
            return Response({'error': 'Member does not have an active membership.'}, status=status.HTTP_400_BAD_REQUEST)

        attendance, created = Attendance.objects.get_or_create(
            gym=request.user.gym,
            member=member,
            date=today,
            defaults={'check_in': timezone.localtime().time(), 'method': 'QR'},
        )
        message = f'Successfully checked in {member.full_name}.' if created else f'{member.full_name} is already checked in today.'
        return Response({
            'message': message,
            'created': created,
            'attendance': AttendanceSerializer(attendance, context={'request': request}).data,
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='checkin-by-code')
    def checkin_by_code(self, request):
        member_code = request.data.get('member_code')
        if not member_code:
            return Response({'error': 'member_code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        member = Member.objects.filter(gym=request.user.gym, member_id_code__iexact=member_code.strip()).first()
        if not member:
            return Response({'error': 'Member not found with this code'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        today = timezone.localdate()
        now_time = timezone.localtime().time()

        if not MemberMembership.objects.filter(
            gym=request.user.gym,
            member=member,
            status__in=['ACTIVE', 'EXPIRING_SOON'],
            start_date__lte=today,
            end_date__gte=today,
        ).exists():
            return Response({'error': 'Member does not have an active membership.'}, status=status.HTTP_400_BAD_REQUEST)

        attendance, created = Attendance.objects.get_or_create(
            gym=request.user.gym,
            member=member,
            date=today,
            defaults={
                'check_in': now_time,
                'method': request.data.get('method', 'MANUAL')
            }
        )

        if not created:
            return Response({
                'message': f'{member.full_name} is already checked in for today at {attendance.check_in.strftime("%H:%M")}.',
                'attendance': AttendanceSerializer(attendance, context={'request': request}).data
            }, status=status.HTTP_200_OK)

        record_audit(user=request.user, action='CHECK_IN', entity='Attendance', entity_id=attendance.id, metadata={'method': 'MANUAL', 'member_id': member.id})

        return Response({
            'message': f'Successfully checked in {member.full_name}!',
            'attendance': AttendanceSerializer(attendance, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

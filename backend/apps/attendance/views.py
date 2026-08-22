from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Attendance
from .serializers import AttendanceSerializer
from apps.members.models import Member
from django.utils import timezone

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]
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

    @action(detail=False, methods=['post'], url_path='checkin-by-code')
    def checkin_by_code(self, request):
        member_code = request.data.get('member_code')
        if not member_code:
            return Response({'error': 'member_code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        member = Member.objects.filter(gym=request.user.gym, member_id_code__iexact=member_code.strip()).first()
        if not member:
            return Response({'error': 'Member not found with this code'}, status=status.HTTP_404_NOT_FOUND)

        today = timezone.now().date()
        now_time = timezone.now().time()

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

        return Response({
            'message': f'Successfully checked in {member.full_name}!',
            'attendance': AttendanceSerializer(attendance, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)

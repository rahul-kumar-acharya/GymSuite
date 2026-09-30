from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Member
from .serializers import MemberOnboardSerializer, MemberSerializer
from apps.accounts.permissions import CanAccessMemberSelf, CanManageMembers
from apps.accounts.permissions import CanAccessMemberSelf, CanManageMembers, CanViewAssignedMembers
from apps.accounts.services import record_audit

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [CanManageMembers]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['full_name', 'email', 'phone', 'member_id_code']
    ordering_fields = ['joined_date', 'full_name']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return Member.objects.none()
        queryset = Member.objects.filter(gym=user.gym)
        if user.role == 'MEMBER':
            return queryset.filter(user=user)
        if user.role == 'TRAINER':
            return queryset.filter(assigned_trainers__user=user).distinct()
        return queryset

    def get_permissions(self):
        if self.action == 'me':
            return [CanAccessMemberSelf()]
        if self.action == 'list' and self.request.user.role == 'TRAINER':
            return [CanViewAssignedMembers()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

    @action(detail=False, methods=['post'], url_path='onboard')
    def onboard(self, request):
        serializer = MemberOnboardSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        member = serializer.save()
        record_audit(user=request.user, action='CREATE', entity='Member', entity_id=member.id, metadata={'source': 'onboarding'})
        response = MemberSerializer(member, context={'request': request}).data
        response['membership_id'] = getattr(member, 'onboarded_membership', None) and member.onboarded_membership.id
        response['payment_id'] = getattr(member, 'onboarded_payment', None) and member.onboarded_payment.id
        return Response(response, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        member = getattr(request.user, 'member_profile', None)
        if not member:
            return Response({'detail': 'No member profile is linked to this account.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(MemberSerializer(member, context={'request': request}).data)

from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import MembershipPlan, MemberMembership
from .serializers import MembershipPlanSerializer, MemberMembershipSerializer
from apps.accounts.permissions import CanManageMemberships, CanViewGymData
from apps.accounts.permissions import CanAccessMemberSelf, CanManageMemberships, CanViewGymData
from apps.payments.models import Payment

class MembershipPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipPlanSerializer
    permission_classes = [CanManageMemberships]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'description']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return MembershipPlan.objects.none()
        return MembershipPlan.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

class MemberMembershipViewSet(viewsets.ModelViewSet):
    serializer_class = MemberMembershipSerializer
    permission_classes = [CanViewGymData]

    def get_permissions(self):
        if self.request.user.role == 'MEMBER' and self.action in {'list', 'retrieve'}:
            return [CanAccessMemberSelf()]
        return super().get_permissions()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'member', 'plan']
    search_fields = ['member__full_name', 'member__member_id_code', 'plan__name']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return MemberMembership.objects.none()
        return MemberMembership.objects.filter(gym=user.gym)
        queryset = MemberMembership.objects.filter(gym=user.gym)
        if user.role == 'MEMBER' and hasattr(user, 'member_profile'):
            queryset = queryset.filter(member=user.member_profile)
        return queryset

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        current = self.get_object()
        plan = MembershipPlan.objects.filter(id=request.data.get('plan'), gym=request.user.gym).first() if request.data.get('plan') else current.plan
        if not plan:
            return Response({'detail': 'A valid membership plan is required.'}, status=status.HTTP_400_BAD_REQUEST)
        start_date = max(timezone.localdate(), current.end_date + timedelta(days=1))
        amount_paid = Decimal(str(request.data.get('amount_paid', plan.price)))
        with transaction.atomic():
            renewed = MemberMembership.objects.create(
                gym=request.user.gym,
                member=current.member,
                plan=plan,
                start_date=start_date,
                end_date=start_date + timedelta(days=plan.duration_days),
                price_at_purchase=plan.price,
                status='ACTIVE',
            )
            Payment.objects.create(
                gym=request.user.gym,
                member=current.member,
                member_membership=renewed,
                amount_paid=amount_paid,
                total_amount=plan.price,
                payment_status='PAID' if amount_paid == plan.price else 'PARTIAL',
                payment_method=request.data.get('payment_method', 'UPI'),
            )
            current.member.status = 'ACTIVE'
            current.member.save(update_fields=['status'])
        return Response(self.get_serializer(renewed).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def freeze(self, request, pk=None):
        membership = self.get_object()
        frozen_until = request.data.get('frozen_until')
        if not frozen_until:
            return Response({'detail': 'frozen_until is required.'}, status=status.HTTP_400_BAD_REQUEST)
        membership.status = 'FROZEN'
        membership.frozen_until = frozen_until
        membership.save(update_fields=['status', 'frozen_until'])
        return Response(self.get_serializer(membership).data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        membership = self.get_object()
        membership.status = 'CANCELLED'
        membership.cancellation_reason = request.data.get('reason', '')
        membership.cancelled_at = timezone.now()
        membership.save(update_fields=['status', 'cancellation_reason', 'cancelled_at'])
        return Response(self.get_serializer(membership).data)

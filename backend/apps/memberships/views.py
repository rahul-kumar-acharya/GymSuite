from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import MembershipPlan, MemberMembership
from .serializers import MembershipPlanSerializer, MemberMembershipSerializer

class MembershipPlanViewSet(viewsets.ModelViewSet):
    serializer_class = MembershipPlanSerializer
    permission_classes = [permissions.IsAuthenticated]
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
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'member', 'plan']
    search_fields = ['member__full_name', 'member__member_id_code', 'plan__name']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return MemberMembership.objects.none()
        return MemberMembership.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

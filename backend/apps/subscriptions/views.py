from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from .models import SaaSPlan, GymSubscription
from .serializers import SaaSPlanSerializer, GymSubscriptionSerializer
from apps.accounts.permissions import CanManageSaaSPlans

class SaaSPlanViewSet(viewsets.ModelViewSet):
    serializer_class = SaaSPlanSerializer

    def get_permissions(self):
        if self.action in {'list', 'retrieve'}:
            return [permissions.AllowAny()]
        return [CanManageSaaSPlans()]

    def get_queryset(self):
        if self.request.user.is_authenticated and (self.request.user.is_superuser or self.request.user.role == 'SUPERADMIN'):
            return SaaSPlan.objects.all().order_by('price_monthly', 'name')
        return SaaSPlan.objects.filter(is_active=True).order_by('price_monthly', 'name')


class PublicSaaSPlanListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = SaaSPlan.objects.filter(is_active=True).order_by('price_monthly', 'name')
    serializer_class = SaaSPlanSerializer

class CurrentGymSubscriptionView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = GymSubscriptionSerializer

    def get_object(self):
        user = self.request.user
        if not user.gym:
            return None
        subscription, created = GymSubscription.objects.get_or_create(gym=user.gym)
        return subscription

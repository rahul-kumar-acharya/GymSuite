from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import SaaSPlan, GymSubscription
from .serializers import SaaSPlanSerializer, GymSubscriptionSerializer

class PublicSaaSPlanListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = SaaSPlan.objects.filter(is_active=True)
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

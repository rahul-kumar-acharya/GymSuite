from rest_framework import generics, permissions, viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Gym
from .serializers import GymSerializer
from apps.accounts.permissions import IsSuperAdminUser
from apps.accounts.serializers import UserSerializer
from apps.members.models import Member
from apps.subscriptions.models import GymSubscription, SaaSPlan
from django.contrib.auth import get_user_model
from django.db.models import Sum

User = get_user_model()

class CurrentGymView(generics.RetrieveUpdateAPIView):
    serializer_class = GymSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.gym

class SuperAdminStatsView(APIView):
    permission_classes = [IsSuperAdminUser]

    def get(self, request):
        total_gyms = Gym.objects.count()
        active_trials = Gym.objects.filter(status='TRIAL').count()
        paid_gyms = Gym.objects.filter(status='ACTIVE').count()
        total_members = Member.objects.count()
        total_users = User.objects.count()

        # Aggregate MRR from active subscriptions
        active_subs = GymSubscription.objects.filter(status='ACTIVE')
        mrr = sum(sub.plan.price_monthly for sub in active_subs if sub.plan)

        recent_gyms = Gym.objects.all().order_by('-created_at')[:10]
        recent_gyms_data = GymSerializer(recent_gyms, many=True).data

        return Response({
            'overview': {
                'total_gyms': total_gyms,
                'active_trials': active_trials,
                'paid_gyms': paid_gyms,
                'total_members': total_members,
                'total_users': total_users,
                'mrr': str(mrr)
            },
            'recent_gyms': recent_gyms_data
        })

class SuperAdminGymViewSet(viewsets.ModelViewSet):
    queryset = Gym.objects.all().order_by('-created_at')
    serializer_class = GymSerializer
    permission_classes = [IsSuperAdminUser]

class SuperAdminUserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsSuperAdminUser]

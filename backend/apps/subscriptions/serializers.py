from rest_framework import serializers
from .models import SaaSPlan, GymSubscription

class SaaSPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaaSPlan
        fields = ['id', 'name', 'slug', 'price_monthly', 'max_members', 'description', 'is_active']

class GymSubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SaaSPlanSerializer(source='plan', read_only=True)
    days_left = serializers.ReadOnlyField()

    class Meta:
        model = GymSubscription
        fields = ['id', 'gym', 'plan', 'plan_details', 'status', 'trial_start', 'trial_end', 'active_until', 'days_left']
        read_only_fields = ['id', 'gym', 'trial_start', 'trial_end']

from rest_framework import serializers
from .models import SaaSPlan, GymSubscription

class SaaSPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaaSPlan
        fields = ['id', 'name', 'slug', 'price_monthly', 'max_members', 'description', 'is_active']

    def validate_price_monthly(self, value):
        if value < 0:
            raise serializers.ValidationError('Monthly price cannot be negative.')
        return value

    def validate_max_members(self, value):
        if value == 0 or value < -1:
            raise serializers.ValidationError('Use -1 for unlimited or a positive member limit.')
        return value

class GymSubscriptionSerializer(serializers.ModelSerializer):
    plan_details = SaaSPlanSerializer(source='plan', read_only=True)
    days_left = serializers.ReadOnlyField()

    class Meta:
        model = GymSubscription
        fields = ['id', 'gym', 'plan', 'plan_details', 'status', 'trial_start', 'trial_end', 'active_until', 'days_left']
        read_only_fields = ['id', 'gym', 'trial_start', 'trial_end']

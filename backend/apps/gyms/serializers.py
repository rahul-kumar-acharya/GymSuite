from rest_framework import serializers
from .models import Gym

class GymSerializer(serializers.ModelSerializer):
    days_left_in_trial = serializers.SerializerMethodField()

    class Meta:
        model = Gym
        fields = [
            'id', 'name', 'phone', 'email', 'address', 'city', 'state',
            'pincode', 'logo', 'code_prefix', 'status', 'trial_ends_at',
            'days_left_in_trial', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'trial_ends_at', 'created_at', 'updated_at']

    def get_days_left_in_trial(self, obj):
        if not obj.trial_ends_at:
            return 0
        from django.utils import timezone
        delta = obj.trial_ends_at - timezone.now()
        return max(0, delta.days)

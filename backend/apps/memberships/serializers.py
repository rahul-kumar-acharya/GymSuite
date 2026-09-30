from rest_framework import serializers
from .models import MembershipPlan, MemberMembership
from apps.members.models import Member

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = ['id', 'gym', 'name', 'description', 'duration_days', 'price', 'is_active', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

    def validate_duration_days(self, value):
        if value <= 0:
            raise serializers.ValidationError('Duration must be greater than zero.')
        return value

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError('Price cannot be negative.')
        return value

class MemberMembershipSerializer(serializers.ModelSerializer):
    member_name = serializers.ReadOnlyField(source='member.full_name')
    member_code = serializers.ReadOnlyField(source='member.member_id_code')
    plan_name = serializers.ReadOnlyField(source='plan.name')
    days_remaining = serializers.ReadOnlyField()

    class Meta:
        model = MemberMembership
        fields = [
            'id', 'gym', 'member', 'member_name', 'member_code', 'plan',
            'plan_name', 'start_date', 'end_date', 'price_at_purchase',
            'status', 'frozen_until', 'cancellation_reason', 'cancelled_at', 'days_remaining', 'created_at'
        ]
        read_only_fields = ['id', 'gym', 'created_at', 'cancelled_at']

    def validate(self, attrs):
        request = self.context.get('request')
        gym = request.user.gym if request else None
        member = attrs.get('member')
        plan = attrs.get('plan')
        if gym and member and member.gym_id != gym.id:
            raise serializers.ValidationError({'member': 'Member does not belong to this gym.'})
        if gym and plan and plan.gym_id != gym.id:
            raise serializers.ValidationError({'plan': 'Plan does not belong to this gym.'})
        if attrs.get('end_date') and attrs.get('start_date') and attrs['end_date'] < attrs['start_date']:
            raise serializers.ValidationError({'end_date': 'End date cannot be before start date.'})
        if attrs.get('price_at_purchase') is not None and attrs['price_at_purchase'] < 0:
            raise serializers.ValidationError({'price_at_purchase': 'Price cannot be negative.'})
        return attrs

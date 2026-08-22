from rest_framework import serializers
from .models import MembershipPlan, MemberMembership
from apps.members.models import Member

class MembershipPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipPlan
        fields = ['id', 'gym', 'name', 'description', 'duration_days', 'price', 'is_active', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

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
            'status', 'days_remaining', 'created_at'
        ]
        read_only_fields = ['id', 'gym', 'created_at']

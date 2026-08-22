from rest_framework import serializers
from .models import Member

class MemberSerializer(serializers.ModelSerializer):
    active_membership = serializers.SerializerMethodField()
    total_paid = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            'id', 'gym', 'member_id_code', 'full_name', 'email', 'phone',
            'gender', 'dob', 'emergency_contact', 'photo', 'status',
            'joined_date', 'notes', 'active_membership', 'total_paid'
        ]
        read_only_fields = ['id', 'gym', 'member_id_code', 'joined_date']

    def get_active_membership(self, obj):
        active = obj.memberships.filter(status__in=['ACTIVE', 'EXPIRING_SOON']).order_by('-end_date').first()
        if not active:
            return None
        return {
            'id': active.id,
            'plan_name': active.plan.name if active.plan else 'Custom Plan',
            'start_date': active.start_date,
            'end_date': active.end_date,
            'days_remaining': active.days_remaining,
            'status': active.status
        }

    def get_total_paid(self, obj):
        from django.db.models import Sum
        total = obj.payments.aggregate(Sum('amount_paid'))['amount_paid__sum']
        return total or 0.00

from rest_framework import serializers
from .models import Attendance
from apps.memberships.models import MemberMembership
from django.utils import timezone

class AttendanceSerializer(serializers.ModelSerializer):
    member_name = serializers.ReadOnlyField(source='member.full_name')
    member_code = serializers.ReadOnlyField(source='member.member_id_code')
    membership_status = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = [
            'id', 'gym', 'member', 'member_name', 'member_code', 'date',
            'check_in', 'check_out', 'method', 'notes', 'membership_status'
        ]
        read_only_fields = ['id', 'gym']

    def get_membership_status(self, obj):
        active = MemberMembership.objects.filter(
            gym=obj.gym,
            member=obj.member,
            status__in=['ACTIVE', 'EXPIRING_SOON'],
            end_date__gte=timezone.now().date()
        ).first()
        return 'ACTIVE' if active else 'EXPIRED'

    def validate(self, attrs):
        gym = self.context['request'].user.gym
        member = attrs.get('member')
        date = attrs.get('date', timezone.now().date())
        
        # Check active membership status on check-in
        has_active = MemberMembership.objects.filter(
            gym=gym,
            member=member,
            end_date__gte=date
        ).exists()

        if not has_active:
            # We don't block check-in outright, but add a warning note if missing
            attrs['notes'] = (attrs.get('notes') or '') + ' [Warning: Expired Membership]'

        return attrs

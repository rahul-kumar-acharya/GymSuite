from datetime import timedelta
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import Member
from apps.memberships.models import MemberMembership, MembershipPlan
from apps.payments.models import Payment

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

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user.role == 'MEMBER':
            blocked = set(attrs) - {'photo'}
            if blocked:
                raise serializers.ValidationError('Members can only update their photo.')
        return attrs

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


class MemberOnboardSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)
    phone = serializers.CharField(max_length=20)
    gender = serializers.ChoiceField(choices=Member.GENDER_CHOICES, default='MALE')
    dob = serializers.DateField(required=False, allow_null=True)
    emergency_contact = serializers.CharField(max_length=50, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    plan = serializers.PrimaryKeyRelatedField(queryset=MembershipPlan.objects.all(), required=False, allow_null=True)
    start_date = serializers.DateField(required=False)
    initial_payment = serializers.DecimalField(max_digits=10, decimal_places=2, required=False, min_value=Decimal('0'))
    payment_method = serializers.ChoiceField(choices=Payment.METHOD_CHOICES, default='UPI')

    def validate(self, attrs):
        gym = self.context['request'].user.gym
        plan = attrs.get('plan')
        if plan and plan.gym_id != gym.id:
            raise serializers.ValidationError({'plan': 'Plan does not belong to this gym.'})
        if attrs.get('initial_payment') is not None and not plan:
            raise serializers.ValidationError({'plan': 'A plan is required when recording an initial payment.'})
        return attrs

    def create(self, validated_data):
        gym = self.context['request'].user.gym
        plan = validated_data.pop('plan', None)
        start_date = validated_data.pop('start_date', timezone.now().date())
        initial_payment = validated_data.pop('initial_payment', None)
        payment_method = validated_data.pop('payment_method', 'UPI')

        with transaction.atomic():
            prefix = gym.code_prefix or 'GM'
            next_number = gym.members.count() + 1
            member_code = f'{prefix}-{next_number:04d}'
            while Member.objects.filter(gym=gym, member_id_code=member_code).exists():
                next_number += 1
                member_code = f'{prefix}-{next_number:04d}'

            member = Member.objects.create(
                gym=gym,
                member_id_code=member_code,
                status='ACTIVE',
                **validated_data,
            )

            membership = None
            payment = None
            if plan:
                membership = MemberMembership.objects.create(
                    gym=gym,
                    member=member,
                    plan=plan,
                    start_date=start_date,
                    end_date=start_date + timedelta(days=plan.duration_days),
                    price_at_purchase=plan.price,
                    status='ACTIVE',
                )
                amount_paid = initial_payment if initial_payment is not None else plan.price
                receipt_number = gym.payments.count() + 1
                receipt_no = f'REC-{gym.code_prefix or "GM"}-{receipt_number:05d}'
                while Payment.objects.filter(gym=gym, receipt_no=receipt_no).exists():
                    receipt_number += 1
                    receipt_no = f'REC-{gym.code_prefix or "GM"}-{receipt_number:05d}'
                payment = Payment.objects.create(
                    gym=gym,
                    member=member,
                    member_membership=membership,
                    receipt_no=receipt_no,
                    amount_paid=amount_paid,
                    total_amount=plan.price,
                    payment_status='PAID' if amount_paid == plan.price else 'PARTIAL',
                    payment_method=payment_method,
                )

        member.onboarded_membership = membership
        member.onboarded_payment = payment
        return member

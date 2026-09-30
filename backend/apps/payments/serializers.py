from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.ReadOnlyField(source='member.full_name')
    member_code = serializers.ReadOnlyField(source='member.member_id_code')
    due_amount = serializers.ReadOnlyField()

    class Meta:
        model = Payment
        fields = [
            'id', 'gym', 'member', 'member_name', 'member_code',
            'member_membership', 'receipt_no', 'amount_paid', 'total_amount',
            'due_amount', 'payment_status', 'payment_method', 'transaction_id',
            'payment_date', 'notes', 'created_at'
            , 'refunded_amount', 'refund_reason', 'refunded_at'
        ]
        read_only_fields = ['id', 'gym', 'receipt_no', 'created_at', 'refunded_amount', 'refunded_at']

    def validate(self, attrs):
        request = self.context.get('request')
        gym = request.user.gym if request else None
        member = attrs.get('member')
        membership = attrs.get('member_membership')
        amount_paid = attrs.get('amount_paid')
        total_amount = attrs.get('total_amount')
        if gym and member and member.gym_id != gym.id:
            raise serializers.ValidationError({'member': 'Member does not belong to this gym.'})
        if gym and membership and membership.gym_id != gym.id:
            raise serializers.ValidationError({'member_membership': 'Membership does not belong to this gym.'})
        if membership and member and membership.member_id != member.id:
            raise serializers.ValidationError({'member_membership': 'Membership does not belong to this member.'})
        if amount_paid is not None and amount_paid < 0:
            raise serializers.ValidationError({'amount_paid': 'Amount cannot be negative.'})
        if total_amount is not None and total_amount < 0:
            raise serializers.ValidationError({'total_amount': 'Total amount cannot be negative.'})
        if amount_paid is not None and total_amount is not None and amount_paid > total_amount:
            raise serializers.ValidationError({'amount_paid': 'Amount paid cannot exceed total amount.'})
        if amount_paid is not None and total_amount is not None:
            attrs['payment_status'] = 'PAID' if amount_paid == total_amount else 'PARTIAL'
        return attrs

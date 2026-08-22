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
        ]
        read_only_fields = ['id', 'gym', 'receipt_no', 'created_at']

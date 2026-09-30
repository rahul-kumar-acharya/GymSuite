from rest_framework import serializers
from .models import Expense

class ExpenseSerializer(serializers.ModelSerializer):
    category_display = serializers.ReadOnlyField(source='get_category_display')

    class Meta:
        model = Expense
        fields = ['id', 'gym', 'category', 'category_display', 'title', 'amount', 'expense_date', 'notes', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError('Expense amount must be greater than zero.')
        return value

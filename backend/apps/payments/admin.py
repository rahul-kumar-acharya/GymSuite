from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('receipt_no', 'member', 'gym', 'amount_paid', 'total_amount', 'payment_status', 'payment_method', 'payment_date')
    list_filter = ('payment_status', 'payment_method', 'gym', 'payment_date')
    search_fields = ('receipt_no', 'member__full_name', 'member__member_id_code', 'transaction_id')

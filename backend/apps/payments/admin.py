from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('receipt_no', 'member', 'gym', 'amount_paid', 'total_amount', 'payment_status', 'payment_method', 'payment_date')
    list_filter = ('payment_status', 'payment_method', 'gym', 'payment_date')
    search_fields = ('receipt_no', 'member__full_name', 'member__member_id_code', 'transaction_id')
    list_select_related = ('member', 'gym', 'member_membership')
    autocomplete_fields = ('member', 'member_membership', 'gym')
    readonly_fields = ('receipt_no', 'due_amount', 'refunded_amount', 'refunded_at', 'created_at')
    date_hierarchy = 'payment_date'
    ordering = ('-payment_date', '-created_at')
    list_per_page = 50
    fieldsets = (
        ('Payment identity', {'fields': ('receipt_no', 'gym', 'member', 'member_membership')}),
        ('Amounts', {'fields': ('amount_paid', 'total_amount', 'due_amount', 'refunded_amount')}),
        ('Collection', {'fields': ('payment_status', 'payment_method', 'transaction_id', 'payment_date', 'notes')}),
        ('Refund', {'fields': ('refund_reason', 'refunded_at')}),
        ('System', {'fields': ('created_at',)}),
    )

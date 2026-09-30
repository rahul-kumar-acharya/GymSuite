from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'gym', 'category', 'amount', 'expense_date', 'created_at')
    list_filter = ('category', 'gym', 'expense_date')
    search_fields = ('title', 'notes')
    list_select_related = ('gym',)
    autocomplete_fields = ('gym',)
    readonly_fields = ('created_at',)
    date_hierarchy = 'expense_date'
    ordering = ('-expense_date', '-created_at')

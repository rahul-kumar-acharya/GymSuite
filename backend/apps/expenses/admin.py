from django.contrib import admin
from .models import Expense

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'gym', 'category', 'amount', 'expense_date', 'created_at')
    list_filter = ('category', 'gym', 'expense_date')
    search_fields = ('title', 'notes')

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'gym', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'gym')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    fieldsets = BaseUserAdmin.fieldsets + (
        ('GymSuite Multi-Tenant Info', {'fields': ('role', 'gym', 'phone', 'avatar')}),
    )

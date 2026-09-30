from django.contrib import admin
from .models import Gym
from apps.accounts.models import User


class GymUserInline(admin.TabularInline):
    model = User
    extra = 0
    can_delete = False
    fields = ('username', 'email', 'role', 'is_active', 'email_verified')
    readonly_fields = fields
    show_change_link = True

@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ('name', 'status_badge', 'city', 'state', 'code_prefix', 'trial_ends_at', 'created_at')
    list_filter = ('status', 'city', 'state')
    search_fields = ('name', 'phone', 'email', 'city', 'code_prefix')
    readonly_fields = ('created_at', 'updated_at')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    list_per_page = 30
    inlines = [GymUserInline]

    @admin.display(description='Status', ordering='status')
    def status_badge(self, obj):
        return obj.get_status_display()

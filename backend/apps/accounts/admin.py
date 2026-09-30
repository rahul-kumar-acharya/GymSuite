from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import AuditLog, User

admin.site.site_header = 'GymSuite Administration'
admin.site.site_title = 'GymSuite Admin'
admin.site.index_title = 'GymSuite platform operations'

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'full_name', 'role', 'gym', 'email_verified', 'is_active', 'last_login')
    list_filter = ('role', 'is_staff', 'is_superuser', 'is_active', 'gym')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone')
    list_select_related = ('gym',)
    ordering = ('-date_joined',)
    readonly_fields = ('last_login', 'date_joined', 'email_verified')
    list_per_page = 40
    fieldsets = BaseUserAdmin.fieldsets + (
        ('GymSuite account', {'fields': ('role', 'gym', 'phone', 'avatar', 'email_verified')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('GymSuite account', {'fields': ('email', 'first_name', 'last_name', 'role', 'gym', 'phone', 'email_verified')}),
    )

    @admin.display(description='Name', ordering='first_name')
    def full_name(self, obj):
        return obj.get_full_name() or obj.username


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('created_at', 'action', 'entity', 'entity_id', 'user', 'gym')
    list_filter = ('action', 'entity', 'gym', 'created_at')
    search_fields = ('action', 'entity', 'entity_id', 'user__username', 'user__email', 'metadata')
    list_select_related = ('user', 'gym')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('gym', 'user', 'action', 'entity', 'entity_id', 'metadata', 'created_at')
    list_per_page = 50

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

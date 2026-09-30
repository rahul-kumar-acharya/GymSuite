from django.contrib import admin
from .models import Member

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_id_code', 'full_name', 'phone', 'email', 'gym', 'status', 'joined_date')
    list_filter = ('status', 'gender', 'gym')
    search_fields = ('member_id_code', 'full_name', 'phone', 'email')
    list_select_related = ('gym', 'user')
    autocomplete_fields = ('gym', 'user')
    readonly_fields = ('member_id_code', 'joined_date')
    date_hierarchy = 'joined_date'
    ordering = ('-joined_date', '-id')
    list_per_page = 40
    fieldsets = (
        ('Identity', {'fields': ('member_id_code', 'full_name', 'photo', 'gender', 'dob')}),
        ('Contact', {'fields': ('email', 'phone', 'emergency_contact', 'user')}),
        ('GymSuite status', {'fields': ('gym', 'status', 'joined_date', 'notes')}),
    )

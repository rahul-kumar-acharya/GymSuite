from django.contrib import admin
from .models import Member

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('member_id_code', 'full_name', 'phone', 'email', 'gym', 'status', 'joined_date')
    list_filter = ('status', 'gender', 'gym')
    search_fields = ('member_id_code', 'full_name', 'phone', 'email')

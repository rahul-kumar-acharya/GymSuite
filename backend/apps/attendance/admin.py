from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('member', 'gym', 'date', 'check_in', 'check_out', 'method')
    list_filter = ('date', 'method', 'gym')
    search_fields = ('member__full_name', 'member__member_id_code')

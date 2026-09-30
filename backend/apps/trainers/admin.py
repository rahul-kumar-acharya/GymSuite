from django.contrib import admin
from .models import TrainerProfile

@admin.register(TrainerProfile)
class TrainerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'gym', 'specialization', 'salary_monthly', 'created_at')
    list_filter = ('gym',)
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'specialization')
    list_select_related = ('user', 'gym')
    autocomplete_fields = ('user', 'gym')
    filter_horizontal = ('assigned_members',)
    readonly_fields = ('created_at',)
    ordering = ('user__first_name', 'user__last_name')

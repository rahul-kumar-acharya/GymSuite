from django.contrib import admin
from .models import Gym

@admin.register(Gym)
class GymAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'city', 'code_prefix', 'status', 'trial_ends_at', 'created_at')
    list_filter = ('status', 'city', 'state')
    search_fields = ('name', 'phone', 'email', 'city', 'code_prefix')

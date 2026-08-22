from django.contrib import admin
from .models import SaaSPlan, GymSubscription

@admin.register(SaaSPlan)
class SaaSPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'price_monthly', 'max_members', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name', 'slug', 'description')

@admin.register(GymSubscription)
class GymSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('gym', 'plan', 'status', 'trial_start', 'trial_end', 'active_until')
    list_filter = ('status', 'plan')
    search_fields = ('gym__name',)

from django.contrib import admin
from .models import MembershipPlan, MemberMembership

@admin.register(MembershipPlan)
class MembershipPlanAdmin(admin.ModelAdmin):
    list_display = ('name', 'gym', 'duration_days', 'price', 'is_active', 'created_at')
    list_filter = ('is_active', 'gym')
    search_fields = ('name', 'description')

@admin.register(MemberMembership)
class MemberMembershipAdmin(admin.ModelAdmin):
    list_display = ('member', 'plan', 'gym', 'start_date', 'end_date', 'status', 'price_at_purchase')
    list_filter = ('status', 'gym', 'plan')
    search_fields = ('member__full_name', 'member__member_id_code', 'plan__name')

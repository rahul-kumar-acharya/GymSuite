from django.db import models
from apps.gyms.models import Gym
from apps.members.models import Member
from django.utils import timezone
from datetime import timedelta

class MembershipPlan(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='plans')
    name = models.CharField(max_length=100) # Monthly, Quarterly, Half-Yearly, Yearly, Custom
    description = models.TextField(blank=True, null=True)
    duration_days = models.IntegerField(default=30)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price} ({self.duration_days} days)"

class MemberMembership(models.Model):
    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('EXPIRING_SOON', 'Expiring Soon'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='member_memberships')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='memberships')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True, related_name='assigned_memberships')
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-end_date']

    def save(self, *args, **kwargs):
        if not self.end_date and self.plan:
            self.end_date = self.start_date + timedelta(days=self.plan.duration_days)
        super().save(*args, **kwargs)

    @property
    def days_remaining(self):
        today = timezone.now().date()
        if self.end_date < today:
            return 0
        return (self.end_date - today).days

    def __str__(self):
        return f"{self.member.full_name} - {self.plan.name if self.plan else 'Plan'} ({self.start_date} to {self.end_date})"

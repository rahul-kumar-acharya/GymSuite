from django.db import models
from apps.gyms.models import Gym
from django.utils import timezone
from datetime import timedelta

class SaaSPlan(models.Model):
    name = models.CharField(max_length=100) # Starter, Professional, Premium
    slug = models.SlugField(unique=True)
    price_monthly = models.DecimalField(max_digits=10, decimal_places=2) # 499, 999, 1499
    max_members = models.IntegerField(default=100) # 100, 500, unlimited (-1)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - ₹{self.price_monthly}/mo"

class GymSubscription(models.Model):
    STATUS_CHOICES = (
        ('TRIAL', '30-Day Free Trial'),
        ('ACTIVE', 'Active Subscription'),
        ('EXPIRED', 'Expired'),
        ('CANCELLED', 'Cancelled'),
    )

    gym = models.OneToOneField(Gym, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SaaSPlan, on_delete=models.SET_NULL, null=True, related_name='subscriptions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIAL')
    trial_start = models.DateTimeField(auto_now_add=True)
    trial_end = models.DateTimeField(null=True, blank=True)
    active_until = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.trial_end:
            self.trial_end = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    @property
    def days_left(self):
        now = timezone.now()
        target = self.active_until if self.status == 'ACTIVE' and self.active_until else self.trial_end
        if not target or target < now:
            return 0
        return (target - now).days

    def __str__(self):
        return f"{self.gym.name} - {self.get_status_display()}"

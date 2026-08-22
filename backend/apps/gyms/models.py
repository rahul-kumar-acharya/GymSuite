from django.db import models
from django.utils import timezone
from datetime import timedelta

class Gym(models.Model):
    STATUS_CHOICES = (
        ('TRIAL', '30-Day Free Trial'),
        ('ACTIVE', 'Active Subscription'),
        ('PAST_DUE', 'Past Due'),
        ('SUSPENDED', 'Suspended'),
    )

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    logo = models.ImageField(upload_to='gym_logos/', blank=True, null=True)
    code_prefix = models.CharField(max_length=10, default='GM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIAL')
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.trial_ends_at:
            self.trial_ends_at = timezone.now() + timedelta(days=30)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

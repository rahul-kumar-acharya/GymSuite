from django.db import models
from apps.gyms.models import Gym
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    TYPE_CHOICES = (
        ('MEMBERSHIP_EXPIRING', 'Membership Expiring Soon'),
        ('PAYMENT_RECEIVED', 'Payment Received'),
        ('PAYMENT_PENDING', 'Payment Pending Alert'),
        ('TRIAL_ALERT', 'SaaS Trial Expiry Alert'),
        ('SYSTEM', 'System Alert'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='notifications')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES, default='SYSTEM')
    channel = models.CharField(max_length=20, default='IN_APP')
    delivery_status = models.CharField(max_length=20, default='PENDING')
    dedupe_key = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.get_notification_type_display()}] {self.title}"

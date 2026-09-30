from django.contrib.auth.models import AbstractUser
from django.db import models
from apps.gyms.models import Gym

class User(AbstractUser):
    ROLE_CHOICES = (
        ('SUPERADMIN', 'Super Admin'),
        ('OWNER', 'Gym Owner'),
        ('MANAGER', 'Manager'),
        ('STAFF', 'Staff'),
        ('TRAINER', 'Trainer'),
        ('MEMBER', 'Member'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    phone = models.CharField(max_length=20, blank=True, null=True)
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, null=True, blank=True, related_name='users')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    email_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class AuditLog(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, null=True, blank=True, related_name='audit_logs')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='audit_logs')
    action = models.CharField(max_length=100)
    entity = models.CharField(max_length=100)
    entity_id = models.CharField(max_length=100, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

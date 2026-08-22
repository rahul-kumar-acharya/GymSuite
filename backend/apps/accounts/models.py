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

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

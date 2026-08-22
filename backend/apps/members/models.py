from django.db import models
from apps.gyms.models import Gym
from django.contrib.auth import get_user_model

User = get_user_model()

class Member(models.Model):
    GENDER_CHOICES = (
        ('MALE', 'Male'),
        ('FEMALE', 'Female'),
        ('OTHER', 'Other'),
    )

    STATUS_CHOICES = (
        ('ACTIVE', 'Active'),
        ('EXPIRING_SOON', 'Expiring Soon'),
        ('EXPIRED', 'Expired'),
        ('INACTIVE', 'Inactive'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='members')
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='member_profile')
    member_id_code = models.CharField(max_length=50)
    full_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='MALE')
    dob = models.DateField(null=True, blank=True)
    emergency_contact = models.CharField(max_length=50, blank=True, null=True)
    photo = models.ImageField(upload_to='member_photos/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    joined_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-joined_date', '-id']

    def save(self, *args, **kwargs):
        if not self.member_id_code and self.gym:
            prefix = self.gym.code_prefix or 'GM'
            count = Member.objects.filter(gym=self.gym).count() + 1
            self.member_id_code = f"{prefix}-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.member_id_code} - {self.full_name}"

from django.db import models
from apps.gyms.models import Gym
from django.contrib.auth import get_user_model
from apps.members.models import Member

User = get_user_model()

class TrainerProfile(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='trainers')
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='trainer_profile')
    specialization = models.CharField(max_length=255, default='General Fitness & Bodybuilding')
    bio = models.TextField(blank=True, null=True)
    salary_monthly = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    assigned_members = models.ManyToManyField(Member, blank=True, related_name='assigned_trainers')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} ({self.specialization})"

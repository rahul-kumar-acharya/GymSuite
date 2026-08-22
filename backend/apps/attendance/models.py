from django.db import models
from apps.gyms.models import Gym
from apps.members.models import Member
from django.utils import timezone

class Attendance(models.Model):
    METHOD_CHOICES = (
        ('MANUAL', 'Manual Check-in'),
        ('QR', 'QR Scanner'),
        ('BIOMETRIC', 'Biometric'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='attendances')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField(default=timezone.now)
    check_in = models.TimeField(default=timezone.now)
    check_out = models.TimeField(null=True, blank=True)
    method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='MANUAL')
    notes = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ['-date', '-check_in']
        unique_together = ('gym', 'member', 'date')

    def __str__(self):
        return f"{self.member.full_name} - {self.date} ({self.check_in.strftime('%H:%M')})"

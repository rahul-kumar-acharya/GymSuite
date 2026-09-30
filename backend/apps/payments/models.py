from django.db import models
from apps.gyms.models import Gym
from apps.members.models import Member
from apps.memberships.models import MemberMembership
from django.utils import timezone

class Payment(models.Model):
    STATUS_CHOICES = (
        ('PAID', 'Fully Paid'),
        ('PENDING', 'Pending'),
        ('PARTIAL', 'Partially Paid'),
        ('REFUNDED', 'Refunded'),
    )

    METHOD_CHOICES = (
        ('CASH', 'Cash'),
        ('UPI', 'UPI / GPay / PhonePe'),
        ('CARD', 'Credit/Debit Card'),
        ('ONLINE', 'Online Gateway'),
        ('OTHER', 'Other'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='payments')
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payments')
    member_membership = models.ForeignKey(MemberMembership, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    
    receipt_no = models.CharField(max_length=50, blank=True, null=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PAID')
    payment_method = models.CharField(max_length=20, choices=METHOD_CHOICES, default='UPI')
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    payment_date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)
    refunded_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    refund_reason = models.CharField(max_length=255, blank=True, null=True)
    refunded_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-payment_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.receipt_no and self.gym:
            prefix = self.gym.code_prefix or 'GM'
            count = Payment.objects.filter(gym=self.gym).count() + 1
            self.receipt_no = f"REC-{prefix}-{count:05d}"
        super().save(*args, **kwargs)

    @property
    def due_amount(self):
        return max(0, self.total_amount - self.amount_paid)

    def __str__(self):
        return f"{self.receipt_no} - {self.member.full_name} (₹{self.amount_paid})"

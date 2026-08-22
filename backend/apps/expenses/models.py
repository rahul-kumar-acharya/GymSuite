from django.db import models
from apps.gyms.models import Gym
from django.utils import timezone

class Expense(models.Model):
    CATEGORY_CHOICES = (
        ('RENT', 'Gym Rent'),
        ('ELECTRICITY', 'Electricity & Water'),
        ('EQUIPMENT', 'Equipment & Repairs'),
        ('MAINTENANCE', 'Facility Maintenance'),
        ('SALARY', 'Staff & Trainer Salary'),
        ('MARKETING', 'Marketing & Ads'),
        ('OTHER', 'Other Expenses'),
    )

    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='OTHER')
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    expense_date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-expense_date', '-created_at']

    def __str__(self):
        return f"{self.title} - ₹{self.amount} ({self.get_category_display()})"

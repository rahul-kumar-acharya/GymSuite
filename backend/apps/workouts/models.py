from django.db import models
from apps.gyms.models import Gym
from apps.members.models import Member
from django.contrib.auth import get_user_model

User = get_user_model()

class WorkoutPlan(models.Model):
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='workout_plans')
    title = models.CharField(max_length=255) # e.g. "Hypertrophy 4-Day Split"
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_workout_plans')
    assigned_members = models.ManyToManyField(Member, blank=True, related_name='workout_plans')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class WorkoutDay(models.Model):
    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='days')
    day_name = models.CharField(max_length=100) # e.g. "Day 1 - Chest & Triceps"
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.workout_plan.title} - {self.day_name}"

class WorkoutExercise(models.Model):
    workout_day = models.ForeignKey(WorkoutDay, on_delete=models.CASCADE, related_name='exercises')
    exercise_name = models.CharField(max_length=255) # e.g. "Flat Barbell Bench Press"
    sets = models.IntegerField(default=4)
    reps = models.CharField(max_length=50, default='10-12')
    rest_seconds = models.IntegerField(default=60)
    notes = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.exercise_name} ({self.sets} x {self.reps})"

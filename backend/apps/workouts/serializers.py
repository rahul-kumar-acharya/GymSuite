from rest_framework import serializers
from .models import WorkoutPlan, WorkoutDay, WorkoutExercise

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'workout_day', 'exercise_name', 'sets', 'reps', 'rest_seconds', 'notes']

class WorkoutDaySerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, read_only=True)

    class Meta:
        model = WorkoutDay
        fields = ['id', 'workout_plan', 'day_name', 'order', 'exercises']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    days = WorkoutDaySerializer(many=True, read_only=True)
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'gym', 'title', 'description', 'created_by', 'created_by_name', 'assigned_members', 'days', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

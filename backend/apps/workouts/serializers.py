from rest_framework import serializers
from .models import WorkoutPlan, WorkoutDay, WorkoutExercise

class WorkoutExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutExercise
        fields = ['id', 'workout_day', 'exercise_name', 'sets', 'reps', 'rest_seconds', 'notes']
        read_only_fields = ['id', 'workout_day']

class WorkoutDaySerializer(serializers.ModelSerializer):
    exercises = WorkoutExerciseSerializer(many=True, required=False)

    class Meta:
        model = WorkoutDay
        fields = ['id', 'workout_plan', 'day_name', 'order', 'exercises']
        read_only_fields = ['id', 'workout_plan']

class WorkoutPlanSerializer(serializers.ModelSerializer):
    days = WorkoutDaySerializer(many=True, required=False)
    created_by_name = serializers.ReadOnlyField(source='created_by.get_full_name')

    class Meta:
        model = WorkoutPlan
        fields = ['id', 'gym', 'title', 'description', 'created_by', 'created_by_name', 'assigned_members', 'days', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        gym = request.user.gym if request else None
        members = attrs.get('assigned_members')
        if gym and members and any(member.gym_id != gym.id for member in members):
            raise serializers.ValidationError({'assigned_members': 'All members must belong to this gym.'})
        return attrs

    def create(self, validated_data):
        days_data = validated_data.pop('days', [])
        assigned_members = validated_data.pop('assigned_members', [])
        plan = WorkoutPlan.objects.create(**validated_data)
        plan.assigned_members.set(assigned_members)
        for day_data in days_data:
            exercises = day_data.pop('exercises', [])
            day = WorkoutDay.objects.create(workout_plan=plan, **day_data)
            for exercise_data in exercises:
                WorkoutExercise.objects.create(workout_day=day, **exercise_data)
        return plan

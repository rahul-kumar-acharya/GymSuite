from django.contrib import admin
from .models import WorkoutPlan, WorkoutDay, WorkoutExercise

class WorkoutExerciseInline(admin.TabularInline):
    model = WorkoutExercise
    extra = 1

class WorkoutDayInline(admin.StackedInline):
    model = WorkoutDay
    extra = 1

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'gym', 'created_by', 'created_at')
    list_filter = ('gym',)
    search_fields = ('title', 'description')
    inlines = [WorkoutDayInline]

@admin.register(WorkoutDay)
class WorkoutDayAdmin(admin.ModelAdmin):
    list_display = ('day_name', 'workout_plan', 'order')
    inlines = [WorkoutExerciseInline]

@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ('exercise_name', 'workout_day', 'sets', 'reps', 'rest_seconds')

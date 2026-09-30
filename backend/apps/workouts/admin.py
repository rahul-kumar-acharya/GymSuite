from django.contrib import admin
from .models import WorkoutPlan, WorkoutDay, WorkoutExercise

class WorkoutExerciseInline(admin.TabularInline):
    model = WorkoutExercise
    extra = 1

class WorkoutDayInline(admin.StackedInline):
    model = WorkoutDay
    extra = 1
    show_change_link = True

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('title', 'gym', 'created_by', 'created_at')
    list_filter = ('gym',)
    search_fields = ('title', 'description')
    inlines = [WorkoutDayInline]
    list_select_related = ('gym', 'created_by')
    autocomplete_fields = ('gym', 'created_by')
    filter_horizontal = ('assigned_members',)
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)

@admin.register(WorkoutDay)
class WorkoutDayAdmin(admin.ModelAdmin):
    list_display = ('day_name', 'workout_plan', 'order')
    search_fields = ('day_name', 'workout_plan__title')
    inlines = [WorkoutExerciseInline]
    list_select_related = ('workout_plan',)
    autocomplete_fields = ('workout_plan',)
    ordering = ('workout_plan', 'order')

@admin.register(WorkoutExercise)
class WorkoutExerciseAdmin(admin.ModelAdmin):
    list_display = ('exercise_name', 'workout_day', 'sets', 'reps', 'rest_seconds')
    list_filter = ('sets', 'rest_seconds')
    search_fields = ('exercise_name', 'notes', 'workout_day__day_name', 'workout_day__workout_plan__title')
    list_select_related = ('workout_day', 'workout_day__workout_plan')
    autocomplete_fields = ('workout_day',)

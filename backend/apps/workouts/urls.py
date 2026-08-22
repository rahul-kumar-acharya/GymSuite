from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutPlanViewSet, WorkoutDayViewSet, WorkoutExerciseViewSet

router = DefaultRouter()
router.register(r'plans', WorkoutPlanViewSet, basename='workoutplan')
router.register(r'days', WorkoutDayViewSet, basename='workoutday')
router.register(r'exercises', WorkoutExerciseViewSet, basename='workoutexercise')

urlpatterns = [
    path('', include(router.urls)),
]

from rest_framework import viewsets, filters
from .models import WorkoutPlan, WorkoutDay, WorkoutExercise
from .serializers import WorkoutPlanSerializer, WorkoutDaySerializer, WorkoutExerciseSerializer
from apps.accounts.permissions import CanManageWorkouts, CanViewWorkouts

class WorkoutPlanViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [CanManageWorkouts]

    def get_permissions(self):
        if self.action in {'list', 'retrieve'}:
            return [CanViewWorkouts()]
        return super().get_permissions()
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return WorkoutPlan.objects.none()
        # If member role, return plans assigned to this member
        if user.role == 'MEMBER' and hasattr(user, 'member_profile'):
            return WorkoutPlan.objects.filter(gym=user.gym, assigned_members=user.member_profile)
        if user.role == 'TRAINER':
            return WorkoutPlan.objects.filter(gym=user.gym, created_by=user)
        return WorkoutPlan.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym, created_by=self.request.user)

class WorkoutDayViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutDaySerializer
    permission_classes = [CanManageWorkouts]

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return WorkoutDay.objects.none()
        return WorkoutDay.objects.filter(workout_plan__gym=user.gym)

class WorkoutExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutExerciseSerializer
    permission_classes = [CanManageWorkouts]

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return WorkoutExercise.objects.none()
        return WorkoutExercise.objects.filter(workout_day__workout_plan__gym=user.gym)

from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import TrainerProfile
from .serializers import TrainerProfileSerializer

class TrainerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = TrainerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'specialization']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return TrainerProfile.objects.none()
        return TrainerProfile.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

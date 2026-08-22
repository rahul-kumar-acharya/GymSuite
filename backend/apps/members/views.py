from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Member
from .serializers import MemberSerializer

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'gender']
    search_fields = ['full_name', 'email', 'phone', 'member_id_code']
    ordering_fields = ['joined_date', 'full_name']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return Member.objects.none()
        return Member.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

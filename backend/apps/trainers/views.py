from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import TrainerProfile
from .serializers import TrainerProfileSerializer
from apps.accounts.permissions import CanManageTrainers, CanViewGymData
from apps.members.models import Member

User = get_user_model()

class TrainerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = TrainerProfileSerializer
    permission_classes = [CanManageTrainers]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'specialization']

    def get_queryset(self):
        user = self.request.user
        if not user.gym:
            return TrainerProfile.objects.none()
        return TrainerProfile.objects.filter(gym=user.gym)

    def perform_create(self, serializer):
        serializer.save(gym=self.request.user.gym)

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', '').strip().lower()
        if not email or not request.data.get('password') or not request.data.get('full_name'):
            return Response({'detail': 'full_name, email, and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email__iexact=email).exists():
            return Response({'detail': 'An account with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            name_parts = request.data['full_name'].strip().split(' ', 1)
            user = User.objects.create_user(
                username=email,
                email=email,
                password=request.data['password'],
                first_name=name_parts[0],
                last_name=name_parts[1] if len(name_parts) > 1 else '',
                phone=request.data.get('phone', ''),
                role='TRAINER',
                gym=request.user.gym,
            )
            trainer = TrainerProfile.objects.create(
                gym=request.user.gym,
                user=user,
                specialization=request.data.get('specialization', 'General Fitness & Bodybuilding'),
                bio=request.data.get('bio', ''),
                salary_monthly=request.data.get('salary_monthly', 0),
            )
        return Response(self.get_serializer(trainer).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        trainer = self.get_object()
        member = Member.objects.filter(id=request.data.get('member_id'), gym=request.user.gym).first()
        if not member:
            return Response({'detail': 'Member does not belong to this gym.'}, status=status.HTTP_400_BAD_REQUEST)
        trainer.assigned_members.add(member)
        return Response(self.get_serializer(trainer).data)

    @action(detail=True, methods=['post'])
    def unassign(self, request, pk=None):
        trainer = self.get_object()
        trainer.assigned_members.remove(request.data.get('member_id'))
        return Response(self.get_serializer(trainer).data)

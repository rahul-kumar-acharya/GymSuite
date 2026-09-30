from rest_framework import generics, status, permissions, viewsets
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.tokens import default_token_generator
from .serializers import AuditLogSerializer, PasswordResetConfirmSerializer, PasswordResetRequestSerializer, StaffSerializer, UserSerializer, VerifyEmailSerializer, CustomTokenObtainPairSerializer, RegisterOwnerSerializer
from .permissions import CanManageStaff, CanViewAuditLogs
from .models import AuditLog
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterOwnerView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterOwnerSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Gym and Owner account created successfully with 30-day Free Trial.',
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
                'gym': user.gym.id,
                'gym_name': user.gym.name
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class PasswordResetRequestView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetRequestSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'If the email exists, a reset link has been sent.'})


class PasswordResetConfirmView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PasswordResetConfirmSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Password reset successfully.'})


class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = VerifyEmailSerializer

    def post(self, request):
        user = User.objects.filter(pk=request.data.get('uid'), is_active=True).first()
        token = request.data.get('token')
        if not user or not token or not default_token_generator.check_token(user, token):
            return Response({'detail': 'Verification link is invalid or expired.'}, status=status.HTTP_400_BAD_REQUEST)
        user.email_verified = True
        user.save(update_fields=['email_verified'])
        return Response({'message': 'Email verified successfully.'})


class StaffViewSet(viewsets.ModelViewSet):
    serializer_class = StaffSerializer
    permission_classes = [CanManageStaff]
    http_method_names = ['get', 'post', 'patch', 'put', 'delete', 'head', 'options']

    def get_queryset(self):
        return User.objects.filter(gym=self.request.user.gym, role__in=['MANAGER', 'STAFF']).order_by('-date_joined')


class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = AuditLogSerializer
    permission_classes = [CanViewAuditLogs]

    def get_queryset(self):
        queryset = AuditLog.objects.select_related('user')
        if not self.request.user.is_superuser:
            queryset = queryset.filter(gym=self.request.user.gym)
        return queryset

from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.routers import DefaultRouter
from .views import (
    CustomTokenObtainPairView,
    PasswordResetConfirmView,
    PasswordResetRequestView,
    RegisterOwnerView,
    AuditLogViewSet,
    StaffViewSet,
    UserProfileView,
    VerifyEmailView,
)

router = DefaultRouter()
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'audit-logs', AuditLogViewSet, basename='audit-log')

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='auth_login'),
    path('register/', RegisterOwnerView.as_view(), name='auth_register'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='auth_profile'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify_email'),
    path('', include(router.urls)),
]

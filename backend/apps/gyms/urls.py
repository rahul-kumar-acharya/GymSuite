from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CurrentGymView, SuperAdminStatsView, SuperAdminGymViewSet, SuperAdminUserViewSet

router = DefaultRouter()
router.register(r'superadmin/all-gyms', SuperAdminGymViewSet, basename='superadmin_gyms')
router.register(r'superadmin/all-users', SuperAdminUserViewSet, basename='superadmin_users')

urlpatterns = [
    path('profile/', CurrentGymView.as_view(), name='gym_profile'),
    path('superadmin/stats/', SuperAdminStatsView.as_view(), name='superadmin_stats'),
    path('', include(router.urls)),
]

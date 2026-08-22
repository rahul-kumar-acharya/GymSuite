from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembershipPlanViewSet, MemberMembershipViewSet

router = DefaultRouter()
router.register(r'plans', MembershipPlanViewSet, basename='membershipplan')
router.register(r'assigned', MemberMembershipViewSet, basename='membermembership')

urlpatterns = [
    path('', include(router.urls)),
]

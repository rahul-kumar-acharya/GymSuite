from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CurrentGymSubscriptionView, PublicSaaSPlanListView, SaaSPlanViewSet

router = DefaultRouter()
router.register(r'plans', SaaSPlanViewSet, basename='saas-plan')

urlpatterns = [
    path('', include(router.urls)),
    path('public-plans/', PublicSaaSPlanListView.as_view(), name='public_saas_plans'),
    path('my-subscription/', CurrentGymSubscriptionView.as_view(), name='my_subscription'),
]

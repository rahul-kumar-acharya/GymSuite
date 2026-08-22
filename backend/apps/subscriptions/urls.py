from django.urls import path
from .views import PublicSaaSPlanListView, CurrentGymSubscriptionView

urlpatterns = [
    path('plans/', PublicSaaSPlanListView.as_view(), name='saas_plans'),
    path('my-subscription/', CurrentGymSubscriptionView.as_view(), name='my_subscription'),
]

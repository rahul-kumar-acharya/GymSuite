from django.urls import path
from .views import DashboardStatsView, PaymentsCsvView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='report_dashboard'),
    path('payments.csv', PaymentsCsvView.as_view(), name='report_payments_csv'),
]

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/gyms/', include('apps.gyms.urls')),
    path('api/v1/members/', include('apps.members.urls')),
    path('api/v1/memberships/', include('apps.memberships.urls')),
    path('api/v1/attendance/', include('apps.attendance.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/trainers/', include('apps.trainers.urls')),
    path('api/v1/workouts/', include('apps.workouts.urls')),
    path('api/v1/expenses/', include('apps.expenses.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/subscriptions/', include('apps.subscriptions.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

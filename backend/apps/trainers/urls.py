from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainerProfileViewSet

router = DefaultRouter()
router.register(r'', TrainerProfileViewSet, basename='trainer')

urlpatterns = [
    path('', include(router.urls)),
]

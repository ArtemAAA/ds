from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoSessionViewSet

router = DefaultRouter()
router.register('sessions', VideoSessionViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 
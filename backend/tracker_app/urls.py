from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VideoSessionViewSet, BrowsingHistoryViewSet

router = DefaultRouter()
router.register('sessions', VideoSessionViewSet)
router.register('history', BrowsingHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 
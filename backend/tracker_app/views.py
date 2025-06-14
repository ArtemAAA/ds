from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import VideoSession, BrowsingHistory
from .serializers import VideoSessionSerializer, BrowsingHistorySerializer

# Create your views here.

class VideoSessionViewSet(ModelViewSet):
    queryset = VideoSession.objects.all()
    serializer_class = VideoSessionSerializer

class BrowsingHistoryViewSet(ModelViewSet):
    queryset = BrowsingHistory.objects.all()
    serializer_class = BrowsingHistorySerializer

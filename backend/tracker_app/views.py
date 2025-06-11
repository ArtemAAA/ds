from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .models import VideoSession
from .serializers import VideoSessionSerializer

# Create your views here.

class VideoSessionViewSet(ModelViewSet):
    queryset = VideoSession.objects.all()
    serializer_class = VideoSessionSerializer

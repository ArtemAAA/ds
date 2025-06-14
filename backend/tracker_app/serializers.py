from rest_framework import serializers
from .models import VideoSession, BrowsingHistory

class VideoSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoSession
        fields = '__all__'

class BrowsingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = BrowsingHistory
        fields = '__all__' 
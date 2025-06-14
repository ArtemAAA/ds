from django.db import models

# Create your models here.

class VideoSession(models.Model):
    url = models.URLField()
    title = models.CharField(max_length=500)
    channel = models.CharField(max_length=200)  
    description = models.TextField(blank=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    total_seconds = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class BrowsingHistory(models.Model):
    url = models.URLField()
    title = models.CharField(max_length=500, blank=True)
    visit_count = models.IntegerField(default=1)
    last_visit = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.title} - {self.url}"

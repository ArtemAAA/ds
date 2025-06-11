from django.contrib import admin
from .models import VideoSession

# Register your models here.

@admin.register(VideoSession)
class VideoSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'channel', 'start_time', 'total_seconds', 'created_at')
    search_fields = ('title', 'channel', 'url')
    list_filter = ('channel', 'start_time', 'created_at')
    readonly_fields = ('created_at',)
    list_per_page = 25

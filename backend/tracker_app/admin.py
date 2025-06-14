from django.contrib import admin
from .models import VideoSession, BrowsingHistory

# Register your models here.

@admin.register(VideoSession)
class VideoSessionAdmin(admin.ModelAdmin):
    list_display = ('title', 'channel', 'start_time', 'total_seconds', 'created_at')
    search_fields = ('title', 'channel', 'url')
    list_filter = ('channel', 'start_time', 'created_at')
    readonly_fields = ('created_at',)
    list_per_page = 25

@admin.register(BrowsingHistory)
class BrowsingHistoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'url', 'visit_count', 'last_visit', 'created_at')
    search_fields = ('title', 'url')
    list_filter = ('last_visit', 'visit_count', 'created_at')
    readonly_fields = ('created_at',)
    list_per_page = 25
    ordering = ('-last_visit',)
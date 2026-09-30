from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'gym', 'user', 'title', 'message', 'is_read', 'notification_type', 'channel', 'delivery_status', 'dedupe_key', 'created_at']
        read_only_fields = ['id', 'gym', 'created_at']

from rest_framework import serializers
from .models import TrainerProfile
from apps.members.serializers import MemberSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class TrainerProfileSerializer(serializers.ModelSerializer):
    trainer_name = serializers.ReadOnlyField(source='user.get_full_name')
    trainer_email = serializers.ReadOnlyField(source='user.email')
    trainer_phone = serializers.ReadOnlyField(source='user.phone')
    assigned_members_count = serializers.IntegerField(source='assigned_members.count', read_only=True)

    class Meta:
        model = TrainerProfile
        fields = [
            'id', 'gym', 'user', 'trainer_name', 'trainer_email', 'trainer_phone',
            'specialization', 'bio', 'salary_monthly', 'assigned_members',
            'assigned_members_count', 'created_at'
        ]
        read_only_fields = ['id', 'gym', 'created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        gym = request.user.gym if request else None
        user = attrs.get('user')
        members = attrs.get('assigned_members')
        if gym and user and user.gym_id != gym.id:
            raise serializers.ValidationError({'user': 'Trainer user must belong to this gym.'})
        if gym and members and any(member.gym_id != gym.id for member in members):
            raise serializers.ValidationError({'assigned_members': 'All members must belong to this gym.'})
        return attrs

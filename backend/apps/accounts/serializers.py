from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from apps.gyms.models import Gym
from apps.subscriptions.models import GymSubscription, SaaSPlan

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    gym_name = serializers.ReadOnlyField(source='gym.name')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'gym', 'gym_name', 'avatar']
        read_only_fields = ['id', 'role', 'gym_name']

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user'] = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'gym': user.gym.id if user.gym else None,
            'gym_name': user.gym.name if user.gym else None,
        }
        return data

class RegisterOwnerSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, min_length=6)
    
    gym_name = serializers.CharField(max_length=255)
    gym_phone = serializers.CharField(max_length=20)
    address = serializers.CharField()
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100)
    pincode = serializers.CharField(max_length=10)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists() or User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address already exists.")
        return value

    def create(self, validated_data):
        with transaction.atomic():
            # 1. Create Gym
            gym = Gym.objects.create(
                name=validated_data['gym_name'],
                phone=validated_data['gym_phone'],
                email=validated_data['email'],
                address=validated_data['address'],
                city=validated_data['city'],
                state=validated_data['state'],
                pincode=validated_data['pincode'],
                status='TRIAL'
            )

            # 2. Split full name
            name_parts = validated_data['full_name'].strip().split(' ', 1)
            first_name = name_parts[0]
            last_name = name_parts[1] if len(name_parts) > 1 else ''

            # 3. Create Owner User
            user = User.objects.create_user(
                username=validated_data['email'],
                email=validated_data['email'],
                password=validated_data['password'],
                first_name=first_name,
                last_name=last_name,
                phone=validated_data['phone'],
                role='OWNER',
                gym=gym
            )

            # 4. Auto-provision Trial SaaS Subscription if SaaSPlan table is ready
            default_plan = SaaSPlan.objects.filter(slug='professional').first() or SaaSPlan.objects.first()
            if default_plan:
                GymSubscription.objects.create(
                    gym=gym,
                    plan=default_plan,
                    status='TRIAL'
                )

            return user

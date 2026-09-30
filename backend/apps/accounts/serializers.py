import secrets

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import transaction
from apps.gyms.models import Gym
from apps.subscriptions.models import GymSubscription, SaaSPlan
from .models import AuditLog

User = get_user_model()


class AuditLogSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = AuditLog
        fields = ['id', 'gym', 'user', 'user_name', 'action', 'entity', 'entity_id', 'metadata', 'created_at']
        read_only_fields = fields

class UserSerializer(serializers.ModelSerializer):
    gym_name = serializers.ReadOnlyField(source='gym.name')

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'gym', 'gym_name', 'avatar', 'email_verified']
        read_only_fields = ['id', 'username', 'role', 'gym', 'gym_name', 'email_verified']

    def validate_email(self, value):
        user = self.instance
        if User.objects.filter(email__iexact=value).exclude(pk=user.pk if user else None).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs['current_password']):
            raise serializers.ValidationError({'current_password': 'Current password is incorrect.'})
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        if attrs['current_password'] == attrs['new_password']:
            raise serializers.ValidationError({'new_password': 'New password must be different.'})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class StaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'role', 'password', 'is_active', 'date_joined']
        read_only_fields = ['id', 'username', 'date_joined']

    def validate_role(self, value):
        if value not in {'MANAGER', 'STAFF'}:
            raise serializers.ValidationError('Staff accounts can only be MANAGER or STAFF.')
        return value

    def create(self, validated_data):
        request = self.context['request']
        password = validated_data.pop('password', None)
        email = validated_data['email'].strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({'email': 'An account with this email already exists.'})
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password or secrets.token_urlsafe(16),
            gym=request.user.gym,
            **validated_data,
        )
        return user

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


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def save(self):
        user = User.objects.filter(email__iexact=self.validated_data['email'], is_active=True).first()
        if user:
            token = default_token_generator.make_token(user)
            url = f"{getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')}/reset-password/{user.pk}/{token}"
            send_mail('Reset your GymSuite password', f'Use this link to reset your password: {url}', None, [user.email], fail_silently=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8, write_only=True)

    def save(self):
        user = User.objects.filter(pk=self.validated_data['uid'], is_active=True).first()
        if not user or not default_token_generator.check_token(user, self.validated_data['token']):
            raise serializers.ValidationError({'token': 'This reset link is invalid or expired.'})
        user.set_password(self.validated_data['new_password'])
        user.save(update_fields=['password'])
        return user


class VerifyEmailSerializer(serializers.Serializer):
    uid = serializers.IntegerField()
    token = serializers.CharField()

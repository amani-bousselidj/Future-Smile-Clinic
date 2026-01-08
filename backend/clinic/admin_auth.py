from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Obtain JWT for staff users using email or username."""

    username_field = "username"

    def validate(self, attrs):
        User = get_user_model()
        identifier = attrs.get("username") or attrs.get("email")
        password = attrs.get("password")

        if not identifier or not password:
            raise serializers.ValidationError("Missing credentials")

        try:
            user = User.objects.get(Q(username__iexact=identifier) | Q(email__iexact=identifier))
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_staff:
            raise serializers.ValidationError("Not allowed")

        # Force username/password auth to SimpleJWT internals
        data = super().validate({"username": user.username, "password": password})
        return data

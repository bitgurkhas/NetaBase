from django.contrib.auth import authenticate, get_user_model
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

User = get_user_model()


# -----------------------------
# User Serializer
# -----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username"]
        read_only_fields = ["id", "username"]


# -----------------------------
# Register Serializer
# -----------------------------
class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        error_messages={"min_length": "Password must be at least 8 characters long."},
    )
    confirm_password = serializers.CharField(write_only=True)

    username = serializers.CharField(
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9_.-]+$",
                message="Username can only contain letters, numbers, dots, hyphens and underscores.",
            )
        ]
    )

    class Meta:
        model = User
        fields = ["username", "password", "confirm_password"]

    def validate_username(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError(
                "Username must be at least 3 characters long."
            )

        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username is already taken.")

        return value

    def validate_password(self, value):
        if value.lower() in ["password", "12345678", "admin", "qwerty"]:
            raise serializers.ValidationError("Password is too common or weak.")

        if value.isdigit():
            raise serializers.ValidationError("Password cannot be entirely numeric.")

        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Passwords do not match."}
            )
        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        username = validated_data["username"].strip()

        user = User(username=username)
        user.set_password(password)
        user.save()
        return user


# -----------------------------
# Login Serializer
# -----------------------------
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username", "").strip()
        password = data.get("password")

        if not username or not password:
            raise serializers.ValidationError("Username and password are required.")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password.")

        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")

        data["user"] = user
        return data


# -----------------------------
# Custom Token Refresh Serializer
# -----------------------------
class MyTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = RefreshToken(attrs["refresh"])
        user_id = refresh["user_id"]

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise InvalidToken("User does not exist anymore.")

        access = AccessToken.for_user(user)
        access["username"] = user.username

        data["access"] = str(access)
        return data

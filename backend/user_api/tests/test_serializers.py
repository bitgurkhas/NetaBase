import pytest
from django.contrib.auth import get_user_model
from user_api.serializers import UserRegisterSerializer, UserLoginSerializer

User = get_user_model()


@pytest.mark.django_db
class TestUserRegisterSerializer:

    def test_valid_data_creates_user(self):
        data = {
            "username": "testuser",
            "password": "StrongPass123",
            "confirm_password": "StrongPass123"
        }

        serializer = UserRegisterSerializer(data=data)
        assert serializer.is_valid(), serializer.errors

        user = serializer.save()
        assert user.username == "testuser" # type: ignore
        assert user.check_password("StrongPass123") # type: ignore

    def test_username_too_short(self):
        data = {
            "username": "ab",
            "password": "StrongPass123",
            "confirm_password": "StrongPass123"
        }

        serializer = UserRegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert "Username must be at least 3 characters long." in str(serializer.errors)

    def test_passwords_do_not_match(self):
        data = {
            "username": "testuser",
            "password": "StrongPass123",
            "confirm_password": "Mismatch123"
        }

        serializer = UserRegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert "Passwords do not match." in str(serializer.errors)

    def test_common_password_rejected(self):
        data = {
            "username": "testuser",
            "password": "password",
            "confirm_password": "password"
        }

        serializer = UserRegisterSerializer(data=data)
        assert not serializer.is_valid()
        assert "Password is too common or weak." in str(serializer.errors)


@pytest.mark.django_db
class TestUserLoginSerializer:

    def test_login_success(self):
        user = User.objects.create_user(username="loginuser", password="StrongPass123")

        data = {
            "username": "loginuser",
            "password": "StrongPass123"
        }

        serializer = UserLoginSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        assert serializer.validated_data["user"] == user # type: ignore

    def test_login_invalid_password(self):
        user = User.objects.create_user(username="loginuser", password="StrongPass123")

        data = {
            "username": "loginuser",
            "password": "wrongpass"
        }

        serializer = UserLoginSerializer(data=data)
        assert not serializer.is_valid()
        assert "Invalid username or password." in str(serializer.errors)

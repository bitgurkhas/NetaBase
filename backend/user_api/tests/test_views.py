import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.mark.django_db
class TestRegisterView:

    def test_register_success(self, api_client):
        url = reverse("register")  

        data = {
            "username": "newuser",
            "password": "StrongPass123",
            "confirm_password": "StrongPass123"
        }

        response = api_client.post(url, data)

        assert response.status_code == 201
        assert response.data["message"] == "User created successfully"
        assert "tokens" in response.data
        assert "access" in response.data["tokens"]
        assert "refresh" in response.data["tokens"]

    def test_register_failure(self, api_client):
        url = reverse("register")

        data = {
            "username": "ab",
            "password": "123",
            "confirm_password": "321"
        }

        response = api_client.post(url, data)

        assert response.status_code == 400
        assert "username" in response.data or "password" in response.data


@pytest.mark.django_db
class TestLoginView:

    def test_login_success(self, api_client):
        User.objects.create_user(username="loginuser", password="StrongPass123")

        url = reverse("login")

        data = {
            "username": "loginuser",
            "password": "StrongPass123"
        }

        response = api_client.post(url, data)

        assert response.status_code == 200
        assert "tokens" in response.data

    def test_login_invalid_credentials(self, api_client):
        url = reverse("login")

        data = {
            "username": "wronguser",
            "password": "wrongpass"
        }

        response = api_client.post(url, data)

        assert response.status_code == 400
        assert "Invalid username or password." in str(response.data)

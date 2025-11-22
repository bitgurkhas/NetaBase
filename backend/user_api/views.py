import random
import string

from django.conf import settings
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken


def generate_unique_username(base_username):
    """Ensures username uniqueness by appending random suffix when conflicts occur."""
    username = base_username
    while User.objects.filter(username=username).exists():
        rand_str = "".join(random.choices(string.ascii_lowercase + string.digits, k=4))
        username = f"{base_username}_{rand_str}"
    return username


def set_refresh_token_cookie(response, refresh_token):
    """Applies security-hardened cookie settings for refresh token storage."""
    cookie_kwargs = {
        "httponly": True,
        "secure": settings.COOKIE_SECURE,
        "samesite": settings.SESSION_COOKIE_SAMESITE,
        "path": "/",
    }

    if settings.COOKIE_DOMAIN:
        cookie_kwargs["domain"] = settings.COOKIE_DOMAIN

    response.set_cookie(
        key="refresh_token",
        value=str(refresh_token),
        max_age=14 * 24 * 60 * 60,
        **cookie_kwargs,
    )


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    """Authenticates user via Google OAuth and issues JWT tokens."""
    token = request.data.get("credential")

    if not token:
        return Response(
            {"error": "No credential provided"}, status=status.HTTP_400_BAD_REQUEST
        )

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        email = idinfo.get("email")
        if not email:
            return Response(
                {"error": "Email not provided by Google"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")
        base_username = email.split("@")[0]
        username = generate_unique_username(base_username)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "first_name": first_name,
                "last_name": last_name,
            },
        )

        if not created:
            user.first_name = first_name
            user.last_name = last_name
            user.save()

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response = Response(
            {
                "user": {
                    "id": user.id,  # type: ignore
                    "username": user.username,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "full_name": f"{user.first_name} {user.last_name}".strip(),
                },
                "access": str(access),
            },
            status=status.HTTP_200_OK,
        )

        set_refresh_token_cookie(response, refresh)
        return response

    except ValueError as e:
        return Response(
            {"error": "Invalid Google token", "detail": str(e)},
            status=status.HTTP_400_BAD_REQUEST,
        )
    except Exception as e:
        return Response(
            {"error": "Authentication failed", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Returns authenticated user's profile information."""
    user = request.user
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "full_name": f"{user.first_name} {user.last_name}".strip(),
        }
    )


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def refresh_token_view(request):
    """Issues new access token and rotates refresh token from httpOnly cookie."""
    refresh_token = request.COOKIES.get("refresh_token")

    if not refresh_token:
        return Response(
            {"error": "No refresh token provided"}, status=status.HTTP_401_UNAUTHORIZED
        )

    try:
        refresh = RefreshToken(refresh_token)
        access = refresh.access_token

        response = Response({"access": str(access)}, status=status.HTTP_200_OK)

        # Rotate refresh token when ROTATE_REFRESH_TOKENS is enabled
        set_refresh_token_cookie(response, refresh)
        return response

    except TokenError as e:
        return Response(
            {"error": "Invalid or expired refresh token"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except Exception as e:
        return Response(
            {"error": "Token refresh failed", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def logout(request):
    """Blacklists refresh token and clears authentication cookie."""
    refresh_token = request.COOKIES.get("refresh_token")

    if refresh_token:
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            pass
        except Exception as e:
            print(f"Error during token blacklist: {e}")

    response = Response(
        {"detail": "Successfully logged out"}, status=status.HTTP_200_OK
    )

    cookie_kwargs = {"path": "/"}
    if settings.COOKIE_DOMAIN:
        cookie_kwargs["domain"] = settings.COOKIE_DOMAIN

    response.delete_cookie("refresh_token", **cookie_kwargs)
    return response

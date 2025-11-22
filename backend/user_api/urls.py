from django.urls import path
from rest_framework.routers import DefaultRouter

from user_api.views import google_login, logout, me, refresh_token_view

router = DefaultRouter()


urlpatterns = [
    path("me/", me, name="me"),
    path("logout/", logout, name="logout"),
    # Google Login
    path("google/login/", google_login, name="google-login"),
    path("token/refresh/", refresh_token_view, name="token_refresh"),
]

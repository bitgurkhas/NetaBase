from django.urls import path
from user_api.views import google_login
from user_api.views import refresh_token_view, logout, me
from rest_framework.routers import DefaultRouter

router = DefaultRouter()


urlpatterns = [
    path('me/', me, name='me'),
    path('logout/', logout, name='logout'),
    
    #Google Login
    path("google/login/", google_login, name="google-login"),
    
    path('token/refresh/', refresh_token_view, name='token_refresh'),
]

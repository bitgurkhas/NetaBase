from django.urls import path
from user_api.views import LoginView, RegisterView
from user_api.serializers import MyTokenRefreshSerializer
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()


#for jwt to send username when getting access token with refresh tiken
class MyTokenRefreshView(TokenRefreshView):
    serializer_class = MyTokenRefreshSerializer
    
urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('register/', RegisterView.as_view(), name="register"),
    path('token/refresh/', MyTokenRefreshView.as_view(),name='token_refresh'),
]

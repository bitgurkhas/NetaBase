from django.urls import path
from news_api.views import PoliticsNewsAPIView

urlpatterns = [
    path("news/", PoliticsNewsAPIView.as_view()),
]

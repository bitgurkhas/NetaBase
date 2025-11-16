from django.urls import path
from politicians.views import (
    PoliticianDetailView,
    PoliticianListView,
    PoliticianRatingListCreateView,
    PoliticianRatingDetailView
)

urlpatterns = [
    # Politician list & detail
    path("politicians/", PoliticianListView.as_view(), name="politician-list"),
    path("politicians/<slug:slug>/", PoliticianDetailView.as_view(), name="politician-detail"),
    
    # Ratings for a politician
    path("politicians/<slug:slug>/ratings/", PoliticianRatingListCreateView.as_view(), name="politician-ratings"),
    path("ratings/<int:pk>/", PoliticianRatingDetailView.as_view(), name="rating-detail"),
]
from django.urls import path

from politicians.views import (
    PartyDetailView,
    PartyListView,
    PartyPoliticiansView,
    PoliticianDetailView,
    PoliticianListView,
    PoliticianRatingDetailView,
    PoliticianRatingListCreateView,
)

urlpatterns = [
    # Party routes
    path("parties/", PartyListView.as_view(), name="party-list"),
    path("parties/<slug:slug>/", PartyDetailView.as_view(), name="party-detail"),
    path(
        "parties/<slug:slug>/politicians/",
        PartyPoliticiansView.as_view(),
        name="party-politicians",
    ),
    # Politician list & detail
    path("politicians/", PoliticianListView.as_view(), name="politician-list"),
    path(
        "politicians/<slug:slug>/",
        PoliticianDetailView.as_view(),
        name="politician-detail",
    ),
    # Ratings for a politician
    path(
        "politicians/<slug:slug>/ratings/",
        PoliticianRatingListCreateView.as_view(),
        name="politician-ratings",
    ),
    path(
        "ratings/<int:pk>/", PoliticianRatingDetailView.as_view(), name="rating-detail"
    ),
]

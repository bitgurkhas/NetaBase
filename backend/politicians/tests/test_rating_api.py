import pytest
from django.urls import reverse
from rest_framework.test import APIClient


# ---------------------------
# RATING LIST + CREATE
# ---------------------------
@pytest.mark.django_db
def test_rating_list_and_create(politician_factory, user_factory, rating_factory):
    pol = politician_factory()
    user = user_factory()

    rating_factory(politician=pol, user=user, score=4)

    url = reverse("politician-ratings", args=[pol.slug])
    client = APIClient()

    # LIST (no auth needed)
    response = client.get(url)
    assert response.status_code == 200 # type: ignore
    assert response.data["results"][0]["score"] == 4 # type: ignore

    # CREATE (auth required)
    client.force_authenticate(user=user)
    response2 = client.post(url, {"score": 5, "comment": "ok"}, format="json")

    assert response2.status_code in (200, 201)# type: ignore


# ---------------------------
# RATING: UPDATE IF EXISTS
# ---------------------------
@pytest.mark.django_db
def test_rating_update_if_exists(politician_factory, user_factory, rating_factory):
    pol = politician_factory()
    user = user_factory()

    rating = rating_factory(politician=pol, user=user, score=3)

    url = reverse("politician-ratings", args=[pol.slug])
    client = APIClient()
    client.force_authenticate(user=user)

    # Should update existing rating, not create new
    response = client.post(url, {"score": 5, "comment": "updated"}, format="json")

    assert response.status_code == 200# type: ignore
    rating.refresh_from_db()
    assert rating.score == 5


# ---------------------------
# RATING DETAIL: RETRIEVE
# ---------------------------
@pytest.mark.django_db
def test_rating_detail_retrieve(rating_factory):
    rating = rating_factory()
    url = reverse("rating-detail", args=[rating.id])

    client = APIClient()
    response = client.get(url)

    assert response.status_code == 200# type: ignore
    assert response.data["id"] == rating.id# type: ignore


# ---------------------------
# RATING DETAIL: UPDATE PERMISSIONS
# ---------------------------
@pytest.mark.django_db
def test_rating_detail_update_only_owner(rating_factory, user_factory):
    owner = user_factory()
    other_user = user_factory()
    rating = rating_factory(user=owner)

    url = reverse("rating-detail", args=[rating.id])
    client = APIClient()

    # Other user cannot update
    client.force_authenticate(user=other_user)
    response = client.put(url, {"score": 1}, format="json")
    assert response.status_code == 403# type: ignore

    # Owner can update
    client.force_authenticate(user=owner)
    response2 = client.put(url, {"score": 3}, format="json")
    assert response2.status_code == 200# type: ignore

    rating.refresh_from_db()
    assert rating.score == 3


# ---------------------------
# RATING DETAIL: DELETE PERMISSIONS
# ---------------------------
@pytest.mark.django_db
def test_rating_detail_delete_only_owner(rating_factory, user_factory):
    owner = user_factory()
    other_user = user_factory()
    rating = rating_factory(user=owner)

    url = reverse("rating-detail", args=[rating.id])
    client = APIClient()

    # Other user cannot delete
    client.force_authenticate(user=other_user)
    r = client.delete(url)
    assert r.status_code == 403# type: ignore

    # Owner can delete
    client.force_authenticate(user=owner)
    r2 = client.delete(url)
    assert r2.status_code == 204# type: ignore

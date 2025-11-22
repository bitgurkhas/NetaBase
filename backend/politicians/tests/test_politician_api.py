import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.core.cache import cache


# ---------------------------
# POLITICIAN LIST 
# ---------------------------
@pytest.mark.django_db
def test_politician_list_view_with_annotations(politician_factory, rating_factory):
    pol = politician_factory()
    rating_factory(politician=pol, score=5)
    rating_factory(politician=pol, score=3)

    url = reverse("politician-list")
    client = APIClient()
    response = client.get(url)

    assert response.status_code == 200# type: ignore
    data = response.data["results"][0]# type: ignore

    assert data["average_rating"] == 4.0
    assert data["rated_by"] == 2


# ---------------------------
# POLITICIAN DETAIL VIEW (CACHE + VIEW INCREMENT)
# ---------------------------
@pytest.mark.django_db
def test_politician_detail_view_cache_and_views(politician_factory):
    cache.clear()

    pol = politician_factory(views=10)
    url = reverse("politician-detail", args=[pol.slug])
    client = APIClient()

    # First request → cache miss, views +1
    response1 = client.get(url)
    assert response1.status_code == 200# type: ignore
    pol.refresh_from_db()
    assert pol.views == 11

    # Second request → cache hit, views +1 again
    response2 = client.get(url)
    assert response2.status_code == 200# type: ignore
    pol.refresh_from_db()
    assert pol.views == 12


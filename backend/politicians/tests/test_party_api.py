import pytest
from django.urls import reverse
from rest_framework.test import APIClient


# PARTY LIST VIEW
# ---------------------------
@pytest.mark.django_db
def test_party_list_view(party_factory):
    party_factory()
    party_factory()

    url = reverse("party-list")
    client = APIClient()
    response = client.get(url)

    assert response.status_code == 200  # type: ignore
    assert len(response.data["results"]) == 2  # type: ignore


# ---------------------------
# PARTY DETAIL VIEW
# ---------------------------
@pytest.mark.django_db
def test_party_detail_view(party_factory):
    party = party_factory()

    url = reverse("party-detail", args=[party.slug])
    client = APIClient()
    response = client.get(url)

    assert response.status_code == 200  # type: ignore
    assert response.data["name"] == party.name  # type: ignore


# ---------------------------
# PARTY → POLITICIANS LIST
# ---------------------------
@pytest.mark.django_db
def test_party_politicians_view(party_factory, politician_factory):
    party = party_factory()
    politician_factory(party=party)
    politician_factory(party=party)

    url = reverse("party-politicians", args=[party.slug])
    client = APIClient()
    response = client.get(url)

    assert response.status_code == 200  # type: ignore
    assert len(response.data["results"]) == 2  # type: ignore

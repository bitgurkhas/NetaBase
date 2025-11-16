import pytest
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


@pytest.mark.django_db
def test_create_rating_requires_auth(api_client, politician_factory):
    pol = politician_factory()
    url = f"/api/politicians/{pol.slug}/ratings/"

    resp = api_client.post(url, {"score": 5, "comment": "Nice"}, format="json")

    assert resp.status_code in (401, 403)


@pytest.mark.django_db
def test_create_and_update_rating(auth_client, politician_factory):
    api, user = auth_client()
    pol = politician_factory()
    url = f"/api/politicians/{pol.slug}/ratings/"

    # create
    resp = api.post(url, {"score": 5, "comment": "Great"}, format="json")
    assert resp.status_code == status.HTTP_201_CREATED

    data = resp.data
    assert data["score"] == 5
    assert data["username"] == user.username

    # second post should update existing rating
    resp2 = api.post(url, {"score": 3, "comment": "Changed"}, format="json")
    assert resp2.status_code == status.HTTP_200_OK
    assert resp2.data["score"] == 3


@pytest.mark.django_db
def test_rating_update_and_delete_ownership(auth_client, rating_factory, user_factory):
    # authenticated owner
    api, owner = auth_client()

    # create rating for a politician
    rating = rating_factory(user=owner)
    pol = rating.politician

    # correct rating detail URL
    url = f"/api/ratings/{rating.id}/"

    # owner can update
    resp = api.put(url, {"score": 2, "comment": "meh"}, format="json")
    assert resp.status_code in (status.HTTP_200_OK, status.HTTP_202_ACCEPTED)

    # switch to another user
    other_user = user_factory()
    api.credentials()  # clear auth

    token = RefreshToken.for_user(other_user)
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {str(token.access_token)}")

    # other user cannot update
    resp = api.put(url, {"score": 1, "comment": "hacked"}, format="json")
    assert resp.status_code in (status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED)

    # other user cannot delete
    resp = api.delete(url)
    assert resp.status_code in (status.HTTP_403_FORBIDDEN, status.HTTP_401_UNAUTHORIZED)

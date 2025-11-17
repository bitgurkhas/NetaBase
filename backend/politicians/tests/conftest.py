from django.test import override_settings
import pytest
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

from politicians.models import Party, Politician, Rating



@pytest.fixture
def api_client():
    return APIClient()



@pytest.fixture(autouse=True)
def disable_redis_cache():
    # Automatically disable Redis cache for all tests.
    with override_settings(
        CACHES={
            "default": {
                "BACKEND": "django.core.cache.backends.dummy.DummyCache",
            }
        }
    ):
        yield
        
        
@pytest.fixture
def user_factory(db):
    def make_user(**kwargs):
        defaults = {
            "username": f"user_{User.objects.count()}",
            "email": f"user_{User.objects.count()}@example.com",
            "password": "password123",
        }
        defaults.update(kwargs)

        password = defaults.pop("password")
        user = User.objects.create(**defaults)
        user.set_password(password)
        user.save()
        return user

    return make_user


@pytest.fixture
def auth_client(api_client, user_factory):
    def _get(user=None):
        if user is None:
            user = user_factory()

        refresh = RefreshToken.for_user(user)
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {str(refresh.access_token)}"
        )
        return api_client, user

    return _get


@pytest.fixture
def party_factory(db):
    def make_party(**kwargs):
        defaults = {
            "name": f"Party {Party.objects.count()}",
            "short_name": f"P{Party.objects.count()}",
        }
        defaults.update(kwargs)
        return Party.objects.create(**defaults)

    return make_party


@pytest.fixture
def politician_factory(db, party_factory):
    def make_politician(**kwargs):
        defaults = {
            "name": f"Politician {Politician.objects.count()}",
            "age": 40,
            "views": 0,
            "is_active": True,
        }
        if "party" not in kwargs:
            defaults["party"] = party_factory()

        defaults.update(kwargs)
        return Politician.objects.create(**defaults)

    return make_politician


@pytest.fixture
def rating_factory(db, user_factory, politician_factory):
    def make_rating(**kwargs):
        defaults = {
            "score": 4,
            "comment": "Good",
        }

        if "user" not in kwargs:
            defaults["user"] = user_factory()

        if "politician" not in kwargs:
            defaults["politician"] = politician_factory()

        defaults.update(kwargs)
        return Rating.objects.create(**defaults)

    return make_rating

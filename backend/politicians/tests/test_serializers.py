import pytest
from politicians.serializers import (
    PartySerializer,
    PoliticianSerializer,
    RatingSerializer,
    PoliticianDetailSerializer
)


@pytest.mark.django_db
def test_party_serializer_politician_count(party_factory, politician_factory):
    p = party_factory()

    # create 2 active and 1 inactive politician
    politician_factory(party=p, is_active=True)
    politician_factory(party=p, is_active=True)
    politician_factory(party=p, is_active=False)

    ser = PartySerializer(instance=p)
    assert ser.data["politician_count"] == 2 # type: ignore


@pytest.mark.django_db
def test_politician_serializer_avg_and_count(politician_factory, rating_factory):
    pol = politician_factory()

    rating_factory(politician=pol, score=5)
    rating_factory(politician=pol, score=3)

    ser = PoliticianSerializer(instance=pol)

    assert ser.data["average_rating"] == 4.0  # type: ignore
    assert ser.data["rated_by"] == 2  # type: ignore


@pytest.mark.django_db
def test_rating_serializer_fields(rating_factory):
    r = rating_factory()

    ser = RatingSerializer(instance=r)

    assert ser.data["id"] == r.id # type: ignore
    assert ser.data["score"] == r.score # type: ignore
    assert ser.data["username"] == r.user.username # type: ignore


@pytest.mark.django_db
def test_politician_detail_serializer_contains_average(politician_factory, rating_factory):
    pol = politician_factory()

    rating_factory(politician=pol, score=2)
    rating_factory(politician=pol, score=4)

    ser = PoliticianDetailSerializer(instance=pol)

    # ensure field exists
    assert "average_rating" in ser.data

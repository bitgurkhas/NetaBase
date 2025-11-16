import pytest

@pytest.mark.django_db
def test_politician_list_and_ordering(api_client, politician_factory):
    p1 = politician_factory(name="A", views=10)

    url = "/api/politicians/?ordering=-views"
    resp = api_client.get(url)

    assert resp.status_code == 200

    results = resp.data.get("results", resp.data)
    assert results[0]["slug"] == p1.slug


@pytest.mark.django_db
def test_politician_detail_increment_views(api_client, politician_factory):
    pol = politician_factory(views=0)

    url = f"/api/politicians/{pol.slug}/"
    resp = api_client.get(url)

    assert resp.status_code == 200

    pol.refresh_from_db()
    assert pol.views == 1


@pytest.mark.django_db
def test_party_filter_on_list(api_client, party_factory, politician_factory):
    party = party_factory()
    pol = politician_factory(party=party)
    other = politician_factory()

    url = f"/api/politicians/?party__slug={party.slug}"
    resp = api_client.get(url)

    assert resp.status_code == 200

    results = resp.data.get("results", resp.data)
    slugs = [r["slug"] for r in results]

    assert pol.slug in slugs
    assert other.slug not in slugs

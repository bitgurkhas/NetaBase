import os
import django
import random
from django.core.files.base import ContentFile
from io import BytesIO
from PIL import Image

# Setup Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "politician_recorder.settings")
django.setup()

from django.contrib.auth import get_user_model
from politicians.models import Party, Politician, Initiatives, Promises, Rating

User = get_user_model()


def generate_image(file_name="test.jpg", size=(300, 300), color=(255, 0, 0)):
    """Generate a simple image for testing"""
    img = Image.new("RGB", size, color)
    buf = BytesIO()
    img.save(buf, format="JPEG")
    return ContentFile(buf.getvalue(), file_name)


def create_users():
    users = []
    for i in range(5):
        username = f"user{i}"
        user, created = User.objects.get_or_create(username=username)
        if created:
            user.set_password("password123")
            user.save()
        users.append(user)
    return users


def create_parties():
    party_names = [
        "Nepal Congress",
        "CPN UML",
        "Maoist Centre",
        "Rastriya Swatantra Party",
        "Janata Samajwadi Party",
    ]
    parties = []

    for name in party_names:
        party, created = Party.objects.get_or_create(
            name=name,
            defaults={
                "flag": generate_image(f"{name.replace(' ', '_')}.jpg", color=(random.randint(0,255),0,0))
            }
        )
        parties.append(party)
    return parties


def create_politicians(parties):
    politicians = []

    sample_bios = [
        "A dedicated public servant focusing on education reform.",
        "Has worked for 20 years in community development.",
        "Advocated for economic growth and employment.",
        "Known for strong leadership in crisis situations.",
    ]

    for i in range(10):
        name = f"Politician {i}"
        politician, created = Politician.objects.get_or_create(
            name=name,
            defaults={
                "age": random.randint(30, 70),
                "education": "Bachelor's in Political Science",
                "criminal_record": "",
                "party": random.choice(parties),
                "party_position": "Member",
                "criticism": "Some public criticisms exist.",
                "location": "Kathmandu",
                "biography": random.choice(sample_bios),
                "previous_party_history": "",
                "photo": generate_image(f"politician_{i}.jpg", color=(0, random.randint(0,255),0)),
            }
        )
        politicians.append(politician)
    return politicians


def create_initiatives(politicians):
    for p in politicians:
        for i in range(random.randint(1, 3)):
            Initiatives.objects.create(
                politician=p,
                title=f"Initiative {i} for {p.name}",
                description="This is a description of the initiative."
            )


def create_promises(politicians):
    statuses = ["pending", "in_progress", "completed", "failed"]
    
    for p in politicians:
        for i in range(random.randint(1, 4)):
            Promises.objects.create(
                politician=p,
                title=f"Promise {i} by {p.name}",
                description="This promise is part of development work.",
                status=random.choice(statuses)
            )


def create_ratings(users, politicians):
    for p in politicians:
        for user in users:
            if not Rating.objects.filter(politician=p, user=user).exists():
                Rating.objects.create(
                    politician=p,
                    user=user,
                    score=random.randint(1, 5),
                    comment="Good performance overall."
                )


def run():
    print("Creating users...")
    users = create_users()

    print("Creating parties...")
    parties = create_parties()

    print("Creating politicians...")
    politicians = create_politicians(parties)

    print("Creating initiatives...")
    create_initiatives(politicians)

    print("Creating promises...")
    create_promises(politicians)

    print("Creating ratings...")
    create_ratings(users, politicians)

    print("Database population completed successfully!")


if __name__ == "__main__":
    run()

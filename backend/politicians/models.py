from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

def validate_image(image):
    valid_extensions = ['.jpg', '.jpeg', '.png']
    if not any(image.name.lower().endswith(ext) for ext in valid_extensions):
        raise ValidationError("Only .jpg, .jpeg, and .png images are allowed.")


class Party(models.Model):
    name = models.CharField(max_length=255, unique=True)
    short_name = models.CharField(max_length=50, blank=True, null=True)
    def __str__(self):
        return self.name


class Politician(models.Model):
    name = models.CharField(max_length=255)
    photo = models.ImageField(
        upload_to='media/politicians/',
        blank=True,
        null=True,
        validators=[validate_image]
    )
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(18), MaxValueValidator(100)]
    )
    education = models.TextField()
    criminal_record = models.TextField(blank=True)
    party = models.ForeignKey(Party, on_delete=models.CASCADE)
    party_position = models.CharField(max_length=255, blank=True, null=True)
    criticism = models.TextField(blank=True)
    biography = models.TextField()
    previous_party_history = models.TextField(blank=True)

    def __str__(self):
        return self.name

    def clean(self):
        if self.age < 18:
            raise ValidationError("Politician must be at least 18 years old.")


class Rating(models.Model):
    RATING_CHOICES = [
        (1, '1 - Poor'),
        (2, '2 - Fair'),
        (3, '3 - Good'),
        (4, '4 - Very Good'),
        (5, '5 - Excellent'),
    ]
    
    politician = models.ForeignKey(
        Politician, 
        on_delete=models.CASCADE, 
        related_name='ratings'
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='politician_ratings'
    )
    score = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('politician', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.politician.name} ({self.score} {self.comment})"

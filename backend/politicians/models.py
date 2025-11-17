import os
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django_extensions.db.fields import AutoSlugField

User = get_user_model()


def validate_image(image):
    """Validate image file type and size"""
    # Skip validation if image hasn't changed
    if not image:
        return
    
    # Check if this is a new file being uploaded
    if hasattr(image, 'file'):
        valid_extensions = ['.jpg', '.jpeg', '.png']
        max_size = 5 * 1024 * 1024  # 5MB
        
        # Get the original filename if available
        filename = getattr(image, 'name', '')
        
        # Extract extension
        _, ext = os.path.splitext(filename.lower())

        if filename and ext:
            if ext not in valid_extensions:
                raise ValidationError("Only .jpg, .jpeg, and .png images are allowed.")
        
        # Validate size for new uploads
        if hasattr(image, 'size') and image.size:
            if image.size > max_size:
                raise ValidationError("Image size cannot exceed 5MB.")


class Party(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = AutoSlugField(populate_from='name', unique=True, max_length=255)  # type: ignore
    flag = models.ImageField(
        upload_to="party/banners/",
        null=True,
        blank=True,
        validators=[validate_image],
        help_text="Party flag or logo (max 5MB)"
    )
    short_name = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Parties"
        ordering = ['name']

    def __str__(self):
        return self.name


class Politician(models.Model):
    name = models.CharField(max_length=250)
    slug = AutoSlugField(populate_from='name', unique=True, max_length=255)  # type: ignore
    views = models.PositiveIntegerField(default=0)
    photo = models.ImageField(
        upload_to='politicians/banners/',
        blank=True,
        max_length=500,
        null=True,
        validators=[validate_image],
        help_text="Politician photo (max 5MB)"
    )
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(18), MaxValueValidator(100)],
        help_text="Must be at least 18 years old"
    )
    education = models.TextField(help_text="Educational background")
    criminal_record = models.TextField(
        blank=True,
        help_text="Any criminal history or legal issues"
    )
    party = models.ForeignKey(
        Party,
        on_delete=models.CASCADE,
        related_name='politicians'
    )
    party_position = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Position within the party"
    )
    criticism = models.TextField(
        blank=True,
        help_text="Notable criticisms or controversies"
    )
    location = models.CharField(
        max_length=255,
        blank=True,
        help_text="Current location or constituency"
    )
    biography = models.TextField(help_text="Detailed biography")
    previous_party_history = models.TextField(
        blank=True,
        help_text="History of previous party affiliations"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the politician is currently active"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['party']),
            models.Index(fields=['slug']),
            models.Index(fields=['-views']),
            models.Index(fields=['is_active', 'party']),
        ]
        ordering = ['-views']

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        """Calculate average rating score"""
        from django.db.models import Avg
        result = self.ratings.aggregate(Avg('score')) # type: ignore
        return round(result['score__avg'], 2) if result['score__avg'] else 0

    @property
    def total_ratings(self):
        """Get total number of ratings"""
        return self.ratings.count() # type: ignore


class Initiatives(models.Model):
    politician = models.ForeignKey(
        Politician,
        on_delete=models.CASCADE,
        related_name="initiatives"
    )
    title = models.CharField(max_length=250)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Initiatives"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['politician', '-created_at']),
        ]

    def __str__(self):
        return f"{self.politician.name} - {self.title}"


class Promises(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("failed", "Failed"),
    ]

    politician = models.ForeignKey(
        Politician,
        on_delete=models.CASCADE,
        related_name="promises"
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(
        max_length=50,
        choices=STATUS_CHOICES,
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Promises"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['politician', 'status']),
            models.Index(fields=['-created_at']),
        ]

    def __str__(self):
        return f"{self.politician.name} - {self.title} ({self.get_status_display()})" # type: ignore


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
    score = models.IntegerField(
        choices=RATING_CHOICES,
        help_text="Rating from 1 (Poor) to 5 (Excellent)"
    )
    comment = models.TextField(
        blank=True,
        null=True,
        help_text="Optional comment about the rating"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('politician', 'user')
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['politician', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.politician.name} ({self.score}/5)"

    def clean(self):
        """Validate that user hasn't already rated this politician"""
        if not self.pk:
            existing = Rating.objects.filter(
                politician=self.politician,
                user=self.user
            ).exists()
            if existing:
                raise ValidationError(
                    "You have already rated this politician. "
                    "Please edit your existing rating instead."
                )
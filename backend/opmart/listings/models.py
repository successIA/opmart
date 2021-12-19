import os
import time
import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify

from imagekit.models import ImageSpecField, ProcessedImageField
from imagekit.processors import ResizeToFit


def upload_to(_, filename):
    extension = os.path.splitext(filename)[-1]
    new_name = uuid.uuid4().hex
    new_filename = f"{new_name}{extension}"
    return os.path.join("images", new_name[:2], new_name[2:4], new_filename)


class Category(models.Model):
    name = models.CharField(max_length=128, unique=True)
    slug = models.SlugField(max_length=140, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Listing(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="listings", on_delete=models.CASCADE
    )
    category = models.ForeignKey(
        Category, related_name="listings", on_delete=models.CASCADE
    )
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=14, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return self.title


class ListingImage(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    listing = models.ForeignKey(
        Listing, null=True, blank=True, related_name="images", on_delete=models.CASCADE
    )
    image = ProcessedImageField(
        upload_to=upload_to,
        processors=[ResizeToFit(2000, 2000, upscale=False)],
        format="JPEG",
        options={"quality": 75},
    )
    image_small = ImageSpecField(
        source="image",
        processors=[ResizeToFit(300, 300, upscale=False)],
        format="JPEG",
        options={"quality": 75},
    )
    created_at = models.DateTimeField(auto_now_add=True)

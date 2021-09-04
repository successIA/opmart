from django.conf import settings
from django.db import models
from django.utils.text import slugify


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

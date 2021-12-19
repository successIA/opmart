from django.db import transaction
from django.utils.translation import gettext as _

from rest_framework import serializers

from opmart.listings.models import Category, Listing, ListingImage

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_IMAGE_COUNT = 10


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ListingSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Listing
        fields = ["id", "category", "title", "description", "price"]


class ListingImageSerializer(serializers.Serializer):
    images = serializers.ListField(child=serializers.ImageField(), allow_empty=False)

    def validate_images(self, value):
        if len(value) > MAX_IMAGE_COUNT:
            msg = _("You cannot upload more than 10 images.")
            raise serializers.ValidationError(msg)

        for image in value:
            if image.size > MAX_IMAGE_SIZE:
                msg = _("Maximum size of a single image cannot be greater 5MB")
                raise serializers.ValidationError(msg)
        return value

    class Meta:
        model = ListingImage
        fields = ["images"]

    @transaction.atomic
    def save(self):
        request = self.context["request"]

        listing_image_ids = []
        for image in self.validated_data["images"]:
            listing_image = ListingImage.objects.create(owner=request.user, image=image)
            listing_image_ids.append(listing_image.pk)

        return listing_image_ids

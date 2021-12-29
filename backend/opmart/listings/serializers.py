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


class ListingImageSerializer(serializers.ModelSerializer):
    image_small = serializers.SerializerMethodField(read_only=True)

    def get_image_small(self, value):
        request = self.context["request"]
        return request.build_absolute_uri(value.image_small.url)

    class Meta:
        model = ListingImage
        fields = ["image", "image_small"]


class ListingSerializer(serializers.ModelSerializer):
    category = CategorySerializer()
    images = ListingImageSerializer(many=True)

    class Meta:
        model = Listing
        fields = [
            "id",
            "category",
            "title",
            "description",
            "price",
            "condition",
            "images",
        ]


class ListingCreateSerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(
        queryset=ListingImage.objects.filter(listing=None), many=True
    )

    def validate_images(self, value):
        request = self.context["request"]

        for listing_image in value:
            if request.user != listing_image.owner:
                raise serializers.ValidationError("Invalid request")

        if len(value) > MAX_IMAGE_COUNT:
            msg = _("A listing cannot have more than 10 images.")
            raise serializers.ValidationError(msg)

        return value

    class Meta:
        model = Listing
        fields = [
            "id",
            "category",
            "title",
            "price",
            "condition",
            "description",
            "images",
        ]

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        listing_images = validated_data.pop("images")

        listing = Listing.objects.create(owner=request.user, **validated_data)

        for listing_image in listing_images:
            listing_image.listing = listing

        ListingImage.objects.bulk_update(listing_images, ["listing"])

        return listing


class ListingImageSerializer(serializers.ModelSerializer):
    def validate_image(self, value):
        if value.size > MAX_IMAGE_SIZE:
            msg = _("Image size cannot be greater than 5MB")
            raise serializers.ValidationError(msg)
        return value

    class Meta:
        model = ListingImage
        fields = ["id", "image"]
        extra_kwargs = {"image": {"write_only": True}}

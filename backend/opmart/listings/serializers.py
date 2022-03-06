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
    large = serializers.SerializerMethodField(read_only=True)
    small = serializers.SerializerMethodField(read_only=True)

    def get_large(self, value):
        request = self.context["request"]
        return request.build_absolute_uri(value.image.url)

    def get_small(self, value):
        request = self.context["request"]
        return request.build_absolute_uri(value.image_small.url)

    class Meta:
        model = ListingImage
        fields = ["id", "large", "small"]


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

    @staticmethod
    def setup_eager_loading(queryset):
        return queryset.select_related("category").prefetch_related("images")


class ListingCreateUpdateSerializer(serializers.ModelSerializer):
    images = serializers.PrimaryKeyRelatedField(
        queryset=ListingImage.objects.all(), many=True
    )

    def validate_images(self, value):
        request = self.context["request"]
        if len(value) > MAX_IMAGE_COUNT:
            msg = _("A listing cannot have more than 10 images.")
            raise serializers.ValidationError(msg)

        for image in value:
            if request.user != image.owner:
                raise serializers.ValidationError(_("Image must belong to owner."))
            if self.instance and image.listing and image.listing != self.instance:
                msg = _("Image can only be orphaned or associated with listing.")
                raise serializers.ValidationError()
            elif not self.instance and image.listing is not None:
                msg = _("Only orphaned images are allowed.")
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

    @transaction.atomic
    def update(self, instance, validated_data):
        request = self.context["request"]
        listing_images = validated_data.pop("images")

        if request.user != instance.owner:
            raise serializers.ValidationError()

        listing = super().update(instance, validated_data)

        for image in listing_images:
            if not image.listing:
                image.listing = listing

        ListingImage.objects.bulk_update(listing_images, ["listing"])

        new_image_ids = [image.id for image in listing_images]
        old_image_ids = listing.images.values_list("id", flat=True)
        image_ids_to_delete = [pk for pk in old_image_ids if pk not in new_image_ids]
        ListingImage.objects.filter(id__in=image_ids_to_delete).delete()
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

from rest_framework import serializers

from opmart.listings.models import Category, Listing


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ListingSerializer(serializers.ModelSerializer):
    category = CategorySerializer()

    class Meta:
        model = Listing
        fields = ["id", "category", "title", "description", "price"]

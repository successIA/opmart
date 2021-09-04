from rest_framework import viewsets

from opmart.listings.models import Category, Listing
from opmart.listings.serializers import CategorySerializer, ListingSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.order_by("name")
    serializer_class = CategorySerializer


class ListingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Listing.objects.order_by("-created_at")
    serializer_class = ListingSerializer

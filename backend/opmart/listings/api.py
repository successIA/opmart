from rest_framework import mixins, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)
from rest_framework.response import Response

from opmart.listings.models import Category, Listing, ListingImage
from opmart.listings.serializers import (
    CategorySerializer,
    ListingImageSerializer,
    ListingSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.order_by("name")
    serializer_class = CategorySerializer


class ListingViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Listing.objects.order_by("-created_at")
    permission_classes = [IsAuthenticatedOrReadOnly]
    serializer_class = ListingSerializer


class ListingImageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def create(self, request, *args, **kwargs):
        serializer = ListingImageSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        listing_image_ids = serializer.save()

        data = {
            "listing_images": listing_image_ids,
        }
        return Response(data, status=status.HTTP_201_CREATED)

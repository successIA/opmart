from rest_framework import mixins, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly,
)

from opmart.listings.models import Category, Listing, ListingImage
from opmart.listings.serializers import (
    CategorySerializer,
    ListingCreateUpdateSerializer,
    ListingImageSerializer,
    ListingSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.order_by("name")
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class ListingViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        qs = Listing.objects.all()
        qs = ListingSerializer.setup_eager_loading(qs)
        return qs.order_by("-created_at")

    def get_serializer_class(self):
        if self.action in ["create", "update"]:
            return ListingCreateUpdateSerializer
        return ListingSerializer


class ListingImageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        return serializer.save(owner=self.request.user)

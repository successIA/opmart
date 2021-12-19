from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.db import router
from django.urls import include, path

from rest_framework import routers

from opmart.listings.api import (
    CategoryViewSet,
    ListingImageViewSet,
    ListingViewSet,
)

router = routers.DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("listings", ListingViewSet, basename="listings")
router.register("listing-images", ListingImageViewSet, basename="listing-images")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
    path("accounts/", include("opmart.accounts.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

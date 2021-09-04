from django.contrib import admin
from django.db import router
from django.urls import include, path

from rest_framework import routers

from opmart.listings.api import CategoryViewSet

router = routers.DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]

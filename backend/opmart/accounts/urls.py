from django.urls import include, path

from rest_framework import routers

from opmart.accounts.api import (
    LoginView,
    LogoutView,
    RegisterView,
    UserDetailView,
    UserViewSet,
)

app_name = "accounts"

router = routers.DefaultRouter()
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/", UserDetailView.as_view(), name="user_detail"),
    path("", include(router.urls)),
]

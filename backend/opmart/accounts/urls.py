from django.urls import path

from opmart.accounts.api import (
    LoginView,
    LogoutView,
    RegisterView,
    UserDetailView,
)

app_name = "accounts"

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("user/", UserDetailView.as_view(), name="user_detail"),
]

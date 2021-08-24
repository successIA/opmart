from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserChangeForm as DjangoUserChangeForm
from django.contrib.auth.forms import UserCreationForm as DjangoUserCreationForm

User = get_user_model()


class UserCreationForm(DjangoUserCreationForm):
    class Meta(DjangoUserCreationForm):
        model = User
        fields = ("email", "first_name", "last_name")


class UserChangeForm(DjangoUserChangeForm):
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name")

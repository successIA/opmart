from django.contrib.auth import (
    authenticate,
    get_user_model,
    password_validation,
)
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import serializers

User = get_user_model()


class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["email", "first_name", "last_name"]


class UserDetailTokenSerializer(serializers.Serializer):
    token = serializers.CharField()
    expiry = serializers.DateTimeField()
    user = UserDetailSerializer()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(max_length=128, write_only=True)
    first_name = serializers.CharField(min_length=2, max_length=30)
    last_name = serializers.CharField(min_length=2, max_length=30, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            msg = _("An account with this email already exists.")
            raise serializers.ValidationError(msg)
        return value

    def check_password(self, value, user):
        try:
            password_validation.validate_password(value, user)
        except ValidationError as e:
            raise serializers.ValidationError({"password": e.messages})
        return value

    def save(self):
        user = User(**self.validated_data)
        self.check_password(self.validated_data["password"], user)
        user.set_password(self.validated_data["password"])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(max_length=128, write_only=True)

    def save(self):
        user = authenticate(request=self.context["request"], **self.validated_data)
        if not user:
            msg = _("Unable to log in with the provided credentials.")
            raise serializers.ValidationError({"detail": msg})

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        return user

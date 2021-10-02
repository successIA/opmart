from django.contrib.auth import get_user_model

from rest_framework import status, viewsets
from rest_framework.decorators import action, permission_classes
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from knox.models import AuthToken
from opmart.accounts.serializers import (
    LoginSerializer,
    RegisterSerializer,
    UserDetailSerializer,
    UserDetailTokenSerializer,
)

User = get_user_model()


class UserTokenResponseMixin:
    def get_user_token_response_data(self, user):
        instance, token = AuthToken.objects.create(user)
        data = {
            "user": user,
            "token": token,
            "expiry": instance.expiry,
        }
        return UserDetailTokenSerializer(data).data


class RegisterView(UserTokenResponseMixin, GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = self.get_user_token_response_data(user)
        return Response(data=data, status=status.HTTP_201_CREATED)


class LoginView(UserTokenResponseMixin, GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        data = self.get_user_token_response_data(user)
        return Response(data=data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, format=None):
        request._auth.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserDetailView(RetrieveAPIView):
    queryset = User.objects.none()
    serializer_class = UserDetailSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        return self.request.user

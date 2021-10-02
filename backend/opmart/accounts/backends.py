from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class AuthenticationBackend(ModelBackend):
    def authenticate(self, request, email=None, username=None, password=None, **kwargs):
        # Django sets the email in username when trying to login via the admin
        email = email if email else username
        if email is None or password is None:
            return

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            # Run the default password hasher once to reduce the timing
            # difference between an existing and a nonexistent user (#20760).
            User().set_password(password)

        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user

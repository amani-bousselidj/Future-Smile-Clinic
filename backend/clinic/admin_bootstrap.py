import os

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView


class AdminBootstrapView(APIView):
    """Create or reset an initial admin user in production.

    Security:
    - Requires header `X-Bootstrap-Token` matching env var `ADMIN_BOOTSTRAP_TOKEN`.
    - Does NOT return the password.

    Body:
    - username (required)
    - password (required)
    - email (optional)
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        expected = os.environ.get("ADMIN_BOOTSTRAP_TOKEN")
        provided = request.headers.get("X-Bootstrap-Token")

        # If not configured, or token mismatch, hide this endpoint.
        if not expected or not provided or provided != expected:
            return Response({"detail": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        username = (request.data.get("username") or "").strip()
        password = request.data.get("password")
        email = (request.data.get("email") or "").strip()

        if not username or not password:
            return Response(
                {"detail": "username and password required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        # Always force admin flags.
        user.is_staff = True
        user.is_superuser = True
        if email and not user.email:
            user.email = email

        user.set_password(password)
        user.save()

        return Response(
            {"ok": True, "username": user.username, "created": created},
            status=status.HTTP_200_OK,
        )

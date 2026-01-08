from rest_framework_simplejwt.views import TokenObtainPairView

from .admin_auth import AdminTokenObtainPairSerializer


class AdminTokenObtainPairView(TokenObtainPairView):
    serializer_class = AdminTokenObtainPairSerializer

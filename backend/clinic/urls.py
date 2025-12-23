from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet,
    PatientViewSet,
    AppointmentViewSet,
    TestimonialViewSet,
    BlogPostViewSet,
    ContactMessageViewSet,
    BeforeAfterGalleryViewSet,
    AdminInitViewSet,
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'blog', BlogPostViewSet, basename='blogpost')
router.register(r'contact', ContactMessageViewSet, basename='contactmessage')
router.register(r'gallery', BeforeAfterGalleryViewSet, basename='gallery')
router.register(r'admin-init', AdminInitViewSet, basename='admin-init')

urlpatterns = [
    path('', include(router.urls)),
]

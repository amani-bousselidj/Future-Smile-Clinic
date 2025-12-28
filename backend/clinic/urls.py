from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, PatientViewSet, DoctorViewSet, AppointmentViewSet,
    QueueViewSet, NotificationViewSet, TestimonialViewSet, BlogPostViewSet,
    GalleryViewSet, ContactMessageViewSet, QueueStatisticsViewSet
)

# Create router and register viewsets
router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'patients', PatientViewSet, basename='patient')
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'queue', QueueViewSet, basename='queue')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'blog', BlogPostViewSet, basename='blogpost')
router.register(r'gallery', GalleryViewSet, basename='gallery')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'queue-statistics', QueueStatisticsViewSet, basename='queuestatistics')

urlpatterns = [
    path('', include(router.urls)),
]

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Service, Patient, Doctor, Appointment, Queue, QueueStatistics,
    Notification, Testimonial, BlogPost, Gallery, ContactMessage
)
from .serializers import (
    ServiceSerializer, PatientSerializer, DoctorSerializer,
    AppointmentDetailSerializer, AppointmentCreateSerializer, QueueSerializer,
    NotificationSerializer, TestimonialSerializer, BlogPostSerializer,
    GallerySerializer, ContactMessageSerializer, QueueStatisticsSerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    """Service management ViewSet"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_active']
    search_fields = ['name', 'description']
    
    def get_queryset(self):
        """Filter by active status"""
        return Service.objects.filter(is_active=True)


class PatientViewSet(viewsets.ModelViewSet):
    """Patient management ViewSet"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['full_name', 'phone', 'email']
    
    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        """Get all appointments for a patient"""
        patient = self.get_object()
        appointments = patient.appointments.all()
        serializer = AppointmentDetailSerializer(appointments, many=True)
        return Response(serializer.data)


class DoctorViewSet(viewsets.ReadOnlyModelViewSet):
    """Doctor/Staff ViewSet (Read-only for patients)"""
    queryset = Doctor.objects.filter(is_active=True)
    serializer_class = DoctorSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'specialization']


class AppointmentViewSet(viewsets.ModelViewSet):
    """Appointment management ViewSet"""
    queryset = Appointment.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'appointment_date', 'service']
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']
    ordering = ['-appointment_date', '-appointment_time']
    
    def get_serializer_class(self):
        """Use create serializer for POST, detail serializer for others"""
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentDetailSerializer

    def create(self, request, *args, **kwargs):
        """Create a new appointment and return a detailed response"""
        serializer = AppointmentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        appointment = serializer.save()
        output = AppointmentDetailSerializer(appointment)
        return Response(output.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['post'])
    def create_appointment(self, request):
        """Create a new appointment"""
        serializer = AppointmentCreateSerializer(data=request.data)
        if serializer.is_valid():
            appointment = serializer.save()
            output = AppointmentDetailSerializer(appointment)
            return Response(output.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm appointment"""
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel appointment"""
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.cancellation_reason = request.data.get('reason', '')
        appointment.save()
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.actual_end_time = None  # Set to current time
        appointment.save()
        serializer = AppointmentDetailSerializer(appointment)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_booking_id(self, request):
        """Get appointment by booking ID"""
        booking_id = request.query_params.get('booking_id')
        if not booking_id:
            return Response(
                {'error': 'booking_id query parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            appointment = Appointment.objects.get(booking_id=booking_id)
            serializer = AppointmentDetailSerializer(appointment)
            return Response(serializer.data)
        except Appointment.DoesNotExist:
            return Response(
                {'error': 'Appointment not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class QueueViewSet(viewsets.ReadOnlyModelViewSet):
    """Queue management ViewSet"""
    queryset = Queue.objects.all()
    serializer_class = QueueSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['appointment_date']
    ordering_fields = ['queue_position', 'appointment_date']
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's queue"""
        from django.utils import timezone
        today = timezone.now().date()
        queues = Queue.objects.filter(appointment_date=today).order_by('queue_position')
        serializer = self.get_serializer(queues, many=True)
        return Response(serializer.data)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """Notification ViewSet"""
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'channel', 'notification_type']
    ordering_fields = ['scheduled_time', 'sent_time']


class TestimonialViewSet(viewsets.ModelViewSet):
    """Testimonial ViewSet"""
    queryset = Testimonial.objects.filter(is_approved=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """Only show approved testimonials to users"""
        if self.request.user and self.request.user.is_staff:
            return Testimonial.objects.all()
        return Testimonial.objects.filter(is_approved=True)


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
    """Blog post ViewSet"""
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ['title', 'content', 'category']
    filterset_fields = ['category', 'is_published']
    
    def get_queryset(self):
        """Only show published posts to users"""
        if self.request.user and self.request.user.is_staff:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(is_published=True)


class GalleryViewSet(viewsets.ReadOnlyModelViewSet):
    """Gallery ViewSet"""
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['treatment_type', 'is_featured']


class ContactMessageViewSet(viewsets.ModelViewSet):
    """Contact message ViewSet"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering_fields = ['created_at', 'is_read']
    ordering = ['-created_at']
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data)


class QueueStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """Queue statistics ViewSet"""
    queryset = QueueStatistics.objects.all()
    serializer_class = QueueStatisticsSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['service', 'appointment_date']
    ordering_fields = ['appointment_date', 'average_wait_minutes']

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import HttpResponse
from django.contrib.auth.models import User
from .pdf_reports import generate_appointment_report_pdf, generate_patient_report_pdf
from .models import Service, Patient, Appointment, Testimonial, BlogPost, ContactMessage, BeforeAfterGallery, AppointmentNotification, QueueStatistics, QueueHistory
from .serializers import (
    ServiceSerializer, 
    PatientSerializer, 
    AppointmentSerializer,
    AppointmentCreateSerializer,
    TestimonialSerializer, 
    BlogPostSerializer, 
    ContactMessageSerializer,
    BeforeAfterGallerySerializer,
    AppointmentNotificationSerializer,
    QueueStatisticsSerializer,
    QueueHistorySerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    """API endpoint for services"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price_min', 'created_at']


class PatientViewSet(viewsets.ModelViewSet):
    """API endpoint for patients"""
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['full_name', 'phone', 'email']
    ordering_fields = ['full_name', 'created_at']
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """Download patient PDF report with appointment history"""
        pdf = generate_patient_report_pdf(pk)
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="patient_{pk}_report.pdf"'
            return response
        return Response({"error": "Patient not found"}, status=404)


class AppointmentViewSet(viewsets.ModelViewSet):
    """API endpoint for appointments"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'appointment_date']
    search_fields = ['patient__full_name', 'service__name']
    ordering_fields = ['appointment_date', 'appointment_time', 'created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer

    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm an appointment"""
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed"""
        appointment = self.get_object()
        appointment.status = 'completed'
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an appointment"""
        appointment = self.get_object()
        appointment.status = 'cancelled'
        appointment.save()
        serializer = self.get_serializer(appointment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments"""
        from datetime import date
        today_appointments = self.queryset.filter(appointment_date=date.today())
        serializer = self.get_serializer(today_appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """Download appointment PDF report"""
        pdf = generate_appointment_report_pdf(pk)
        if pdf:
            response = HttpResponse(pdf, content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="appointment_{pk}.pdf"'
            return response
        return Response({"error": "Appointment not found"}, status=404)


class TestimonialViewSet(viewsets.ModelViewSet):
    """API endpoint for testimonials"""
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = ['rating', 'created_at']


class BlogPostViewSet(viewsets.ModelViewSet):
    """API endpoint for blog posts"""
    queryset = BlogPost.objects.filter(is_published=True)
    serializer_class = BlogPostSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['created_at']


class ContactMessageViewSet(viewsets.ModelViewSet):
    """API endpoint for contact messages"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_read']
    ordering_fields = ['created_at']

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark message as read"""
        message = self.get_object()
        message.is_read = True
        message.save()
        serializer = self.get_serializer(message)
        return Response(serializer.data)


class BeforeAfterGalleryViewSet(viewsets.ModelViewSet):
    """API endpoint for before/after gallery"""
    queryset = BeforeAfterGallery.objects.filter(is_active=True)
    serializer_class = BeforeAfterGallerySerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['treatment_type', 'is_featured']
    ordering_fields = ['display_order', 'created_at']


class AdminInitViewSet(viewsets.ViewSet):
    """Admin initialization endpoint"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def init_admin(self, request):
        """Initialize admin user - POST to /api/admin-init/init_admin/"""
        try:
            # Delete existing amani user
            User.objects.filter(username='amani').delete()
            
            # Create new admin user
            user = User.objects.create_superuser(
                username='amani',
                email='amani@example.com',
                password='bousselidj'
            )
            
            return Response({
                'status': 'success',
                'message': 'Admin user created successfully',
                'username': 'amani',
                'password': 'bousselidj',
                'email': 'amani@example.com'
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class AppointmentNotificationViewSet(viewsets.ModelViewSet):
    """API endpoint for appointment notifications"""
    queryset = AppointmentNotification.objects.all()
    serializer_class = AppointmentNotificationSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['appointment', 'notification_type', 'status']
    ordering_fields = ['created_at', 'scheduled_time']
    ordering = ['-created_at']
    
    @action(detail=False, methods=['get'])
    def by_appointment(self, request):
        """Get notifications for a specific appointment"""
        appointment_id = request.query_params.get('appointment_id')
        if appointment_id:
            notifications = AppointmentNotification.objects.filter(appointment_id=appointment_id)
            serializer = self.get_serializer(notifications, many=True)
            return Response(serializer.data)
        return Response({"error": "appointment_id parameter required"}, status=400)
    
    @action(detail=False, methods=['post'])
    def send_pending(self, request):
        """Send all pending notifications that are ready"""
        from .notifications import NotificationService
        try:
            count = NotificationService.send_pending_notifications()
            return Response({
                'status': 'success',
                'message': f'تم إرسال {count} إشعار',
                'count': count
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=400)


class QueueStatisticsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for queue statistics"""
    queryset = QueueStatistics.objects.all()
    serializer_class = QueueStatisticsSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['service', 'appointment_date']
    ordering_fields = ['appointment_date', 'average_wait_minutes']
    ordering = ['-appointment_date']
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest queue statistics (today)"""
        from django.utils import timezone
        today = timezone.now().date()
        stats = QueueStatistics.objects.filter(appointment_date=today)
        serializer = self.get_serializer(stats, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def service_stats(self, request):
        """Get average statistics for a specific service"""
        service_id = request.query_params.get('service_id')
        if not service_id:
            return Response({"error": "service_id parameter required"}, status=400)
        
        from django.db.models import Avg
        stats = QueueStatistics.objects.filter(service_id=service_id).aggregate(
            avg_wait=Avg('average_wait_minutes'),
            avg_duration=Avg('average_service_duration_minutes'),
            min_wait=Avg('min_wait_minutes'),
            max_wait=Avg('max_wait_minutes')
        )
        return Response(stats)


class QueueHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for queue history"""
    queryset = QueueHistory.objects.all()
    serializer_class = QueueHistorySerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['appointment', 'queue_position', 'is_no_show']
    ordering_fields = ['scheduled_start_time', 'estimated_wait_minutes', 'actual_wait_minutes']
    ordering = ['-scheduled_start_time']
    
    @action(detail=False, methods=['get'])
    def by_appointment(self, request):
        """Get queue history for a specific appointment"""
        appointment_id = request.query_params.get('appointment_id')
        if appointment_id:
            try:
                queue_history = QueueHistory.objects.get(appointment_id=appointment_id)
                serializer = self.get_serializer(queue_history)
                return Response(serializer.data)
            except QueueHistory.DoesNotExist:
                return Response({"error": "Queue history not found"}, status=404)
        return Response({"error": "appointment_id parameter required"}, status=400)
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's queue history"""
        from django.utils import timezone
        today = timezone.now().date()
        from datetime import datetime
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        queue_history = QueueHistory.objects.filter(
            scheduled_start_time__range=[today_start, today_end]
        )
        serializer = self.get_serializer(queue_history, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def current_queue(self, request):
        """Get current queue status (appointments waiting or being served)"""
        from django.utils import timezone
        from django.db.models import Q
        
        now = timezone.now()
        
        queue_history = QueueHistory.objects.filter(
            Q(actual_start_time__isnull=True, scheduled_start_time__lte=now) |
            Q(actual_start_time__isnull=False, actual_end_time__isnull=True),
            appointment__status__in=['pending', 'confirmed', 'completed']
        ).order_by('queue_position')
        
        serializer = self.get_serializer(queue_history, many=True)
        return Response(serializer.data)

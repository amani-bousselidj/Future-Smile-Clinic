from rest_framework import serializers
from django.db import transaction
from django.db import models
from django.utils import timezone
from datetime import datetime
from .models import (
    Service, Patient, Doctor, Appointment, Queue, QueueStatistics,
    Notification, Testimonial, BlogPost, Gallery, ContactMessage
)


class ServiceSerializer(serializers.ModelSerializer):
    """Service serializer with validation"""
    
    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'category', 'price_min', 'price_max',
            'duration_minutes', 'image_url', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_duration_minutes(self, value):
        """Validate duration is positive"""
        if value <= 0:
            raise serializers.ValidationError("Duration must be greater than 0")
        return value
    
    def validate(self, data):
        """Validate price relationship"""
        if data.get('price_max') and data.get('price_min'):
            if data['price_max'] < data['price_min']:
                raise serializers.ValidationError(
                    "Maximum price cannot be less than minimum price"
                )
        return data


class DoctorSerializer(serializers.ModelSerializer):
    """Doctor/Staff serializer"""
    full_name = serializers.SerializerMethodField()
    services_detail = ServiceSerializer(many=True, read_only=True, source='services')
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'first_name', 'last_name', 'full_name', 'email', 'phone',
            'specialization', 'license_number', 'biography', 'photo_url',
            'is_active', 'services', 'services_detail', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.full_name


class PatientSerializer(serializers.ModelSerializer):
    """Patient serializer"""
    
    class Meta:
        model = Patient
        fields = [
            'id', 'full_name', 'phone', 'email', 'date_of_birth',
            'medical_history', 'allergies', 'insurance_provider', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        """Validate phone number format"""
        if not value or len(value) < 10:
            raise serializers.ValidationError("Invalid phone number")
        return value


class QueueSerializer(serializers.ModelSerializer):
    """Queue serializer"""
    
    class Meta:
        model = Queue
        fields = [
            'id', 'appointment', 'queue_position', 'appointment_date',
            'scheduled_start_time', 'actual_start_time', 'actual_end_time',
            'estimated_wait_minutes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSerializer(serializers.ModelSerializer):
    """Notification serializer"""
    
    class Meta:
        model = Notification
        fields = [
            'id', 'appointment', 'notification_type', 'channel', 'recipient',
            'message', 'scheduled_time', 'sent_time', 'status', 'error_message',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AppointmentDetailSerializer(serializers.ModelSerializer):
    """Detailed appointment serializer with related data"""
    patient_detail = PatientSerializer(read_only=True, source='patient')
    service_detail = ServiceSerializer(read_only=True, source='service')
    doctor_detail = DoctorSerializer(read_only=True, source='doctor')
    queue_detail = QueueSerializer(read_only=True, source='queue')
    notifications = NotificationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'booking_id', 'patient', 'patient_detail', 'service', 'service_detail',
            'doctor', 'doctor_detail', 'appointment_date', 'appointment_time',
            'queue_number', 'status', 'notes', 'cancellation_reason',
            'actual_start_time', 'actual_end_time', 'queue_detail', 'notifications',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'booking_id', 'queue_number', 'actual_start_time',
            'actual_end_time', 'created_at', 'updated_at'
        ]


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Appointment creation serializer"""
    patient_name = serializers.CharField(write_only=True, required=True)
    # Backward/alternate field name used by some frontend forms
    patient_full_name = serializers.CharField(write_only=True, required=False)
    patient_phone = serializers.CharField(write_only=True, required=True)
    patient_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)
    service_id = serializers.IntegerField(write_only=True, required=True)
    # Backward/alternate field name used by some frontend forms
    doctor_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'booking_id', 'patient_name', 'patient_full_name', 'patient_phone', 'patient_email',
            'service_id', 'doctor', 'doctor_id', 'appointment_date', 'appointment_time', 'notes', 'queue_number',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'booking_id', 'queue_number', 'status', 'created_at']
    
    @transaction.atomic
    def create(self, validated_data):
        """Create appointment with patient"""
        patient_name = validated_data.pop('patient_name', '')
        if not patient_name:
            patient_name = validated_data.pop('patient_full_name', '')
        else:
            validated_data.pop('patient_full_name', None)

        if not patient_name:
            raise serializers.ValidationError({'patient_name': 'Patient name is required'})

        patient_phone = validated_data.pop('patient_phone')
        patient_email = validated_data.pop('patient_email', '')
        service_id = validated_data.pop('service_id')

        doctor_id = validated_data.pop('doctor_id', None)
        # Allow passing doctor as "doctor" (default ModelSerializer behavior)
        doctor = validated_data.get('doctor', None)
        if doctor is None and doctor_id:
            try:
                validated_data['doctor'] = Doctor.objects.get(id=doctor_id)
            except Doctor.DoesNotExist:
                raise serializers.ValidationError({'doctor_id': 'Doctor not found'})
        
        # Get or create patient
        patient, _ = Patient.objects.get_or_create(
            phone=patient_phone,
            defaults={
                'full_name': patient_name,
                'email': patient_email or None
            }
        )
        
        # Get service
        service = Service.objects.get(id=service_id)
        
        # Calculate queue number
        queue_number = self._calculate_queue_number(
            validated_data['appointment_date'],
            service
        )
        
        # Create appointment
        appointment = Appointment.objects.create(
            patient=patient,
            service=service,
            queue_number=queue_number,
            **validated_data
        )
        
        return appointment
    
    def _calculate_queue_number(self, appointment_date, service):
        """Calculate queue number for the date and service"""
        latest = Appointment.objects.filter(
            appointment_date=appointment_date,
            service=service
        ).aggregate(models.Max('queue_number'))['queue_number__max'] or 0
        return latest + 1
    
    def _estimate_wait_time(self, queue_number):
        """Estimate wait time based on queue position"""
        # Assume 30 minutes per appointment
        return queue_number * 30


class TestimonialSerializer(serializers.ModelSerializer):
    """Testimonial serializer"""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'patient', 'patient_name', 'service', 'service_name',
            'rating', 'comment', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_approved', 'created_at', 'updated_at']
    
    def validate_rating(self, value):
        """Validate rating is between 1 and 5"""
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value


class BlogPostSerializer(serializers.ModelSerializer):
    """Blog post serializer"""
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content', 'author',
            'featured_image_url', 'category', 'is_published', 'published_at',
            'view_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'view_count', 'created_at', 'updated_at']


class GallerySerializer(serializers.ModelSerializer):
    """Gallery serializer"""

    class Meta:
        model = Gallery
        fields = [
            'id', 'title', 'description', 'treatment_type', 'before_image_url',
            'after_image_url', 'patient_name', 'is_featured', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']



class ContactMessageSerializer(serializers.ModelSerializer):
    """Contact message serializer"""
    
    class Meta:
        model = ContactMessage
        fields = [
            'id', 'name', 'email', 'phone', 'subject', 'message',
            'is_read', 'response', 'responded_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_read', 'responded_at', 'created_at', 'updated_at']


class QueueStatisticsSerializer(serializers.ModelSerializer):
    """Queue statistics serializer"""
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = QueueStatistics
        fields = [
            'id', 'service', 'service_name', 'appointment_date',
            'total_appointments', 'completed_appointments', 'cancelled_appointments',
            'average_wait_minutes', 'min_wait_minutes', 'max_wait_minutes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

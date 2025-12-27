from rest_framework import serializers
from .models import Service, Patient, Appointment, Testimonial, BlogPost, ContactMessage, BeforeAfterGallery, AppointmentNotification, QueueStatistics, QueueHistory


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    patient_phone = serializers.CharField(source='patient.phone', read_only=True)
    patient_email = serializers.CharField(source='patient.email', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)

    class Meta:
        model = Appointment
        fields = ['id', 'booking_id', 'queue_number', 'patient', 'patient_name', 'patient_phone', 'patient_email', 'service', 'service_name', 'appointment_date', 'appointment_time', 'status', 'notes', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True)
    patient_phone = serializers.CharField(write_only=True)
    patient_email = serializers.EmailField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = Appointment
        fields = ['patient_name', 'patient_phone', 'patient_email', 'service', 'appointment_date', 'appointment_time', 'notes']

    def create(self, validated_data):
        patient_name = validated_data.pop('patient_name')
        patient_phone = validated_data.pop('patient_phone')
        patient_email = validated_data.pop('patient_email', None)
        
        # Get or create patient
        patient, created = Patient.objects.get_or_create(
            phone=patient_phone,
            defaults={
                'full_name': patient_name,
                'email': patient_email
            }
        )
        
        # Update email if patient exists but email is new
        if not created and patient_email and not patient.email:
            patient.email = patient_email
            patient.save()
        
        # Create appointment
        appointment = Appointment.objects.create(
            patient=patient,
            **validated_data
        )
        
        # Create queue history and calculate wait time
        try:
            from .queue_service import QueueService
            QueueService.create_queue_history(appointment)
        except Exception as e:
            # Log error but don't fail appointment creation
            print(f"تحذير: فشل إنشاء سجل الطابور: {str(e)}")
        
        # Send notifications (optional - can be disabled if needed)
        try:
            from .notifications import NotificationService
            NotificationService.create_appointment_notifications(appointment)
        except Exception as e:
            # Log error but don't fail appointment creation
            print(f"تحذير: فشل إنشاء الإشعارات: {str(e)}")
        
        return appointment


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['is_read', 'created_at']


class BeforeAfterGallerySerializer(serializers.ModelSerializer):
    treatment_type_display = serializers.CharField(source='get_treatment_type_display', read_only=True)
    
    class Meta:
        model = BeforeAfterGallery
        fields = '__all__'


class AppointmentNotificationSerializer(serializers.ModelSerializer):
    notification_type_display = serializers.CharField(source='get_notification_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = AppointmentNotification
        fields = ['id', 'appointment', 'notification_type', 'notification_type_display', 'status', 'status_display', 'message', 'recipient', 'scheduled_time', 'sent_time', 'error_message', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'sent_time']


class QueueStatisticsSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = QueueStatistics
        fields = ['id', 'service', 'service_name', 'appointment_date', 'total_appointments', 'completed_appointments', 
                  'average_wait_minutes', 'average_service_duration_minutes', 'min_wait_minutes', 'max_wait_minutes', 
                  'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class QueueHistorySerializer(serializers.ModelSerializer):
    booking_id = serializers.CharField(source='appointment.booking_id', read_only=True)
    patient_name = serializers.CharField(source='appointment.patient.full_name', read_only=True)
    service_name = serializers.CharField(source='appointment.service.name', read_only=True)
    appointment_status = serializers.CharField(source='appointment.status', read_only=True)
    
    class Meta:
        model = QueueHistory
        fields = ['id', 'appointment', 'booking_id', 'patient_name', 'service_name', 'appointment_status',
                  'scheduled_start_time', 'actual_start_time', 'actual_end_time', 'estimated_wait_minutes',
                  'actual_wait_minutes', 'service_duration_minutes', 'queue_position', 'is_no_show',
                  'cancellation_reason', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at', 'actual_wait_minutes', 'service_duration_minutes']

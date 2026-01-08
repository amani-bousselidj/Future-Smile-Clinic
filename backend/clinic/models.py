from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
import uuid
from datetime import datetime, time, timedelta


class BaseModel(models.Model):
    """Abstract base model with common fields"""
    id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class Service(BaseModel):
    """Dental services offered by clinic"""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ('cleaning', 'Cleaning'),
            ('whitening', 'Whitening'),
            ('orthodontics', 'Orthodontics'),
            ('implants', 'Implants'),
            ('cosmetic', 'Cosmetic'),
            ('restorative', 'Restorative'),
            ('preventive', 'Preventive'),
        ]
    )
    price_min = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    duration_minutes = models.IntegerField(default=30)
    image_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['is_active', 'created_at']),
        ]
    
    def __str__(self):
        return self.name


class Patient(BaseModel):
    """Patient information"""
    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    email = models.EmailField(null=True, blank=True, unique=True)
    date_of_birth = models.DateField(null=True, blank=True)
    medical_history = models.TextField(null=True, blank=True)
    allergies = models.TextField(null=True, blank=True)
    insurance_provider = models.CharField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['phone']),
            models.Index(fields=['email']),
        ]
    
    def __str__(self):
        return self.full_name


class Doctor(BaseModel):
    """Doctor/Staff information"""
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    specialization = models.CharField(max_length=255)
    license_number = models.CharField(max_length=50, unique=True)
    biography = models.TextField(null=True, blank=True)
    photo_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    services = models.ManyToManyField(Service, related_name='doctors')
    
    class Meta:
        ordering = ['first_name', 'last_name']
        verbose_name_plural = 'Doctors'
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"


class Appointment(BaseModel):
    """Appointment bookings"""
    booking_id = models.CharField(max_length=50, unique=True, db_index=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.PROTECT, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.SET_NULL, null=True, blank=True)
    appointment_date = models.DateField(db_index=True)
    appointment_time = models.TimeField()
    queue_number = models.PositiveIntegerField(default=0)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('in_progress', 'In Progress'),
            ('completed', 'Completed'),
            ('cancelled', 'Cancelled'),
            ('no_show', 'No Show'),
        ],
        default='pending',
        db_index=True
    )
    notes = models.TextField(null=True, blank=True)
    cancellation_reason = models.TextField(null=True, blank=True)
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-appointment_date', '-appointment_time']
        indexes = [
            models.Index(fields=['booking_id']),
            models.Index(fields=['patient', 'appointment_date']),
            models.Index(fields=['appointment_date', 'appointment_time']),
            models.Index(fields=['status']),
        ]
    
    def __str__(self):
        return f"{self.booking_id} - {self.patient.full_name}"
    
    def save(self, *args, **kwargs):
        """Generate booking_id if not present"""
        if not self.booking_id:
            self.booking_id = self._generate_booking_id()
        super().save(*args, **kwargs)
    
    def _generate_booking_id(self):
        """Generate unique booking ID: BK-YYYYMMDD-XXXX"""
        date_str = timezone.now().strftime('%Y%m%d')
        random_suffix = str(uuid.uuid4().int)[:4]
        return f"BK-{date_str}-{random_suffix}"


class Queue(BaseModel):
    """Queue management for appointments"""
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='queue')
    queue_position = models.PositiveIntegerField()
    appointment_date = models.DateField(db_index=True)
    scheduled_start_time = models.DateTimeField()
    actual_start_time = models.DateTimeField(null=True, blank=True)
    actual_end_time = models.DateTimeField(null=True, blank=True)
    estimated_wait_minutes = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['appointment_date', 'queue_position']
        indexes = [
            models.Index(fields=['appointment_date', 'queue_position']),
        ]
    
    def __str__(self):
        return f"Queue {self.queue_position} - {self.appointment.patient.full_name}"


class QueueStatistics(BaseModel):
    """Daily queue statistics"""
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    appointment_date = models.DateField()
    total_appointments = models.PositiveIntegerField(default=0)
    completed_appointments = models.PositiveIntegerField(default=0)
    cancelled_appointments = models.PositiveIntegerField(default=0)
    average_wait_minutes = models.FloatField(default=0)
    min_wait_minutes = models.PositiveIntegerField(default=0)
    max_wait_minutes = models.PositiveIntegerField(default=0)
    
    class Meta:
        unique_together = ['service', 'appointment_date']
        ordering = ['-appointment_date']
        verbose_name_plural = 'Queue Statistics'
    
    def __str__(self):
        return f"{self.service.name} - {self.appointment_date}"


class Notification(BaseModel):
    """Appointment notifications"""
    NOTIFICATION_TYPES = [
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_confirmed', 'Appointment Confirmed'),
        ('appointment_cancelled', 'Appointment Cancelled'),
        ('appointment_rescheduled', 'Appointment Rescheduled'),
    ]
    
    CHANNELS = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'),
    ]
    
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    channel = models.CharField(max_length=20, choices=CHANNELS)
    recipient = models.CharField(max_length=255)  # email or phone
    message = models.TextField()
    scheduled_time = models.DateTimeField()
    sent_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('sent', 'Sent'),
            ('failed', 'Failed'),
        ],
        default='pending'
    )
    error_message = models.TextField(null=True, blank=True)
    
    class Meta:
        ordering = ['-scheduled_time']
        indexes = [
            models.Index(fields=['status', 'scheduled_time']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} - {self.recipient}"


class Testimonial(BaseModel):
    """Customer testimonials"""
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='testimonials')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True)
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    is_approved = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.patient.full_name} - {self.rating}★"


class BlogPost(BaseModel):
    """Blog articles"""
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    excerpt = models.CharField(max_length=500)
    content = models.TextField()
    author = models.CharField(max_length=255)
    featured_image_url = models.URLField(null=True, blank=True)
    category = models.CharField(max_length=100)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    view_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_published', '-published_at']),
        ]

    def __str__(self):
        return self.title


class ClinicProfile(BaseModel):
    """Singleton-like clinic profile/settings editable by admins."""
    name = models.CharField(max_length=255, default='Future Smile Clinic')
    tagline = models.CharField(max_length=255, blank=True, default='')

    primary_phone = models.CharField(max_length=50, blank=True, default='')
    secondary_phone = models.CharField(max_length=50, blank=True, default='')
    email = models.EmailField(blank=True, default='')

    address_line_1 = models.CharField(max_length=255, blank=True, default='')
    address_line_2 = models.CharField(max_length=255, blank=True, default='')

    hours_weekdays = models.CharField(max_length=255, blank=True, default='')
    hours_weekend = models.CharField(max_length=255, blank=True, default='')

    instagram_url = models.URLField(blank=True, default='')
    facebook_url = models.URLField(blank=True, default='')
    tiktok_url = models.URLField(blank=True, default='')

    class Meta:
        verbose_name = 'Clinic Profile'
        verbose_name_plural = 'Clinic Profile'

    def __str__(self):
        return self.name


class Gallery(BaseModel):
    """Before/After gallery"""
    TREATMENT_TYPES = [
        ('whitening', 'Teeth Whitening'),
        ('orthodontics', 'Orthodontics'),
        ('implant', 'Dental Implant'),
        ('restoration', 'Restoration'),
        ('cosmetic', 'Cosmetic Surgery'),
    ]
    
    title = models.CharField(max_length=255)
    description = models.TextField()
    treatment_type = models.CharField(max_length=50, choices=TREATMENT_TYPES)
    before_image_url = models.URLField()
    after_image_url = models.URLField()
    patient_name = models.CharField(max_length=255, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Galleries'
    
    def __str__(self):
        return self.title


class ContactMessage(BaseModel):
    """Contact form submissions"""
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20, null=True, blank=True)
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    response = models.TextField(null=True, blank=True)
    responded_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.subject} - {self.email}"

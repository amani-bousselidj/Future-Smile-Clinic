"""
Django Admin Configuration for Clinic App
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Service, Patient, Doctor, Appointment, Queue, QueueStatistics,
    Notification, Testimonial, BlogPost, Gallery, ContactMessage
)


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price_display', 'duration_display', 'is_active_display')
    list_filter = ('category', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'description')
        }),
        ('Pricing', {
            'fields': ('price_min', 'price_max')
        }),
        ('Details', {
            'fields': ('duration_minutes', 'image_url', 'is_active')
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def price_display(self, obj):
        return f"${obj.price_min} - ${obj.price_max}"
    price_display.short_description = "Price Range"

    def duration_display(self, obj):
        return f"{obj.duration_minutes} min"
    duration_display.short_description = "Duration"

    def is_active_display(self, obj):
        color = 'green' if obj.is_active else 'red'
        status = 'Active' if obj.is_active else 'Inactive'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_active_display.short_description = "Status"


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone_display', 'email', 'age_display', 'is_active_display')
    list_filter = ('is_active', 'created_at')
    search_fields = ('full_name', 'phone', 'email')
    readonly_fields = ('created_at', 'updated_at', 'id')
    fieldsets = (
        ('Personal Information', {
            'fields': ('full_name', 'email', 'phone')
        }),
        ('Medical Information', {
            'fields': ('date_of_birth', 'medical_history', 'allergies', 'insurance_provider')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('System Info', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def phone_display(self, obj):
        return obj.phone
    phone_display.short_description = "Phone"

    def age_display(self, obj):
        if obj.date_of_birth:
            from datetime import date
            age = date.today().year - obj.date_of_birth.year
            return f"{age} years"
        return "-"
    age_display.short_description = "Age"

    def is_active_display(self, obj):
        color = 'green' if obj.is_active else 'red'
        status = 'Active' if obj.is_active else 'Inactive'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_active_display.short_description = "Status"


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'specialization', 'email', 'phone', 'license_number')
    list_filter = ('specialization', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'license_number')
    readonly_fields = ('created_at', 'updated_at', 'id')
    filter_horizontal = ('services',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'phone', 'id')
        }),
        ('Professional Information', {
            'fields': ('specialization', 'license_number', 'services', 'biography')
        }),
        ('Media', {
            'fields': ('photo_url',)
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    full_name.short_description = "Name"


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('booking_id', 'patient_name', 'service_name', 'appointment_date', 'status_display', 'created_at')
    list_filter = ('status', 'appointment_date', 'created_at')
    search_fields = ('booking_id', 'patient__full_name', 'service__name')
    readonly_fields = ('booking_id', 'created_at', 'updated_at', 'id')
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_id', 'patient', 'service', 'doctor')
        }),
        ('Schedule', {
            'fields': ('appointment_date', 'appointment_time')
        }),
        ('Queue', {
            'fields': ('queue_number',)
        }),
        ('Status & Notes', {
            'fields': ('status', 'notes')
        }),
        ('System Info', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def patient_name(self, obj):
        return obj.patient.full_name
    patient_name.short_description = "Patient"

    def service_name(self, obj):
        return obj.service.name
    service_name.short_description = "Service"

    def status_display(self, obj):
        colors = {
            'pending': 'orange',
            'confirmed': 'blue',
            'in_progress': 'purple',
            'completed': 'green',
            'cancelled': 'red',
            'no_show': 'gray'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )
    status_display.short_description = "Status"


@admin.register(Queue)
class QueueAdmin(admin.ModelAdmin):
    list_display = ('appointment_booking_id', 'queue_position', 'appointment_date', 'estimated_wait_display')
    list_filter = ('appointment_date', 'created_at')
    search_fields = ('appointment__booking_id',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Queue Information', {
            'fields': ('appointment', 'queue_position', 'appointment_date')
        }),
        ('Timing', {
            'fields': ('scheduled_start_time', 'actual_start_time', 'actual_end_time', 'estimated_wait_minutes')
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def appointment_booking_id(self, obj):
        return obj.appointment.booking_id
    appointment_booking_id.short_description = "Booking ID"

    def estimated_wait_display(self, obj):
        if obj.estimated_wait_minutes:
            return f"{obj.estimated_wait_minutes} min"
        return "-"
    estimated_wait_display.short_description = "Est. Wait"


@admin.register(QueueStatistics)
class QueueStatisticsAdmin(admin.ModelAdmin):
    list_display = ('service_name', 'appointment_date', 'total_appointments', 'avg_wait_display', 'is_today')
    list_filter = ('appointment_date', 'created_at')
    search_fields = ('service__name',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Service & Date', {
            'fields': ('service', 'appointment_date')
        }),
        ('Counts', {
            'fields': ('total_appointments', 'completed_appointments', 'cancelled_appointments')
        }),
        ('Wait Times (minutes)', {
            'fields': ('average_wait_minutes', 'min_wait_minutes', 'max_wait_minutes')
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def service_name(self, obj):
        return obj.service.name
    service_name.short_description = "Service"

    def avg_wait_display(self, obj):
        if obj.average_wait_minutes:
            return f"{obj.average_wait_minutes} min"
        return "-"
    avg_wait_display.short_description = "Avg Wait"

    def is_today(self, obj):
        from django.utils import timezone
        today = timezone.now().date()
        return obj.appointment_date == today
    is_today.short_description = "Today?"
    is_today.boolean = True


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('appointment_booking_id', 'notification_type_display', 'channel', 'status_display', 'scheduled_time')
    list_filter = ('notification_type', 'channel', 'status', 'created_at')
    search_fields = ('appointment__booking_id', 'recipient')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Notification Details', {
            'fields': ('appointment', 'notification_type', 'channel', 'recipient')
        }),
        ('Content', {
            'fields': ('message',)
        }),
        ('Timing', {
            'fields': ('scheduled_time', 'sent_time')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def appointment_booking_id(self, obj):
        return obj.appointment.booking_id
    appointment_booking_id.short_description = "Booking ID"

    def notification_type_display(self, obj):
        return obj.get_notification_type_display()
    notification_type_display.short_description = "Type"

    def status_display(self, obj):
        colors = {'pending': 'orange', 'sent': 'green', 'failed': 'red'}
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, obj.get_status_display()
        )
    status_display.short_description = "Status"


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('patient_name', 'service_name', 'rating_display', 'is_approved_display', 'created_at')
    list_filter = ('rating', 'is_approved', 'created_at')
    search_fields = ('patient__full_name', 'service__name', 'comment')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Testimonial Info', {
            'fields': ('patient', 'service', 'rating')
        }),
        ('Content', {
            'fields': ('comment',)
        }),
        ('Status', {
            'fields': ('is_approved',)
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def patient_name(self, obj):
        return obj.patient.full_name
    patient_name.short_description = "Patient"

    def service_name(self, obj):
        return obj.service.name
    service_name.short_description = "Service"

    def rating_display(self, obj):
        stars = '⭐' * obj.rating + '☆' * (5 - obj.rating)
        return f"{stars} ({obj.rating}/5)"
    rating_display.short_description = "Rating"

    def is_approved_display(self, obj):
        color = 'green' if obj.is_approved else 'orange'
        status = 'Approved' if obj.is_approved else 'Pending'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_approved_display.short_description = "Status"


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author_display', 'category', 'is_published_display', 'view_count', 'created_at')
    list_filter = ('category', 'is_published', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    readonly_fields = ('created_at', 'updated_at', 'view_count')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Post Information', {
            'fields': ('title', 'slug', 'author')
        }),
        ('Content', {
            'fields': ('excerpt', 'content')
        }),
        ('Media', {
            'fields': ('featured_image',)
        }),
        ('Categorization', {
            'fields': ('category',)
        }),
        ('Status', {
            'fields': ('is_published',)
        }),
        ('Analytics', {
            'fields': ('view_count',),
            'classes': ('collapse',)
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def author_display(self, obj):
        return obj.author.get_full_name() or obj.author.username
    author_display.short_description = "Author"

    def is_published_display(self, obj):
        color = 'green' if obj.is_published else 'orange'
        status = 'Published' if obj.is_published else 'Draft'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_published_display.short_description = "Status"


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'treatment_type', 'patient_name_display', 'is_featured_display', 'created_at')
    list_filter = ('treatment_type', 'is_featured', 'created_at')
    search_fields = ('title', 'patient_name', 'treatment_type')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Image Information', {
            'fields': ('title', 'description')
        }),
        ('Images', {
            'fields': ('before_image', 'after_image')
        }),
        ('Details', {
            'fields': ('treatment_type', 'patient_name')
        }),
        ('Status', {
            'fields': ('is_featured',)
        }),
        ('System Info', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def patient_name_display(self, obj):
        return obj.patient_name or "-"
    patient_name_display.short_description = "Patient"

    def is_featured_display(self, obj):
        color = 'green' if obj.is_featured else 'gray'
        status = 'Featured' if obj.is_featured else 'Regular'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_featured_display.short_description = "Status"


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read_display', 'responded_display', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('created_at', 'id')
    fieldsets = (
        ('Contact Information', {
            'fields': ('name', 'email', 'phone', 'id')
        }),
        ('Message', {
            'fields': ('subject', 'message')
        }),
        ('Response', {
            'fields': ('response', 'responded_at')
        }),
        ('Status', {
            'fields': ('is_read',)
        }),
        ('System Info', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def is_read_display(self, obj):
        color = 'green' if obj.is_read else 'orange'
        status = 'Read' if obj.is_read else 'Unread'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color, status
        )
    is_read_display.short_description = "Status"

    def responded_display(self, obj):
        if obj.responded_at:
            return '✓ Yes'
        return '✗ No'
    responded_display.short_description = "Responded"


# Admin site customization
admin.site.site_header = "Future Smile Clinic - Admin Dashboard"
admin.site.site_title = "FSC Admin"
admin.site.index_title = "Welcome to Future Smile Clinic Administration"

from django.contrib import admin
from .models import Service, Patient, Appointment, Testimonial, BlogPost, ContactMessage, BeforeAfterGallery


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_min', 'price_max', 'duration', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['is_active']


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'phone', 'email', 'date_of_birth', 'created_at']
    search_fields = ['full_name', 'phone', 'email']
    list_filter = ['created_at']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'service', 'appointment_date', 'appointment_time', 'status', 'created_at']
    list_filter = ['status', 'appointment_date', 'created_at']
    search_fields = ['patient__full_name', 'service__name']
    list_editable = ['status']
    date_hierarchy = 'appointment_date'


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ['patient_name', 'service_name', 'rating', 'is_active', 'created_at']
    list_filter = ['rating', 'is_active', 'created_at']
    search_fields = ['patient_name', 'service_name', 'comment']
    list_editable = ['is_active']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'author', 'is_published', 'created_at']
    list_filter = ['category', 'is_published', 'created_at']
    search_fields = ['title', 'content', 'author']
    list_editable = ['is_published']


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    list_editable = ['is_read']
    readonly_fields = ['created_at']


@admin.register(BeforeAfterGallery)
class BeforeAfterGalleryAdmin(admin.ModelAdmin):
    list_display = ['title', 'treatment_type', 'is_featured', 'is_active', 'display_order', 'created_at']
    list_filter = ['treatment_type', 'is_featured', 'is_active', 'created_at']
    search_fields = ['title', 'description']
    list_editable = ['is_featured', 'is_active', 'display_order']
    readonly_fields = ['created_at', 'updated_at']

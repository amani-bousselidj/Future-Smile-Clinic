from django.db import models
from django.core.validators import RegexValidator
from datetime import datetime
import random
import string

class Service(models.Model):
    """خدمات العيادة"""
    name = models.CharField(max_length=200, verbose_name='اسم الخدمة')
    description = models.TextField(verbose_name='الوصف')
    price_min = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='السعر الأدنى')
    price_max = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='السعر الأعلى')
    duration = models.CharField(max_length=100, verbose_name='المدة')
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'خدمة'
        verbose_name_plural = 'الخدمات'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Patient(models.Model):
    """معلومات المرضى"""
    full_name = models.CharField(max_length=200, verbose_name='الاسم الكامل')
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="رقم الهاتف يجب أن يكون بالصيغة: '+213555123456'"
    )
    phone = models.CharField(validators=[phone_regex], max_length=17, verbose_name='رقم الهاتف')
    email = models.EmailField(blank=True, null=True, verbose_name='البريد الإلكتروني')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='تاريخ الميلاد')
    address = models.TextField(blank=True, null=True, verbose_name='العنوان')
    medical_history = models.TextField(blank=True, null=True, verbose_name='التاريخ الطبي')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'مريض'
        verbose_name_plural = 'المرضى'
        ordering = ['-created_at']

    def __str__(self):
        return self.full_name


class Appointment(models.Model):
    """الحجوزات"""
    STATUS_CHOICES = [
        ('pending', 'قيد الانتظار'),
        ('confirmed', 'مؤكد'),
        ('completed', 'مكتمل'),
        ('cancelled', 'ملغي'),
    ]

    booking_id = models.CharField(max_length=50, unique=True, db_index=True, verbose_name='معرف الحجز', null=True, blank=True)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, verbose_name='المريض')
    service = models.ForeignKey(Service, on_delete=models.SET_NULL, null=True, verbose_name='الخدمة')
    appointment_date = models.DateField(verbose_name='تاريخ الموعد')
    appointment_time = models.TimeField(verbose_name='وقت الموعد')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name='الحالة')
    notes = models.TextField(blank=True, null=True, verbose_name='ملاحظات')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'حجز'
        verbose_name_plural = 'الحجوزات'
        ordering = ['-appointment_date', '-appointment_time']
        unique_together = ['appointment_date', 'appointment_time']

    def generate_booking_id(self):
        """Generate unique booking ID in format: BK-YYYYMMDD-####"""
        if not self.booking_id:
            date_str = datetime.now().strftime('%Y%m%d')
            random_suffix = ''.join(random.choices(string.digits, k=4))
            self.booking_id = f"BK-{date_str}-{random_suffix}"

    def save(self, *args, **kwargs):
        if not self.booking_id:
            self.generate_booking_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.patient.full_name} - {self.appointment_date} {self.appointment_time}"


class Testimonial(models.Model):
    """آراء العملاء"""
    patient_name = models.CharField(max_length=200, default='', verbose_name='اسم المريض')
    service_name = models.CharField(max_length=200, default='', verbose_name='اسم الخدمة')
    rating = models.IntegerField(default=5, verbose_name='التقييم')
    comment = models.TextField(default='', verbose_name='التعليق')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'رأي'
        verbose_name_plural = 'الآراء'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.patient_name} - {self.service_name}"


class BlogPost(models.Model):
    """المقالات"""
    title = models.CharField(max_length=300, verbose_name='العنوان')
    excerpt = models.TextField(verbose_name='ملخص')
    content = models.TextField(verbose_name='المحتوى')
    image = models.URLField(max_length=500, blank=True, null=True, verbose_name='رابط الصورة')
    category = models.CharField(max_length=100, verbose_name='الفئة')
    author = models.CharField(max_length=200, verbose_name='الكاتب')
    read_time = models.CharField(max_length=50, verbose_name='وقت القراءة')
    is_published = models.BooleanField(default=True, verbose_name='منشور')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'مقال'
        verbose_name_plural = 'المقالات'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    """رسائل التواصل"""
    name = models.CharField(max_length=200, verbose_name='الاسم')
    email = models.EmailField(verbose_name='البريد الإلكتروني')
    subject = models.CharField(max_length=300, verbose_name='الموضوع')
    message = models.TextField(verbose_name='الرسالة')
    is_read = models.BooleanField(default=False, verbose_name='مقروء')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'رسالة تواصل'
        verbose_name_plural = 'رسائل التواصل'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class BeforeAfterGallery(models.Model):
    """معرض صور قبل وبعد"""
    TREATMENT_CHOICES = [
        ('whitening', 'تبييض الأسنان'),
        ('veneers', 'القشور'),
        ('implants', 'زراعة الأسنان'),
        ('orthodontics', 'تقويم الأسنان'),
        ('cosmetic', 'تجميل الأسنان'),
        ('other', 'أخرى'),
    ]
    
    title = models.CharField(max_length=200, verbose_name='العنوان')
    description = models.TextField(verbose_name='الوصف')
    treatment_type = models.CharField(max_length=50, choices=TREATMENT_CHOICES, verbose_name='نوع العلاج')
    before_image = models.ImageField(upload_to='gallery/before/', verbose_name='صورة قبل')
    after_image = models.ImageField(upload_to='gallery/after/', verbose_name='صورة بعد')
    patient_age = models.IntegerField(blank=True, null=True, verbose_name='عمر المريض')
    treatment_duration = models.CharField(max_length=100, blank=True, null=True, verbose_name='مدة العلاج')
    is_featured = models.BooleanField(default=False, verbose_name='مميز')
    is_active = models.BooleanField(default=True, verbose_name='نشط')
    display_order = models.IntegerField(default=0, verbose_name='ترتيب العرض')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'صورة قبل وبعد'
        verbose_name_plural = 'معرض قبل وبعد'
        ordering = ['display_order', '-created_at']

    def __str__(self):
        return f"{self.title} - {self.get_treatment_type_display()}"

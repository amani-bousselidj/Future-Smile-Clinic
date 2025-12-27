"""
خدمة إرسال الإشعارات للمواعيد
يمكن توسيع هذه الخدمة لاحقاً لتضمين SMS حقيقي وبريد إلكتروني
"""

from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
from .models import Appointment, AppointmentNotification, Patient


class NotificationService:
    """خدمة مركزية لإرسال الإشعارات"""
    
    @staticmethod
    def create_appointment_notifications(appointment):
        """
        إنشاء إشعارات تلقائية للموعد الجديد
        - إشعار فوري عند الحجز (WhatsApp/Email)
        - تذكير قبل 24 ساعة
        """
        try:
            patient = appointment.patient
            
            # 1. إشعار فوري عند الحجز
            if patient.email:
                NotificationService.create_notification(
                    appointment=appointment,
                    notification_type='email',
                    recipient=patient.email,
                    scheduled_time=datetime.now(),
                    message_type='booking_confirmation'
                )
            
            if patient.phone:
                NotificationService.create_notification(
                    appointment=appointment,
                    notification_type='whatsapp',
                    recipient=patient.phone,
                    scheduled_time=datetime.now(),
                    message_type='booking_confirmation'
                )
            
            # 2. تذكير قبل 24 ساعة
            reminder_time = appointment.appointment_datetime() - timedelta(hours=24)
            if reminder_time > datetime.now():
                if patient.email:
                    NotificationService.create_notification(
                        appointment=appointment,
                        notification_type='email',
                        recipient=patient.email,
                        scheduled_time=reminder_time,
                        message_type='appointment_reminder'
                    )
                
                if patient.phone:
                    NotificationService.create_notification(
                        appointment=appointment,
                        notification_type='whatsapp',
                        recipient=patient.phone,
                        scheduled_time=reminder_time,
                        message_type='appointment_reminder'
                    )
            
            return True
        except Exception as e:
            print(f"خطأ في إنشاء الإشعارات: {str(e)}")
            return False
    
    @staticmethod
    def create_notification(appointment, notification_type, recipient, scheduled_time, message_type='booking_confirmation'):
        """إنشاء تسجيل إشعار جديد"""
        try:
            message = NotificationService.get_message_template(
                appointment, message_type, notification_type
            )
            
            notification = AppointmentNotification.objects.create(
                appointment=appointment,
                notification_type=notification_type,
                recipient=recipient,
                scheduled_time=scheduled_time,
                message=message,
                status='pending'
            )
            
            # إرسال فوري إذا كان الوقت الحالي
            if scheduled_time <= datetime.now():
                NotificationService.send_notification(notification)
            
            return notification
        except Exception as e:
            print(f"خطأ في إنشاء الإشعار: {str(e)}")
            return None
    
    @staticmethod
    def send_notification(notification):
        """إرسال الإشعار فعلياً"""
        try:
            if notification.notification_type == 'email':
                NotificationService.send_email_notification(notification)
            elif notification.notification_type == 'sms':
                NotificationService.send_sms_notification(notification)
            elif notification.notification_type == 'whatsapp':
                NotificationService.send_whatsapp_notification(notification)
            
            notification.status = 'sent'
            notification.sent_time = datetime.now()
            notification.save()
            return True
        except Exception as e:
            notification.status = 'failed'
            notification.error_message = str(e)
            notification.save()
            print(f"فشل إرسال الإشعار: {str(e)}")
            return False
    
    @staticmethod
    def send_email_notification(notification):
        """إرسال إشعار بريد إلكتروني"""
        try:
            appointment = notification.appointment
            subject = f"تأكيد موعد - عيادة Future Smile - {appointment.booking_id}"
            
            send_mail(
                subject,
                notification.message,
                settings.DEFAULT_FROM_EMAIL,
                [notification.recipient],
                html_message=f"<div dir='rtl'><pre>{notification.message}</pre></div>",
                fail_silently=False,
            )
            return True
        except Exception as e:
            print(f"فشل إرسال البريد الإلكتروني: {str(e)}")
            raise
    
    @staticmethod
    def send_sms_notification(notification):
        """
        إرسال رسالة نصية
        يمكن استخدام Twilio أو خدمة SMS أخرى
        """
        # TODO: تنفيذ integration مع Twilio أو خدمة SMS
        # مثال:
        # from twilio.rest import Client
        # client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        # client.messages.create(to=notification.recipient, from_=TWILIO_PHONE, body=notification.message)
        pass
    
    @staticmethod
    def send_whatsapp_notification(notification):
        """
        إرسال رسالة واتساب
        يمكن استخدام Twilio WhatsApp API أو خدمة أخرى
        """
        # TODO: تنفيذ integration مع Twilio WhatsApp API
        # مثال:
        # from twilio.rest import Client
        # client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        # client.messages.create(to=f"whatsapp:{notification.recipient}", from_="whatsapp:+...", body=notification.message)
        pass
    
    @staticmethod
    def get_message_template(appointment, message_type, notification_type):
        """الحصول على نص الرسالة حسب النوع"""
        patient = appointment.patient
        
        if message_type == 'booking_confirmation':
            return f"""
مرحباً {patient.full_name}،

تم تأكيد حجزك في عيادة Future Smile للأسنان بنجاح! ✓

معرف الحجز: {appointment.booking_id}
الخدمة: {appointment.service.name if appointment.service else 'خدمة'}
التاريخ: {appointment.appointment_date}
الوقت: {appointment.appointment_time}

الرجاء الحضور قبل 10 دقائق من الموعد المحدد.

للتواصل معنا:
الهاتف: +213 555 123 456
البريد: info@futuresmile.dz

شكراً لاختيارك عيادة Future Smile! 😊
"""
        
        elif message_type == 'appointment_reminder':
            return f"""
تذكير: موعدك غداً! ⏰

معرف الحجز: {appointment.booking_id}
الخدمة: {appointment.service.name if appointment.service else 'خدمة'}
التاريخ: {appointment.appointment_date}
الوقت: {appointment.appointment_time}

الرجاء الحضور في الوقت المحدد. استعلم عن أي استفسارات.

الهاتف: +213 555 123 456
"""
        
        return "إشعار من عيادة Future Smile"
    
    @staticmethod
    def send_pending_notifications():
        """
        إرسال جميع الإشعارات المعلقة التي حان وقتها
        يمكن استدعاء هذه الدالة من خلال celery task أو cron job
        """
        from django.utils import timezone
        
        pending = AppointmentNotification.objects.filter(
            status='pending',
            scheduled_time__lte=timezone.now()
        )
        
        count = 0
        for notification in pending:
            if NotificationService.send_notification(notification):
                count += 1
        
        return count

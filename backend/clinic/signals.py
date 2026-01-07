"""
Django signals for Clinic app
Handles automatic actions on model changes
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import datetime
from .models import Appointment, Queue, Notification, QueueStatistics


@receiver(post_save, sender=Appointment)
def create_queue_for_appointment(sender, instance, created, **kwargs):
    """
    Automatically create a queue entry when appointment is created
    """
    if created:
        # Queue entry (one-to-one); create only if missing
        if not Queue.objects.filter(appointment=instance).exists():
            queue_position = instance.queue_number or (
                Appointment.objects.filter(
                    appointment_date=instance.appointment_date,
                    service=instance.service
                ).count()
            )

            scheduled_start_dt = datetime.combine(
                instance.appointment_date,
                instance.appointment_time
            )
            if timezone.is_naive(scheduled_start_dt):
                scheduled_start_dt = timezone.make_aware(
                    scheduled_start_dt,
                    timezone.get_current_timezone()
                )

            Queue.objects.create(
                appointment=instance,
                queue_position=queue_position,
                appointment_date=instance.appointment_date,
                scheduled_start_time=scheduled_start_dt,
                estimated_wait_minutes=estimate_wait_time(queue_position)
            )

        # Optional notification entry (only if we have a recipient)
        recipient = instance.patient.email or ""
        if recipient:
            Notification.objects.create(
                appointment=instance,
                notification_type='appointment_confirmed',
                channel='email',
                recipient=recipient,
                message=(
                    f"Your appointment is booked for {instance.appointment_date} "
                    f"at {instance.appointment_time}"
                ),
                scheduled_time=timezone.now(),
                status='pending'
            )


@receiver(post_save, sender=Appointment)
def update_queue_statistics(sender, instance, created, **kwargs):
    """
    Update queue statistics when appointment status changes
    """
    if not created:  # Only on update
        stats, _ = QueueStatistics.objects.get_or_create(
            service=instance.service,
            appointment_date=instance.appointment_date
        )

        # Recalculate statistics
        appointments = Appointment.objects.filter(
            service=instance.service,
            appointment_date=instance.appointment_date
        )

        stats.total_appointments = appointments.count()
        stats.completed_appointments = appointments.filter(status='completed').count()
        stats.cancelled_appointments = appointments.filter(status='cancelled').count()

        # Calculate wait times from queue data
        queues = Queue.objects.filter(
            appointment__service=instance.service,
            appointment_date=instance.appointment_date
        ).exclude(estimated_wait_minutes__isnull=True)

        if queues.exists():
            wait_times = [q.estimated_wait_minutes for q in queues]
            stats.average_wait_minutes = sum(wait_times) / len(wait_times)
            stats.min_wait_minutes = min(wait_times)
            stats.max_wait_minutes = max(wait_times)

        stats.save()


def estimate_wait_time(queue_position: int) -> int:
    """
    Estimate wait time based on queue position
    Assumes 30 minutes per appointment on average
    """
    base_time = 30
    return queue_position * base_time

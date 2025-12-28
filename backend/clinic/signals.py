"""
Django signals for Clinic app
Handles automatic actions on model changes
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta
from .models import Appointment, Queue, Notification, QueueStatistics


@receiver(post_save, sender=Appointment)
def create_queue_for_appointment(sender, instance, created, **kwargs):
    """
    Automatically create a queue entry when appointment is created
    """
    if created:
        # Get current queue position for this date and service
        existing_count = Appointment.objects.filter(
            appointment_date=instance.appointment_date,
            service=instance.service
        ).count()

        queue_position = existing_count

        Queue.objects.create(
            appointment=instance,
            queue_position=queue_position,
            appointment_date=instance.appointment_date,
            scheduled_time=instance.appointment_time,
            estimated_wait_minutes=estimate_wait_time(queue_position)
        )

        # Create notification entry
        Notification.objects.create(
            appointment=instance,
            notification_type='confirmation',
            channel='email',
            recipient=instance.patient.email,
            message=f"Your appointment has been confirmed for {instance.appointment_date} at {instance.appointment_time}",
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
            statistics_date=instance.appointment_date.date()
        )

        # Recalculate statistics
        appointments = Appointment.objects.filter(
            service=instance.service,
            appointment_date__date=instance.appointment_date.date()
        )

        stats.total_appointments = appointments.count()
        stats.completed_appointments = appointments.filter(status='completed').count()
        stats.cancelled_appointments = appointments.filter(status='cancelled').count()

        # Calculate wait times from queue data
        queues = Queue.objects.filter(
            appointment__service=instance.service,
            appointment_date=instance.appointment_date.date()
        ).exclude(estimated_wait_minutes__isnull=True)

        if queues.exists():
            wait_times = [q.estimated_wait_minutes for q in queues]
            stats.average_wait_minutes = sum(wait_times) // len(wait_times)
            stats.min_wait_minutes = min(wait_times)
            stats.max_wait_minutes = max(wait_times)

        stats.save()


def estimate_wait_time(queue_position: int) -> int:
    """
    Estimate wait time based on queue position
    Assumes 15 minutes per appointment on average
    """
    base_time = 15
    return queue_position * base_time

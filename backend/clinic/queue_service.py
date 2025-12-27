"""
خدمة حساب الطابور المتقدمة
Advanced Queue Calculator Service with ML-based wait time prediction
"""

from datetime import datetime, timedelta
from django.db.models import Avg, Count, Q, F
from django.utils import timezone
from .models import Appointment, QueueStatistics, QueueHistory, Service
import logging

logger = logging.getLogger(__name__)


class QueueService:
    """خدمة متقدمة لحساب أرقام الطابور ووقت الانتظار المتوقع"""
    
    PEAK_HOURS = [(12, 14), (18, 20)]  # ساعات الذروة (الظهيرة والمساء)
    BASE_BUFFER_MINUTES = 5  # وقت انتظار أساسي بين الموعد والآخر (دقائق)
    PEAK_HOUR_MULTIPLIER = 1.5  # مضاعف الانتظار في ساعات الذروة
    
    @staticmethod
    def is_peak_hour(appointment_hour: int) -> bool:
        """التحقق من ما إذا كان الوقت في ساعات الذروة"""
        for start, end in QueueService.PEAK_HOURS:
            if start <= appointment_hour < end:
                return True
        return False
    
    @staticmethod
    def get_historical_average_wait(service_id: int, appointment_date=None, lookback_days: int = 30) -> int:
        """
        الحصول على متوسط الانتظار التاريخي لخدمة معينة
        
        Args:
            service_id: معرف الخدمة
            appointment_date: تاريخ الموعد (للإحصائيات الأسبوعية)
            lookback_days: عدد الأيام السابقة للبحث عن البيانات التاريخية
        
        Returns:
            متوسط الانتظار بالدقائق
        """
        try:
            if appointment_date is None:
                appointment_date = timezone.now().date()
            
            # حساب النطاق الزمني
            start_date = appointment_date - timedelta(days=lookback_days)
            
            # البحث عن الإحصائيات التاريخية
            stats = QueueStatistics.objects.filter(
                service_id=service_id,
                appointment_date__gte=start_date,
                appointment_date__lte=appointment_date,
                completed_appointments__gt=0
            ).aggregate(
                avg_wait=Avg('average_wait_minutes'),
                count=Count('id')
            )
            
            average_wait = stats.get('avg_wait', 0)
            if average_wait is None:
                average_wait = 0
            
            return int(average_wait)
        except Exception as e:
            logger.error(f"خطأ في حساب متوسط الانتظار التاريخي: {str(e)}")
            return 0
    
    @staticmethod
    def get_queue_count_for_time_slot(
        appointment_date,
        appointment_time,
        service_id: int = None
    ) -> int:
        """
        الحصول على عدد المواعيد في نفس فترة الوقت
        
        Args:
            appointment_date: تاريخ الموعد
            appointment_time: وقت الموعد
            service_id: معرف الخدمة (اختياري)
        
        Returns:
            عدد المواعيد قبل هذا الموعد في نفس الفترة
        """
        try:
            query = Appointment.objects.filter(
                appointment_date=appointment_date,
                appointment_time__lte=appointment_time,
                status__in=['pending', 'confirmed', 'completed']
            )
            
            if service_id:
                query = query.filter(service_id=service_id)
            
            return query.count()
        except Exception as e:
            logger.error(f"خطأ في حساب عدد المواعيد: {str(e)}")
            return 1
    
    @staticmethod
    def estimate_wait_time(
        appointment_date,
        appointment_time,
        service_id: int
    ) -> int:
        """
        حساب وقت الانتظار المتوقع بناءً على:
        1. عدد المواعيد قبل هذا الموعد
        2. متوسط مدة كل موعد (حسب الخدمة)
        3. ساعات الذروة
        4. البيانات التاريخية
        
        Args:
            appointment_date: تاريخ الموعد
            appointment_time: وقت الموعد
            service_id: معرف الخدمة
        
        Returns:
            وقت الانتظار المتوقع بالدقائق
        """
        try:
            # 1. حساب عدد المواعيد قبل هذا الموعد
            queue_count = QueueService.get_queue_count_for_time_slot(
                appointment_date,
                appointment_time,
                service_id
            ) - 1  # طرح هذا الموعد
            queue_count = max(0, queue_count)  # التأكد من أنه لا يكون سالب
            
            # 2. الحصول على معلومات الخدمة
            try:
                service = Service.objects.get(id=service_id)
                # محاولة استخلاص الدقائق من مدة الخدمة
                service_duration = QueueService.extract_duration_minutes(service.duration)
            except Service.DoesNotExist:
                service_duration = 30  # قيمة افتراضية
            
            # 3. الحصول على متوسط الانتظار التاريخي
            historical_average = QueueService.get_historical_average_wait(service_id, appointment_date)
            
            # 4. حساب وقت الانتظار الأساسي
            base_wait = queue_count * (service_duration + QueueService.BASE_BUFFER_MINUTES)
            
            # 5. التحقق من ساعات الذروة
            appointment_hour = appointment_time.hour
            if QueueService.is_peak_hour(appointment_hour):
                base_wait = int(base_wait * QueueService.PEAK_HOUR_MULTIPLIER)
            
            # 6. الجمع بين الحسابات (75% من الحساب + 25% من البيانات التاريخية)
            if historical_average > 0:
                estimated_wait = int(base_wait * 0.75 + historical_average * 0.25)
            else:
                estimated_wait = base_wait
            
            # التأكد من أن الحد الأدنى هو 0
            estimated_wait = max(0, estimated_wait)
            
            logger.info(
                f"Estimated wait for service {service_id} on {appointment_date} at {appointment_time}: "
                f"{estimated_wait} minutes (queue: {queue_count}, historical: {historical_average})"
            )
            
            return estimated_wait
        
        except Exception as e:
            logger.error(f"خطأ في حساب وقت الانتظار المتوقع: {str(e)}")
            return 0
    
    @staticmethod
    def extract_duration_minutes(duration_str: str) -> int:
        """
        استخلاص الدقائق من نص مدة الخدمة
        
        Examples:
            "30 minutes" -> 30
            "1 hour" -> 60
            "1.5 hours" -> 90
            "2 ساعات" -> 120
        
        Args:
            duration_str: نص مدة الخدمة
        
        Returns:
            عدد الدقائق
        """
        try:
            # تنسيق النص
            duration_str = str(duration_str).lower().strip()
            
            # البحث عن الأرقام
            import re
            numbers = re.findall(r'[\d.]+', duration_str)
            if not numbers:
                return 30  # قيمة افتراضية
            
            duration_value = float(numbers[0])
            
            # التحقق من الوحدة
            if 'hour' in duration_str or 'ساع' in duration_str:
                return int(duration_value * 60)
            elif 'min' in duration_str or 'دقيق' in duration_str:
                return int(duration_value)
            else:
                # بافتراض أنها دقائق إذا لم تُحدد الوحدة
                return int(duration_value)
        
        except Exception as e:
            logger.error(f"خطأ في استخلاص المدة: {str(e)}")
            return 30  # قيمة افتراضية
    
    @staticmethod
    def create_queue_history(appointment) -> 'QueueHistory':
        """
        إنشاء سجل طابور جديد عند إنشاء موعد
        
        Args:
            appointment: كائن الموعد
        
        Returns:
            كائن QueueHistory المُنشأ
        """
        try:
            estimated_wait = QueueService.estimate_wait_time(
                appointment.appointment_date,
                appointment.appointment_time,
                appointment.service_id
            )
            
            from datetime import datetime as dt, time
            # دمج التاريخ والوقت
            scheduled_datetime = dt.combine(
                appointment.appointment_date,
                appointment.appointment_time
            )
            
            queue_history = QueueHistory.objects.create(
                appointment=appointment,
                scheduled_start_time=scheduled_datetime,
                estimated_wait_minutes=estimated_wait,
                queue_position=appointment.queue_number
            )
            
            logger.info(f"تم إنشاء سجل طابور للموعد {appointment.booking_id}")
            return queue_history
        
        except Exception as e:
            logger.error(f"خطأ في إنشاء سجل الطابور: {str(e)}")
            return None
    
    @staticmethod
    def update_queue_statistics(appointment_date, service_id: int = None):
        """
        تحديث إحصائيات الطابور لتاريخ معين
        يتم استدعاؤها في نهاية اليوم أو عند الطلب
        
        Args:
            appointment_date: تاريخ التحديث
            service_id: معرف الخدمة (إذا كان None، سيتم تحديث جميع الخدمات)
        """
        try:
            # استعلام المواعيد المكتملة في اليوم المحدد
            query = Appointment.objects.filter(
                appointment_date=appointment_date,
                status='completed'
            ).select_related('service')
            
            if service_id:
                query = query.filter(service_id=service_id)
            
            appointments = query.prefetch_related('queue_history')
            
            # تجميع الإحصائيات حسب الخدمة
            service_stats = {}
            
            for appointment in appointments:
                if appointment.service_id not in service_stats:
                    service_stats[appointment.service_id] = {
                        'total': 0,
                        'completed': 0,
                        'wait_times': [],
                        'service_durations': []
                    }
                
                service_stats[appointment.service_id]['total'] += 1
                
                # محاولة الحصول على سجل الطابور
                try:
                    queue_history = appointment.queue_history
                    if queue_history.actual_wait_minutes is not None:
                        service_stats[appointment.service_id]['wait_times'].append(
                            queue_history.actual_wait_minutes
                        )
                    if queue_history.service_duration_minutes is not None:
                        service_stats[appointment.service_id]['service_durations'].append(
                            queue_history.service_duration_minutes
                        )
                except:
                    pass
            
            # تحديث قاعدة البيانات
            for service_id, stats in service_stats.items():
                avg_wait = (
                    sum(stats['wait_times']) // len(stats['wait_times'])
                    if stats['wait_times'] else 0
                )
                avg_duration = (
                    sum(stats['service_durations']) // len(stats['service_durations'])
                    if stats['service_durations'] else 30
                )
                
                QueueStatistics.objects.update_or_create(
                    service_id=service_id,
                    appointment_date=appointment_date,
                    defaults={
                        'total_appointments': stats['total'],
                        'completed_appointments': len(stats['wait_times']),
                        'average_wait_minutes': avg_wait,
                        'average_service_duration_minutes': avg_duration,
                        'min_wait_minutes': min(stats['wait_times']) if stats['wait_times'] else 0,
                        'max_wait_minutes': max(stats['wait_times']) if stats['wait_times'] else 0,
                    }
                )
            
            logger.info(f"تم تحديث إحصائيات الطابور لـ {appointment_date}")
        
        except Exception as e:
            logger.error(f"خطأ في تحديث إحصائيات الطابور: {str(e)}")
    
    @staticmethod
    def get_current_queue_status(appointment_date=None) -> dict:
        """
        الحصول على حالة الطابور الحالية
        
        Args:
            appointment_date: تاريخ الطابور (افتراضياً اليوم)
        
        Returns:
            قاموس يحتوي على معلومات الطابور
        """
        try:
            if appointment_date is None:
                appointment_date = timezone.now().date()
            
            appointments = Appointment.objects.filter(
                appointment_date=appointment_date,
                status__in=['pending', 'confirmed', 'completed']
            ).values('service__name').annotate(
                queue_count=Count('id'),
                avg_wait=Avg('queue_history__estimated_wait_minutes')
            )
            
            return {
                'date': appointment_date,
                'queue_status': list(appointments),
                'timestamp': timezone.now()
            }
        
        except Exception as e:
            logger.error(f"خطأ في الحصول على حالة الطابور: {str(e)}")
            return {
                'date': appointment_date,
                'queue_status': [],
                'timestamp': timezone.now(),
                'error': str(e)
            }

// نموذج حساب رقم الطابور والوقت المتوقع للانتظار
// بناءً على المواعيد السابقة ومدة الخدمة

interface QueueCalculationData {
  appointmentTime: string; // format: "HH:MM"
  appointmentDate: string; // format: "YYYY-MM-DD"
  serviceName: string;
  allAppointments: Array<{
    appointment_time: string;
    appointment_date: string;
    service_name: string;
    status: string;
  }>;
}

interface QueueInfo {
  queueNumber: number;
  estimatedWaitTime: number; // في الدقائق
  appointmentTime: string;
  approximateCallTime: string;
  position: number;
  totalBefore: number;
}

// خدمة مدة الخدمات (يمكن تحديثها حسب قاعدة البيانات الفعلية)
const SERVICE_DURATIONS: { [key: string]: number } = {
  "تبييض الأسنان": 45,
  "تركيب التقويم": 120,
  "علاج التسوس": 40,
  "زراعة الأسنان": 90,
  "حشوات تجميلية": 50,
  "تنظيف الأسنان": 30,
  "علاج اللثة": 60,
  "خلع الأسنان": 35,
};

// متوسط الوقت الافتراضي للخدمة (بالدقائق)
const DEFAULT_SERVICE_DURATION = 45;

/**
 * حساب رقم الطابور بناءً على المواعيد السابقة في نفس اليوم
 * الصيغة:
 * 1. احسب عدد المواعيد قبل هذا الموعد في نفس اليوم
 * 2. اضرب في متوسط مدة الخدمة
 * 3. أضف رقم الموعد
 */
export function calculateQueueNumber(data: QueueCalculationData): QueueInfo {
  const [apptHour, apptMin] = data.appointmentTime.split(":").map(Number);
  const apptTimeInMinutes = apptHour * 60 + apptMin;

  // احصل على مدة الخدمة
  const serviceDuration =
    SERVICE_DURATIONS[data.serviceName] || DEFAULT_SERVICE_DURATION;

  // احسب عدد المواعيد قبل هذا الموعد في نفس اليوم
  let appointmentsBefore = 0;
  let totalWaitTime = 0;

  // ترتيب المواعيد حسب الوقت والتاريخ
  const sortedAppointments = data.allAppointments.sort((a, b) => {
    const dateA = new Date(a.appointment_date);
    const dateB = new Date(b.appointment_date);
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime();
    }
    const [aHour, aMin] = a.appointment_time.split(":").map(Number);
    const [bHour, bMin] = b.appointment_time.split(":").map(Number);
    return aHour * 60 + aMin - (bHour * 60 + bMin);
  });

  // احسب عدد المواعيد المكتملة والمعلقة قبل هذا الموعد
  for (const apt of sortedAppointments) {
    const aptDate = new Date(apt.appointment_date);
    const targetDate = new Date(data.appointmentDate);

    // تجاهل المواعيد الملغاة
    if (apt.status === "cancelled") continue;

    // اذا كان التاريخ مختلفاً، تجاوز
    if (aptDate.toDateString() !== targetDate.toDateString()) {
      if (aptDate < targetDate) {
        continue;
      } else {
        break;
      }
    }

    // اذا كان نفس التاريخ، قارن الوقت
    const [aptHour, aptMin] = apt.appointment_time.split(":").map(Number);
    const aptTimeInMinutes = aptHour * 60 + aptMin;

    if (aptTimeInMinutes < apptTimeInMinutes) {
      appointmentsBefore++;
      // احسب المدة المتوقعة للخدمة السابقة
      const prevServiceDuration =
        SERVICE_DURATIONS[apt.service_name] || DEFAULT_SERVICE_DURATION;
      totalWaitTime += prevServiceDuration;
    } else if (aptTimeInMinutes === apptTimeInMinutes) {
      // اذا كان هناك موعد بنفس الوقت
      appointmentsBefore++;
    } else {
      break;
    }
  }

  // رقم الطابور = عدد المواعيد قبل هذا + 1
  const queueNumber = appointmentsBefore + 1;

  // الوقت المتوقع للانتظار = إجمالي وقت المواعيد قبل هذا
  const estimatedWaitTime = totalWaitTime;

  // الوقت المتوقع للاستدعاء
  const callTimeMinutes = apptTimeInMinutes + estimatedWaitTime;
  const callHour = Math.floor(callTimeMinutes / 60);
  const callMin = callTimeMinutes % 60;
  const approximateCallTime = `${String(callHour).padStart(2, "0")}:${String(
    callMin
  ).padStart(2, "0")}`;

  return {
    queueNumber,
    estimatedWaitTime: Math.max(0, estimatedWaitTime),
    appointmentTime: data.appointmentTime,
    approximateCallTime,
    position: appointmentsBefore,
    totalBefore: appointmentsBefore,
  };
}

/**
 * احسب وقت القدوم الموصى به (قبل الموعد بـ 15 دقيقة)
 */
export function getRecommendedArrivalTime(appointmentTime: string): string {
  const [hour, min] = appointmentTime.split(":").map(Number);
  let totalMinutes = hour * 60 + min - 15; // قدم 15 دقيقة مبكراً

  if (totalMinutes < 0) {
    // اذا كان الوقت قبل منتصف الليل
    totalMinutes += 24 * 60;
  }

  const arrivalHour = Math.floor(totalMinutes / 60);
  const arrivalMin = totalMinutes % 60;

  return `${String(arrivalHour).padStart(2, "0")}:${String(arrivalMin).padStart(
    2,
    "0"
  )}`;
}

/**
 * احسب الفترة الزمنية للموعد (صباح/مساء)
 */
export function getTimeOfDay(appointmentTime: string): string {
  const [hour] = appointmentTime.split(":").map(Number);

  if (hour >= 5 && hour < 12) return "صباحاً";
  if (hour >= 12 && hour < 17) return "بعد الظهيرة";
  if (hour >= 17 && hour < 21) return "مساءً";
  return "ليلاً";
}

/**
 * احسب الفرق الزمني بين الآن والموعد
 */
export function getTimeUntilAppointment(
  appointmentDate: string,
  appointmentTime: string
): {
  days: number;
  hours: number;
  minutes: number;
  totalMinutes: number;
  isPast: boolean;
} {
  const now = new Date();
  const [apptHour, apptMin] = appointmentTime.split(":").map(Number);
  const appointmentDateTime = new Date(appointmentDate);
  appointmentDateTime.setHours(apptHour, apptMin, 0, 0);

  const diffMs = appointmentDateTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  const days = Math.floor(diffMinutes / (24 * 60));
  const hours = Math.floor((diffMinutes % (24 * 60)) / 60);
  const minutes = diffMinutes % 60;

  return {
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    totalMinutes: Math.max(0, diffMinutes),
    isPast: diffMs < 0,
  };
}

/**
 * احصل على وصف الموعد (كم يوم/ساعة من الآن)
 */
export function getAppointmentDescription(
  appointmentDate: string,
  appointmentTime: string
): string {
  const timeInfo = getTimeUntilAppointment(appointmentDate, appointmentTime);

  if (timeInfo.isPast) {
    return "هذا الموعد في الماضي";
  }

  if (timeInfo.days === 0) {
    if (timeInfo.hours === 0) {
      return `الموعد بعد ${timeInfo.minutes} دقيقة`;
    }
    return `الموعد بعد ${timeInfo.hours} ساعة و ${timeInfo.minutes} دقيقة`;
  }

  if (timeInfo.days === 1) {
    return "الموعد غداً";
  }

  return `الموعد بعد ${timeInfo.days} يوم`;
}

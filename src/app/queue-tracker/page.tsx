"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaPhone,
  FaUser,
  FaTooth,
  FaSpinner,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaVolumeUp,
} from "react-icons/fa";
import Link from "next/link";
import { appointmentsAPI } from "../../lib/api";

interface CurrentQueue {
  totalInQueue: number;
  yourPosition: number;
  estimatedWaitTime: number; // في الدقائق
  currentlyServing?: string;
}

interface QueueAppointment {
  id: number;
  booking_id: string;
  patient_name: string;
  appointment_time: string;
  service_name: string;
  queue_number: number;
  status: string;
}

export default function QueueTrackerPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const [currentQueue, setCurrentQueue] = useState<CurrentQueue | null>(null);
  const [userAppointment, setUserAppointment] =
    useState<QueueAppointment | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    QueueAppointment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // محاكاة صوت الإشعار
  const playNotification = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("دورك الآن");
      utterance.lang = "ar-SA";
      window.speechSynthesis.speak(utterance);
    }
  };

  // تحديث بيانات الطابور
  const updateQueueData = async () => {
    try {
      const data = await appointmentsAPI.getAll();
      const appointments = data.results || [];

      // احصل على موعد المستخدم
      const userAppt = appointments.find(
        (apt: any) => apt.booking_id === bookingId
      );

      if (userAppt) {
        setUserAppointment(userAppt);

        // احسب الطابور الحالي لنفس اليوم
        const todayAppointments = appointments.filter(
          (apt: any) =>
            apt.appointment_date === userAppt.appointment_date &&
            apt.status !== "cancelled" &&
            apt.status !== "completed"
        );

        const sortedByTime = todayAppointments.sort((a: any, b: any) => {
          const [aH, aM] = a.appointment_time.split(":").map(Number);
          const [bH, bM] = b.appointment_time.split(":").map(Number);
          return aH * 60 + aM - (bH * 60 + bM);
        });

        const userPosition = sortedByTime.findIndex(
          (apt: any) => apt.id === userAppt.id
        );

        // احسب وقت الانتظار المتوقع (متوسط 40 دقيقة لكل موعد)
        const estimatedWaitTime = userPosition * 40;

        setCurrentQueue({
          totalInQueue: todayAppointments.length,
          yourPosition: userPosition,
          estimatedWaitTime: Math.max(0, estimatedWaitTime),
          currentlyServing: sortedByTime[0]?.patient_name || "لا أحد",
        });

        // احصل على المواعيد القادمة
        const upcoming = sortedByTime
          .slice(userPosition + 1, userPosition + 4)
          .map((apt: any) => ({
            id: apt.id,
            booking_id: apt.booking_id,
            patient_name: apt.patient_name,
            appointment_time: apt.appointment_time,
            service_name: apt.service_name,
            queue_number: apt.queue_number,
            status: apt.status,
          }));

        setUpcomingAppointments(upcoming);
      }

      setLastUpdate(new Date());
    } catch (err) {
      console.error("خطأ في تحديث بيانات الطابور:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث البيانات عند التحميل
  useEffect(() => {
    if (bookingId) {
      updateQueueData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  // تحديث تلقائي كل 30 ثانية
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      if (bookingId) {
        updateQueueData();
      }
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, bookingId]);

  // إذا لم يتم توفير معرف الحجز
  if (!bookingId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center p-4 rtl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600 mb-6">
            يرجى تقديم معرف الحجز لتتبع طابورك
          </p>
          <Link
            href="/appointment-status"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaArrowRight /> العودة للبحث
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !currentQueue || !userAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center rtl">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <FaSpinner className="text-white text-5xl" />
          </motion.div>
          <p className="text-white text-xl mt-4">
            جاري تحميل بيانات الطابور...
          </p>
        </div>
      </div>
    );
  }

  const isYourTurn = currentQueue.yourPosition === 0;
  const waitMinutes = currentQueue.estimatedWaitTime;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">تتبع الطابور الحي</h1>
          <p className="text-blue-100 flex items-center gap-2">
            <FaClock className="text-lg" />
            آخر تحديث:{" "}
            {lastUpdate
              ? lastUpdate.toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "الآن"}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Your Queue Status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`rounded-2xl shadow-2xl overflow-hidden ${
            isYourTurn
              ? "bg-gradient-to-br from-green-100 to-green-50 border-4 border-green-500"
              : "bg-white"
          }`}
        >
          {isYourTurn && (
            <div className="bg-green-500 text-white p-4 text-center animate-pulse">
              <p className="text-lg font-bold">
                🎉 دورك الآن! توجه إلى العيادة فوراً
              </p>
            </div>
          )}

          <div className="p-8">
            {/* Queue Number Circle */}
            <div className="flex justify-center mb-8">
              <motion.div
                animate={isYourTurn ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 1,
                  repeat: isYourTurn ? Infinity : 0,
                }}
                className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl font-bold ${
                  isYourTurn
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white"
                }`}
              >
                #{currentQueue.yourPosition + 1}
              </motion.div>
            </div>

            {/* Status Text */}
            <div className="text-center mb-8">
              {isYourTurn ? (
                <>
                  <h2 className="text-3xl font-bold text-green-600 mb-2">
                    دورك الآن!
                  </h2>
                  <p className="text-gray-700 text-lg">
                    يرجى التوجه إلى العيادة فوراً
                  </p>
                  <button
                    onClick={playNotification}
                    className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FaVolumeUp /> تشغيل الإشعار الصوتي
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    الوقت المتبقي تقريباً
                  </h2>
                  <motion.p
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-5xl font-bold text-blue-600"
                  >
                    {waitMinutes} <span className="text-2xl">دقيقة</span>
                  </motion.p>
                  <p className="text-gray-600 mt-2">
                    هناك {currentQueue.yourPosition} أشخاص قبلك
                  </p>
                </>
              )}
            </div>

            {/* Queue Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">
                  عدد الأشخاص في الطابور
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {currentQueue.totalInQueue}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
                <p className="text-sm text-gray-600 mb-1">موقعك في الطابور</p>
                <p className="text-3xl font-bold text-purple-600">
                  #{currentQueue.yourPosition + 1}
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                <p className="text-sm text-gray-600 mb-1">الوقت المتوقع</p>
                <p className="text-3xl font-bold text-orange-600">
                  {Math.ceil(waitMinutes / 5) * 5}د
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Currently Being Served */}
        {currentQueue.currentlyServing && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl text-green-500">✓</div>
              <div>
                <p className="text-sm text-gray-600">يتم الآن خدمة</p>
                <p className="text-xl font-bold text-gray-800">
                  {currentQueue.currentlyServing}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Upcoming Appointments */}
        {upcomingAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              المواعيد القادمة بعدك
            </h3>
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      #{apt.queue_number}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {apt.patient_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {apt.service_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">الموعد</p>
                    <p className="font-semibold text-gray-800">
                      {apt.appointment_time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* User Appointment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4">بيانات موعدك</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaUser className="text-blue-600 text-lg" />
              <div>
                <p className="text-sm text-gray-600">المريض</p>
                <p className="font-semibold text-gray-800">
                  {userAppointment.patient_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaTooth className="text-blue-600 text-lg" />
              <div>
                <p className="text-sm text-gray-600">الخدمة</p>
                <p className="font-semibold text-gray-800">
                  {userAppointment.service_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <FaClock className="text-blue-600 text-lg" />
              <div>
                <p className="text-sm text-gray-600">وقت الموعد</p>
                <p className="font-semibold text-gray-800">
                  {userAppointment.appointment_time}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Auto Refresh Toggle */}
        <div className="bg-white rounded-lg p-4 flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-5 h-5 text-blue-600"
            />
            <span className="text-gray-700">تحديث تلقائي (كل 30 ثانية)</span>
          </label>
          <button
            onClick={() => updateQueueData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            تحديث الآن
          </button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Link
            href="/appointment-status"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <FaArrowRight /> العودة للبحث
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FaClock,
  FaCheckCircle,
  FaUser,
  FaChartLine,
  FaSync,
  FaBell,
} from "react-icons/fa";
import { useQueueTracker } from "@/lib/hooks/useQueueTracker";
import { useState, useEffect } from "react";

interface QueueTrackerProps {
  bookingId?: string;
  autoRefresh?: boolean;
}

export default function QueueTracker({
  bookingId,
  autoRefresh = true,
}: QueueTrackerProps) {
  const {
    items,
    currentUserPosition,
    currentUserWaitTime,
    totalInQueue,
    nextUserPosition,
    nextUserName,
    loading,
    error,
    lastUpdated,
    refetch,
  } = useQueueTracker(bookingId);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // تفعيل الصوت عند دخول الصفحة
    setSoundEnabled(true);
  }, []);

  // تأثير صوتي عند تغيير الموقع
  useEffect(() => {
    if (
      soundEnabled &&
      bookingId &&
      currentUserPosition &&
      currentUserPosition <= 3
    ) {
      playNotificationSound();
    }
  }, [currentUserPosition, soundEnabled, bookingId]);

  const playNotificationSound = () => {
    // إنشاء صوت تنبيه بسيط باستخدام Web Audio API
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const getQueueColor = (position: number, total: number) => {
    const percentage = (position / total) * 100;
    if (percentage <= 25) return "from-red-500 to-red-600";
    if (percentage <= 50) return "from-orange-500 to-orange-600";
    if (percentage <= 75) return "from-yellow-500 to-yellow-600";
    return "from-green-500 to-green-600";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                <FaChartLine className="text-indigo-600" />
                متتبع الطابور الفعلي
              </h1>
              <p className="text-gray-600 mt-2">
                آخر تحديث: {lastUpdated.toLocaleTimeString("ar-EG")}
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              <FaSync className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              تحديث
            </button>
          </div>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3"
          >
            <FaBell className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* User Position Card (if bookingId provided) */}
        {bookingId && currentUserPosition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-indigo-600"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaUser className="text-indigo-600" />
                موقعك في الطابور
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Position */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white"
                >
                  <p className="text-sm opacity-90">رقم الدور الحالي</p>
                  <p className="text-5xl font-bold mt-3">
                    #{currentUserPosition}
                  </p>
                  <p className="text-sm mt-4 opacity-75">
                    من {totalInQueue} دور
                  </p>
                </motion.div>

                {/* Wait Time */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`bg-gradient-to-br ${
                    currentUserWaitTime! <= 10
                      ? "from-green-500 to-green-600"
                      : currentUserWaitTime! <= 30
                      ? "from-yellow-500 to-yellow-600"
                      : "from-red-500 to-red-600"
                  } rounded-lg p-6 text-white`}
                >
                  <div className="flex items-center gap-2">
                    <FaClock className="text-lg" />
                    <p className="text-sm opacity-90">وقت الانتظار المتوقع</p>
                  </div>
                  <p className="text-5xl font-bold mt-3">
                    {currentUserWaitTime}
                  </p>
                  <p className="text-sm mt-4 opacity-75">دقيقة تقريباً</p>
                </motion.div>

                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white"
                >
                  <p className="text-sm opacity-90">الحالة</p>
                  <div className="flex items-center gap-2 mt-4">
                    <FaCheckCircle className="text-2xl" />
                    <p className="text-lg font-semibold">في الطابور</p>
                  </div>
                  <p className="text-sm mt-4 opacity-75">
                    يتم تحديث الموقع كل 5 ثوان
                  </p>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">التقدم</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {Math.round(
                      ((totalInQueue - currentUserPosition) / totalInQueue) *
                        100
                    )}
                    % متبقي
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${
                        ((totalInQueue - currentUserPosition) / totalInQueue) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`bg-gradient-to-r ${getQueueColor(
                      currentUserPosition,
                      totalInQueue
                    )} h-full rounded-full`}
                  ></motion.div>
                </div>
              </div>

              {/* Next Person Alert */}
              {currentUserPosition <= 2 && nextUserName && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
                >
                  <p className="text-sm text-yellow-800">
                    <strong>تنبيه:</strong> الشخص التالي هو {nextUserName}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Clinic Queue Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaChartLine className="w-6 h-6" />
                حالة الطابور في العيادة
              </h2>
            </div>

            {items.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-xl text-gray-600">لا يوجد طابور حالياً!</p>
                <p className="text-gray-500 mt-2">
                  العيادة جاهزة لاستقبال مواعيد جديدة
                </p>
              </div>
            ) : (
              <div className="divide-y max-h-96 overflow-y-auto">
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        item.queue_position === currentUserPosition
                          ? "bg-indigo-50 border-l-4 border-indigo-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${getQueueColor(
                              item.queue_position,
                              items.length
                            )} flex items-center justify-center text-white font-bold text-lg`}
                          >
                            #{item.queue_position}
                          </motion.div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.patient_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.service_name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.booking_id}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                              item.appointment_status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : item.appointment_status === "confirmed"
                                ? "bg-blue-100 text-blue-800"
                                : item.appointment_status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.appointment_status === "pending"
                              ? "قيد الانتظار"
                              : "مؤكد"}
                          </motion.div>
                          <p className="text-lg font-bold text-indigo-600">
                            ⏱️{" "}
                            {item.actual_wait_minutes ||
                              item.estimated_wait_minutes}{" "}
                            دقيقة
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {/* Queue Stats */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 border-t">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">إجمالي في الطابور</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {totalInQueue}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">موقع فارغة قريباً</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">1</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">متوسط الانتظار</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {items.length > 0
                      ? Math.round(
                          items.reduce(
                            (sum, item) =>
                              sum + (item.estimated_wait_minutes || 0),
                            0
                          ) / items.length
                        )
                      : 0}{" "}
                    دقيقة
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
        >
          <h3 className="font-bold text-blue-900 mb-3">💡 نصائح</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• تحديث الموقع يتم تلقائياً كل 5 ثوان</li>
            <li>• سيتم تنبيهك صوتياً عندما يقترب دورك</li>
            <li>• يمكنك الخروج من الطابور إذا تغيرت خططك</li>
            <li>• الأوقات المعروضة تقريبية وقد تتغير حسب الظروف</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

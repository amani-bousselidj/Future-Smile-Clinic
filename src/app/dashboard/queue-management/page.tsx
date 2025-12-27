"use client";

import { useState, useEffect } from "react";
import {
  FaArrowRight,
  FaChartLine,
  FaClock,
  FaUsers,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { motion } from "framer-motion";

interface QueueStat {
  service_name: string;
  avg_wait: number;
  avg_duration: number;
  min_wait: number;
  max_wait: number;
}

interface ClinicQueue {
  booking_id: string;
  patient_name: string;
  service_name: string;
  queue_position: number;
  estimated_wait_minutes: number;
  actual_wait_minutes: number | null;
  appointment_status: string;
}

export default function QueueManagementPage() {
  const [stats, setStats] = useState<QueueStat[]>([]);
  const [currentQueue, setCurrentQueue] = useState<ClinicQueue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://future-smile-clinic.onrender.com/api";

  const fetchQueueData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch queue statistics
      const statsRes = await fetch(
        `${apiBase}/queue-statistics/latest/?limit=10`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!statsRes.ok) throw new Error("فشل تحميل إحصائيات الطابور");
      const statsData = await statsRes.json();
      setStats(Array.isArray(statsData) ? statsData : statsData.results || []);

      // Fetch current queue
      const queueRes = await fetch(`${apiBase}/queue-history/current_queue/`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!queueRes.ok) throw new Error("فشل تحميل الطابور الحالي");
      const queueData = await queueRes.json();
      setCurrentQueue(
        Array.isArray(queueData) ? queueData : queueData.results || []
      );

      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueueData();
    // تحديث البيانات كل 30 ثانية
    const interval = setInterval(fetchQueueData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaArrowRight className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-4xl font-bold text-gray-800">
                  إدارة الطابور
                </h1>
                <p className="text-gray-600 mt-1">
                  تحديث آخر: {lastUpdated.toLocaleTimeString("ar-EG")}
                </p>
              </div>
            </div>
            <button
              onClick={fetchQueueData}
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
            className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-3"
          >
            <FaExclamationTriangle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Appointments */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">إجمالي المواعيد اليوم</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {currentQueue.length}
                </p>
              </div>
              <FaUsers className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </motion.div>

          {/* Average Wait Time */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">متوسط الانتظار</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.length > 0
                    ? Math.round(
                        stats.reduce((sum, s) => sum + (s.avg_wait || 0), 0) /
                          stats.length
                      )
                    : 0}{" "}
                  دقيقة
                </p>
              </div>
              <FaClock className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </motion.div>

          {/* Current Queue Position */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الطابور الحالي</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  Q#{currentQueue[0]?.queue_position || "-"}
                </p>
              </div>
              <FaChartLine className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </motion.div>

          {/* Services Count */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">الخدمات النشطة</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.length}
                </p>
              </div>
              <FaUsers className="w-12 h-12 text-purple-500 opacity-20" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Queue List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <FaUsers className="w-6 h-6" />
                  الطابور الحالي
                </h2>
              </div>

              {currentQueue.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>لا توجد مواعيد حالياً</p>
                </div>
              ) : (
                <div className="divide-y">
                  {currentQueue.map((queue, idx) => (
                    <motion.div
                      key={queue.booking_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 text-indigo-700 rounded-full w-10 h-10 flex items-center justify-center font-bold">
                              #{queue.queue_position}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">
                                {queue.patient_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {queue.service_name}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {queue.booking_id}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
                                queue.appointment_status
                              )}`}
                            >
                              {queue.appointment_status === "pending"
                                ? "قيد الانتظار"
                                : queue.appointment_status === "confirmed"
                                ? "مؤكد"
                                : queue.appointment_status === "completed"
                                ? "مكتمل"
                                : "ملغي"}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-indigo-600">
                            ⏱️{" "}
                            {queue.actual_wait_minutes ||
                              queue.estimated_wait_minutes}{" "}
                            دقيقة
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Service Statistics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <FaChartLine className="w-6 h-6" />
                  إحصائيات الخدمات
                </h2>
              </div>

              {stats.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>لا توجد إحصائيات متاحة</p>
                </div>
              ) : (
                <div className="divide-y max-h-96 overflow-y-auto">
                  {stats.map((stat, idx) => (
                    <motion.div
                      key={stat.service_name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <p className="font-semibold text-gray-800 mb-3">
                        {stat.service_name}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">متوسط الانتظار:</span>
                          <span className="font-medium text-indigo-600">
                            {stat.avg_wait} دقيقة
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">متوسط المدة:</span>
                          <span className="font-medium text-green-600">
                            {stat.avg_duration} دقيقة
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">النطاق:</span>
                          <span className="font-medium text-orange-600">
                            {stat.min_wait}-{stat.max_wait} دقيقة
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                (stat.avg_wait / (stat.max_wait || 60)) * 100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Notes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
        >
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <FaExclamationTriangle className="w-5 h-5" />
            ملاحظات حول إدارة الطابور
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• الأرقام تُحدّث تلقائياً كل 30 ثانية</li>
            <li>• يمكنك إعادة تحميل البيانات يدوياً باستخدام زر التحديث</li>
            <li>
              • متوسط الانتظار محسوب بناءً على البيانات التاريخية والطابور
              الحالي
            </li>
            <li>• يتم تحديث إحصائيات الخدمات تلقائياً في نهاية كل يوم</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

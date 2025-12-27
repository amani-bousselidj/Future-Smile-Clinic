"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaBell,
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass,
  FaSync,
  FaFilter,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import { appointmentsAPI } from "../../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Notification {
  id: number;
  appointment: number;
  notification_type: string;
  notification_type_display: string;
  status: string;
  status_display: string;
  message: string;
  recipient: string;
  scheduled_time: string;
  sent_time?: string;
  error_message?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchText, setSearchText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, filterType, filterStatus, searchText]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://future-smile-clinic.onrender.com/api/notifications/?limit=100"
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.results || []);
        setError("");
      } else {
        setError("فشل في تحميل الإشعارات");
      }
    } catch (err) {
      setError("خطأ في الاتصال بالخادم");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = notifications;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((n) => n.notification_type === filterType);
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((n) => n.status === filterStatus);
    }

    // Search in recipient
    if (searchText) {
      filtered = filtered.filter((n) =>
        n.recipient.includes(searchText) ||
        n.message.includes(searchText)
      );
    }

    setFilteredNotifications(filtered);
  };

  const sendPendingNotifications = async () => {
    setIsSending(true);
    try {
      const response = await fetch(
        "https://future-smile-clinic.onrender.com/api/notifications/send_pending/",
        { method: "POST" }
      );
      if (response.ok) {
        const data = await response.json();
        alert(`تم إرسال ${data.count} إشعار`);
        fetchNotifications();
      } else {
        alert("فشل في إرسال الإشعارات");
      }
    } catch (err) {
      alert("خطأ في الاتصال");
    } finally {
      setIsSending(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "email":
        return <FaEnvelope className="text-blue-600 text-lg" />;
      case "sms":
        return <FaPhone className="text-green-600 text-lg" />;
      case "whatsapp":
        return <FaWhatsapp className="text-green-500 text-lg" />;
      default:
        return <FaBell className="text-gray-600 text-lg" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <FaCheckCircle /> تم
          </div>
        );
      case "failed":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <FaTimesCircle /> فشل
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <FaHourglass /> معلق
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen rtl">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBell className="text-blue-600 text-3xl" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">إدارة الإشعارات</h1>
                <p className="text-gray-600">إدارة جميع إشعارات المواعيد</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendPendingNotifications}
              disabled={isSending}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <FaSync />
                  إرسال المعلقة
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">الإجمالي</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {notifications.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">مرسلة</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {notifications.filter((n) => n.status === "sent").length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">معلقة</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">
              {notifications.filter((n) => n.status === "pending").length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm">فشل</p>
            <p className="text-3xl font-bold text-red-600 mt-2">
              {notifications.filter((n) => n.status === "failed").length}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaSearch className="inline me-2" /> بحث
              </label>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="ابحث عن رقم أو رسالة..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaFilter className="inline me-2" /> النوع
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">الكل</option>
                <option value="email">بريد إلكتروني</option>
                <option value="sms">رسالة نصية</option>
                <option value="whatsapp">واتساب</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                <FaFilter className="inline me-2" /> الحالة
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">الكل</option>
                <option value="sent">مرسلة</option>
                <option value="pending">معلقة</option>
                <option value="failed">فشل</option>
              </select>
            </div>

            {/* Refresh */}
            <div className="flex items-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchNotifications}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    تحديث...
                  </>
                ) : (
                  <>
                    <FaSync />
                    تحديث
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {isLoading ? (
          <div className="text-center py-12">
            <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري التحميل...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">
                        {notification.notification_type_display}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        المستقبل: {notification.recipient}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        الموعد المجدول: {new Date(notification.scheduled_time).toLocaleString("ar-SA")}
                      </p>
                      {notification.sent_time && (
                        <p className="text-xs text-green-600 mt-1">
                          أرسل في: {new Date(notification.sent_time).toLocaleString("ar-SA")}
                        </p>
                      )}
                      {notification.error_message && (
                        <p className="text-xs text-red-600 mt-1">
                          خطأ: {notification.error_message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(notification.status)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg">
            <FaBell className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد إشعارات</p>
          </div>
        )}
      </div>
    </div>
  );
}

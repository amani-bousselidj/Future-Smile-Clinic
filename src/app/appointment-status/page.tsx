"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaHourglass,
  FaTimesCircle,
  FaSpinner,
} from "react-icons/fa";
import { appointmentsAPI } from "../../lib/api";
import Link from "next/link";

interface AppointmentDetail {
  id: number;
  booking_id: string;
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  notes?: string;
}

export default function AppointmentStatusPage() {
  const [searchType, setSearchType] = useState<"booking_id" | "phone">(
    "booking_id"
  );
  const [searchValue, setSearchValue] = useState("");
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaHourglass className="text-yellow-500" />;
      case "confirmed":
        return <FaCheckCircle className="text-blue-500" />;
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaHourglass className="text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "confirmed":
        return "مؤكد";
      case "completed":
        return "مكتمل";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "from-yellow-100 to-yellow-50 border-yellow-300";
      case "confirmed":
        return "from-blue-100 to-blue-50 border-blue-300";
      case "completed":
        return "from-green-100 to-green-50 border-green-300";
      case "cancelled":
        return "from-red-100 to-red-50 border-red-300";
      default:
        return "from-gray-100 to-gray-50 border-gray-300";
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setAppointment(null);
    setSearched(true);

    try {
      if (!searchValue.trim()) {
        setError("يرجى إدخال معرف الحجز أو رقم الهاتف");
        setIsLoading(false);
        return;
      }

      // Fetch all appointments and filter
      const data = await appointmentsAPI.getAll();
      const appointments = data.results || [];

      let foundAppointment;

      if (searchType === "booking_id") {
        foundAppointment = appointments.find(
          (apt: any) =>
            apt.booking_id && apt.booking_id.toLowerCase() === searchValue.toLowerCase()
        );
      } else {
        // For phone search, get the latest appointment for that phone
        const matchingAppointments = appointments.filter(
          (apt: any) =>
            apt.patient_phone && apt.patient_phone.includes(searchValue.replace(/\D/g, ""))
        );
        foundAppointment = matchingAppointments[0];
      }

      if (foundAppointment) {
        setAppointment(foundAppointment);
      } else {
        setError(
          searchType === "booking_id"
            ? "لم يتم العثور على موعد بهذا معرف الحجز"
            : "لم يتم العثور على موعد برقم الهاتف هذا"
        );
      }
    } catch (err: any) {
      setError("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat("ar-SA", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      return formatter.format(date);
    } catch {
      return dateString;
    }
  };

  const formatCreatedAt = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "الآن للتو";
      if (diffMins < 60) return `قبل ${diffMins} دقيقة`;
      if (diffHours < 24) return `قبل ${diffHours} ساعة`;
      if (diffDays < 7) return `قبل ${diffDays} يوم`;

      const formatter = new Intl.DateTimeFormat("ar-SA", {
        month: "short",
        day: "numeric",
      });
      return formatter.format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen rtl">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&q=80"
            alt="تتبع موعدك"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 animated-gradient opacity-90"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            تتبع موعدك
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-base sm:text-lg md:text-xl">
            ابحث عن حالة موعدك باستخدام معرف الحجز أو رقم الهاتف
          </p>
        </motion.div>
      </section>

      {/* Search Section */}
      <section className="section-container px-4 -mt-16 relative z-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Type Toggle */}
              <div>
                <label className="block text-gray-700 font-bold mb-4">
                  اختر طريقة البحث:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="searchType"
                      value="booking_id"
                      checked={searchType === "booking_id"}
                      onChange={(e) =>
                        setSearchType(e.target.value as "booking_id" | "phone")
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ms-2 text-gray-700">البحث بمعرف الحجز</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="searchType"
                      value="phone"
                      checked={searchType === "phone"}
                      onChange={(e) =>
                        setSearchType(e.target.value as "booking_id" | "phone")
                      }
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ms-2 text-gray-700">البحث برقم الهاتف</span>
                  </label>
                </div>
              </div>

              {/* Search Input */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  {searchType === "booking_id"
                    ? "أدخل معرف الحجز"
                    : "أدخل رقم الهاتف"}
                </label>
                <div className="relative">
                  <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      searchType === "booking_id"
                        ? "BK-20251226-3847"
                        : "+213 555 123 456"
                    }
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري البحث...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    بحث
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      {searched && (
        <section className="section-container px-4">
          {appointment ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`max-w-2xl mx-auto bg-gradient-to-br ${getStatusColor(appointment.status)} rounded-2xl border-2 overflow-hidden shadow-lg`}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">حالة موعدك</h2>
                  <p className="text-blue-100">معرف الحجز: {appointment.booking_id}</p>
                </div>
                <div className="text-5xl">{getStatusIcon(appointment.status)}</div>
              </div>

              {/* Status Badge */}
              <div className="px-6 py-4 bg-white bg-opacity-50">
                <p className="text-sm text-gray-600 mb-1">الحالة الحالية</p>
                <div className="flex items-center gap-2">
                  {getStatusIcon(appointment.status)}
                  <span className="text-xl font-bold text-gray-800">
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-6 space-y-4">
                {/* Patient Name */}
                <div className="flex items-start gap-4 p-4 bg-white bg-opacity-70 rounded-lg">
                  <FaUser className="text-blue-600 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">اسم المريض</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.patient_name}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4 p-4 bg-white bg-opacity-70 rounded-lg">
                  <FaPhone className="text-blue-600 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">رقم الهاتف</p>
                    <p className="text-lg font-semibold text-gray-800 font-mono">
                      {appointment.patient_phone}
                    </p>
                  </div>
                </div>

                {/* Service */}
                <div className="flex items-start gap-4 p-4 bg-white bg-opacity-70 rounded-lg">
                  <FaTooth className="text-blue-600 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <p className="text-sm text-gray-600">الخدمة</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {appointment.service_name}
                    </p>
                  </div>
                </div>

                {/* Appointment Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 bg-white bg-opacity-70 rounded-lg">
                    <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0 text-lg" />
                    <div>
                      <p className="text-sm text-gray-600">تاريخ الموعد</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatDate(appointment.appointment_date)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {appointment.appointment_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white bg-opacity-70 rounded-lg">
                    <FaClock className="text-blue-600 mt-1 flex-shrink-0 text-lg" />
                    <div>
                      <p className="text-sm text-gray-600">وقت الموعد</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {appointment.appointment_time}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {appointment.notes && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">ملاحظات</p>
                    <p className="text-gray-800">{appointment.notes}</p>
                  </div>
                )}

                {/* Booking Time */}
                <div className="p-4 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600">
                    تم حجز الموعد {formatCreatedAt(appointment.created_at)}
                  </p>
                </div>
              </div>

              {/* Timeline Status */}
              <div className="px-6 py-6 bg-white bg-opacity-50 border-t-2">
                <p className="text-sm font-bold text-gray-700 mb-4">مراحل الموعد:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${appointment.status !== "pending" ? "bg-green-500" : "bg-yellow-500"}`}></div>
                    <p className={appointment.status !== "pending" ? "text-green-700" : "text-yellow-700"}>
                      ✓ تم الحجز
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${appointment.status === "confirmed" || appointment.status === "completed" ? "bg-green-500" : appointment.status === "pending" ? "bg-gray-300" : "bg-red-500"}`}></div>
                    <p className={appointment.status === "confirmed" || appointment.status === "completed" ? "text-green-700" : appointment.status === "pending" ? "text-gray-600" : "text-red-700"}>
                      {appointment.status === "confirmed" || appointment.status === "completed" ? "✓ تم التأكيد" : appointment.status === "pending" ? "في الانتظار" : "✗ ملغى"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${appointment.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}></div>
                    <p className={appointment.status === "completed" ? "text-green-700" : "text-gray-600"}>
                      {appointment.status === "completed" ? "✓ مكتمل" : "في الانتظار"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-6 bg-white bg-opacity-70 border-t-2 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/appointment"
                  className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition text-center"
                >
                  حجز موعد جديد
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 transition text-center"
                >
                  تواصل معنا
                </Link>
              </div>
            </motion.div>
          ) : null}
        </section>
      )}

      {/* Info Section */}
      <section className="section-container px-4">
        <div className="max-w-3xl mx-auto bg-blue-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">معلومات مفيدة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">💡 كيفية البحث:</h3>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li>استخدم معرف الحجز (BK-YYYYMMDD-####)</li>
                <li>أو أدخل رقم الهاتف المسجل</li>
                <li>سيتم عرض أحدث موعد لك</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">📞 حالات الموعد:</h3>
              <ul className="text-gray-700 space-y-2 list-disc list-inside">
                <li><span className="font-semibold">قيد الانتظار:</span> لم يتم التأكيد</li>
                <li><span className="font-semibold">مؤكد:</span> تم تأكيد الموعد</li>
                <li><span className="font-semibold">مكتمل:</span> انتهى الموعد</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

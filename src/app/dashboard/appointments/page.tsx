"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheck,
  FaTimes,
  FaClock,
  FaSpinner,
  FaFilter,
  FaFilePdf,
} from "react-icons/fa";
import { appointmentsAPI, servicesAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appointmentsData, servicesData] = await Promise.all([
        appointmentsAPI.getAll(),
        servicesAPI.getAll(),
      ]);
      setAppointments(appointmentsData.results || []);
      setServices(servicesData.results || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error("فشل تحميل البيانات. الخادم قد يكون مشغول الآن");
      setAppointments([]);
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (
    appointmentId: number,
    newStatus: string
  ) => {
    try {
      await appointmentsAPI.update(appointmentId, { status: newStatus });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      toast.success("تم تحديث حالة الموعد بنجاح");
    } catch (error) {
      toast.error("فشل في تحديث الموعد");
    }
  };

  const handleDownloadPDF = async (appointmentId: number) => {
    try {
      const response = await fetch(
        `https://future-smile-clinic-production.up.railway.app/api/appointments/${appointmentId}/download_pdf/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `appointment_${appointmentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("تم تحميل التقرير بنجاح");
      }
    } catch (error) {
      toast.error("فشل في تحميل التقرير");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "مؤكد":
        return <FaCheck className="text-green-500" />;
      case "pending":
      case "قيد الانتظار":
        return <FaClock className="text-yellow-500" />;
      case "completed":
      case "مكتمل":
        return <FaCheck className="text-blue-500" />;
      case "cancelled":
      case "ملغي":
        return <FaTimes className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "مؤكد":
        return "bg-green-100 text-green-800";
      case "pending":
      case "قيد الانتظار":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "مكتمل":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
      case "ملغي":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAppointments = Array.isArray(appointments)
    ? filterStatus === "all"
      ? appointments
      : appointments.filter((apt) => apt.status === filterStatus)
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark flex items-center gap-3">
            <FaCalendarAlt />
            إدارة الحجوزات
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            عرض وإدارة جميع حجوزات المرضى
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FaFilter className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light outline-none text-sm w-full sm:w-auto"
          >
            <option value="all">جميع الحجوزات</option>
            <option value="pending">قيد الانتظار</option>
            <option value="confirmed">مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "الكل",
            count: Array.isArray(appointments) ? appointments.length : 0,
            color: "from-gray-400 to-gray-600",
          },
          {
            label: "قيد الانتظار",
            count: Array.isArray(appointments)
              ? appointments.filter((a) => a.status === "pending").length
              : 0,
            color: "from-yellow-400 to-yellow-600",
          },
          {
            label: "مؤكد",
            count: Array.isArray(appointments)
              ? appointments.filter((a) => a.status === "confirmed").length
              : 0,
            color: "from-green-400 to-green-600",
          },
          {
            label: "مكتمل",
            count: Array.isArray(appointments)
              ? appointments.filter((a) => a.status === "completed").length
              : 0,
            color: "from-blue-400 to-blue-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4"
          >
            <div
              className={`bg-gradient-to-br ${stat.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold`}
            >
              {stat.count}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Appointments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 sm:p-6"
      >
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <table className="w-full min-w-[640px]" dir="rtl">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                  المريض
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                  الخدمة
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700 hidden sm:table-cell">
                  التاريخ
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                  الحالة
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                  تحديث
                </th>
                <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-700">
                  PDF
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-sm sm:text-base text-gray-500"
                  >
                    لا توجد حجوزات
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                      {appointment.patient_name}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">
                      {services.find((s) => s.id === appointment.service)
                        ?.name || "خدمة"}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm hidden sm:table-cell">
                      <div className="flex flex-col gap-1">
                        <span>{appointment.appointment_date}</span>
                        <span className="text-gray-500">
                          {appointment.appointment_time}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 w-fit ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        <span className="hidden sm:inline">
                          {getStatusIcon(appointment.status)}
                        </span>
                        {appointment.status || "قيد الانتظار"}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <select
                        value={appointment.status || "pending"}
                        onChange={(e) =>
                          handleStatusChange(appointment.id, e.target.value)
                        }
                        className="px-2 sm:px-3 py-1 border border-gray-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-primary-light outline-none w-full sm:w-auto"
                      >
                        <option value="pending">قيد الانتظار</option>
                        <option value="confirmed">مؤكد</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                      </select>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <button
                        onClick={() => handleDownloadPDF(appointment.id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                        title="تحميل PDF"
                      >
                        <FaFilePdf className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

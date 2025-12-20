"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaCalendarCheck,
  FaTooth,
  FaChartLine,
  FaSpinner,
  FaCheck,
  FaTimes,
  FaClock,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { appointmentsAPI, patientsAPI, servicesAPI } from "../../lib/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const stats = [
  {
    title: "إجمالي المرضى",
    value: "1,234",
    change: "+12%",
    icon: <FaUsers className="text-4xl" />,
    color: "bg-gradient-to-br from-primary-light to-primary-dark",
  },
  {
    title: "الحجوزات اليوم",
    value: "23",
    change: "+5",
    icon: <FaCalendarCheck className="text-4xl" />,
    color: "bg-gradient-to-br from-green-400 to-green-600",
  },
  {
    title: "الخدمات المقدمة",
    value: "5,678",
    change: "+23%",
    icon: <FaTooth className="text-4xl" />,
    color: "bg-gradient-to-br from-primary-dark to-blue-700",
  },
  {
    title: "الإيرادات الشهرية",
    value: "450,000 دج",
    change: "+18%",
    icon: <FaChartLine className="text-4xl" />,
    color: "bg-gradient-to-br from-yellow-400 to-orange-500",
  },
];

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalServices: 0,
    monthlyRevenue: "0 دج",
  });

  const lineChartRef = useRef<ChartJS<"line"> | null>(null);
  const barChartRef = useRef<ChartJS<"bar"> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentsData, patientsData, servicesData] =
          await Promise.all([
            appointmentsAPI.getAll().catch(() => ({ results: [] })),
            patientsAPI.getAll().catch(() => ({ results: [] })),
            servicesAPI.getAll().catch(() => ({ results: [] })),
          ]);

        // Extract results from paginated response
        const appointments = appointmentsData.results || [];
        const patients = patientsData.results || [];
        const services = servicesData.results || [];

        setAppointments(appointments);
        setPatients(patients);
        setServices(services);

        // Calculate stats
        const today = new Date().toISOString().split("T")[0];
        const todayAppts = appointments.filter(
          (a: any) => a.appointment_date === today
        ).length;

        setStats({
          totalPatients: patients.length,
          todayAppointments: todayAppts,
          totalServices: services.length,
          monthlyRevenue: "450,000 دج", // Placeholder
        });
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Cleanup function to destroy charts on unmount
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

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
    } catch (error) {
      // Silent error handling
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "إجمالي المرضى",
      value: stats.totalPatients.toString(),
      icon: <FaUsers className="text-4xl" />,
      color: "bg-gradient-to-br from-primary-light to-primary-dark",
    },
    {
      title: "الحجوزات اليوم",
      value: stats.todayAppointments.toString(),
      icon: <FaCalendarCheck className="text-4xl" />,
      color: "bg-gradient-to-br from-green-400 to-green-600",
    },
    {
      title: "الخدمات المتاحة",
      value: stats.totalServices.toString(),
      icon: <FaTooth className="text-4xl" />,
      color: "bg-gradient-to-br from-primary-dark to-blue-700",
    },
    {
      title: "الإيرادات الشهرية",
      value: stats.monthlyRevenue,
      icon: <FaChartLine className="text-4xl" />,
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
    },
  ];

  const weeklyData = {
    labels: [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
    ],
    datasets: [
      {
        label: "الحجوزات",
        data: [12, 19, 15, 25, 22, 18, 0],
        borderColor: "#29abe2",
        backgroundColor: "rgba(41, 171, 226, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const servicesData = {
    labels:
      Array.isArray(services) && services.length > 0
        ? services.slice(0, 5).map((s) => s.name || "خدمة")
        : ["خدمة 1", "خدمة 2", "خدمة 3", "خدمة 4", "خدمة 5"],
    datasets: [
      {
        label: "عدد الحجوزات",
        data: [45, 32, 28, 56, 67],
        backgroundColor: [
          "#29abe2",
          "#0053b6",
          "#1e88e5",
          "#42a5f5",
          "#64b5f6",
        ],
      },
    ],
  };
  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="card p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`${stat.color} text-white p-3 sm:p-4 rounded-lg`}>
                <div className="text-2xl sm:text-3xl md:text-4xl">
                  {stat.icon}
                </div>
              </div>
            </div>
            <h3 className="text-gray-600 text-xs sm:text-sm mb-1">
              {stat.title}
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-dark">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Weekly Appointments Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark mb-3 sm:mb-4">
            الحجوزات الأسبوعية
          </h2>
          <div className="w-full overflow-x-auto">
            <Line
              ref={lineChartRef}
              data={weeklyData}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        </motion.div>

        {/* Services Distribution Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark mb-3 sm:mb-4">
            توزيع الخدمات
          </h2>
          <div className="w-full overflow-x-auto">
            <Bar
              ref={barChartRef}
              data={servicesData}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        </motion.div>
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="card p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark mb-3 sm:mb-4">
          الحجوزات الأخيرة
        </h2>
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
              </tr>
            </thead>
            <tbody>
              {!Array.isArray(appointments) || appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-sm sm:text-base text-gray-500"
                  >
                    لا توجد حجوزات حالياً
                  </td>
                </tr>
              ) : (
                appointments.slice(0, 10).map((appointment) => (
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-r from-primary-light to-primary-dark text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FaCalendarCheck className="text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            حجز جديد
          </h3>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <FaUsers className="text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            إضافة مريض
          </h3>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all sm:col-span-2 md:col-span-1"
        >
          <FaTooth className="text-3xl sm:text-4xl mb-2 sm:mb-3 mx-auto" />
          <h3 className="text-base sm:text-lg md:text-xl font-bold">
            إضافة خدمة
          </h3>
        </motion.button>
      </div>
    </div>
  );
}

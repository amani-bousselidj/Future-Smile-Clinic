"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaSpinner,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { appointmentsAPI, servicesAPI, patientsAPI } from "../../../lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { Chart as ChartType } from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const lineChartRef = useRef<ChartType<"line"> | null>(null);
  const barChartRef = useRef<ChartType<"bar"> | null>(null);
  const doughnutChartRef = useRef<ChartType<"doughnut"> | null>(null);

  useEffect(() => {
    fetchAnalytics();

    // Cleanup function to destroy charts on unmount
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [appointmentsData, servicesData, patientsData] = await Promise.all([
        appointmentsAPI.getAll(),
        servicesAPI.getAll(),
        patientsAPI.getAll(),
      ]);
      setAppointments(appointmentsData.results || []);
      setServices(servicesData.results || []);
      setPatients(patientsData.results || []);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  // Calculate monthly revenue from completed appointments
  const getMonthlyRevenue = () => {
    const months = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const monthlyData = new Array(12).fill(0);

    appointments
      .filter((apt) => apt.status === "completed")
      .forEach((apt) => {
        const month = new Date(apt.appointment_date).getMonth();
        const service = services.find((s) => s.id === apt.service);
        if (service) {
          // Use average of price range
          const avgPrice =
            (parseFloat(service.price_min) + parseFloat(service.price_max)) / 2;
          monthlyData[month] += avgPrice;
        }
      });

    return monthlyData;
  };

  const monthlyRevenueData = {
    labels: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ],
    datasets: [
      {
        label: "الإيرادات (دج)",
        data: getMonthlyRevenue(),
        borderColor: "#29abe2",
        backgroundColor: "rgba(41, 171, 226, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Calculate service bookings
  const getServiceBookings = () => {
    const serviceCount: { [key: number]: number } = {};
    appointments.forEach((apt) => {
      serviceCount[apt.service] = (serviceCount[apt.service] || 0) + 1;
    });

    const labels: string[] = [];
    const data: number[] = [];

    Object.entries(serviceCount).forEach(([serviceId, count]) => {
      const service = services.find((s) => s.id === parseInt(serviceId));
      if (service) {
        labels.push(service.name);
        data.push(count);
      }
    });

    return { labels, data };
  };

  const serviceBookings = getServiceBookings();
  const servicesComparisonData = {
    labels: serviceBookings.labels,
    datasets: [
      {
        label: "عدد الحجوزات",
        data: serviceBookings.data,
        backgroundColor: [
          "#29abe2",
          "#0053b6",
          "#1e88e5",
          "#42a5f5",
          "#64b5f6",
          "#90caf9",
        ],
      },
    ],
  };

  // Calculate appointment status distribution
  const getAppointmentDistribution = () => {
    const statusCount = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    appointments.forEach((apt) => {
      if (statusCount.hasOwnProperty(apt.status)) {
        statusCount[apt.status as keyof typeof statusCount]++;
      }
    });

    return statusCount;
  };

  const distribution = getAppointmentDistribution();
  const patientDistributionData = {
    labels: ["قيد الانتظار", "مؤكد", "مكتمل", "ملغي"],
    datasets: [
      {
        data: [
          distribution.pending,
          distribution.confirmed,
          distribution.completed,
          distribution.cancelled,
        ],
        backgroundColor: ["#fbbf24", "#29abe2", "#10b981", "#ef4444"],
      },
    ],
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark flex items-center gap-3">
          <FaChartLine />
          التحليلات والإحصائيات
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          عرض تفصيلي لأداء العيادة والإحصائيات
        </p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            title: "إجمالي الإيرادات",
            value: `${getMonthlyRevenue()
              .reduce((a, b) => a + b, 0)
              .toLocaleString()} دج`,
            icon: FaMoneyBillWave,
            color: "from-green-400 to-green-600",
          },
          {
            title: "متوسط الإيرادات الشهرية",
            value: `${Math.round(
              getMonthlyRevenue().reduce((a, b) => a + b, 0) / 12
            ).toLocaleString()} دج`,
            icon: FaChartLine,
            color: "from-primary-light to-primary-dark",
          },
          {
            title: "عدد المرضى الكلي",
            value: patients.length.toString(),
            icon: FaUsers,
            color: "from-blue-400 to-blue-600",
          },
          {
            title: "إجمالي الحجوزات",
            value: appointments.length.toString(),
            icon: FaCalendarAlt,
            color: "from-purple-400 to-purple-600",
          },
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 sm:p-6"
          >
            <div
              className={`bg-gradient-to-br ${metric.color} text-white p-3 rounded-lg w-fit mb-3`}
            >
              <metric.icon className="text-2xl sm:text-3xl" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-1">
              {metric.title}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-primary-dark">
              {metric.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4 sm:p-6"
      >
        <h2 className="text-lg sm:text-xl font-bold text-primary-dark mb-4">
          الإيرادات الشهرية (2025)
        </h2>
        <div className="w-full overflow-x-auto">
          <Line
            ref={lineChartRef}
            data={monthlyRevenueData}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Services Comparison */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-primary-dark mb-4">
            مقارنة الخدمات
          </h2>
          <div className="w-full overflow-x-auto">
            <Bar
              ref={barChartRef}
              data={servicesComparisonData}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        </motion.div>

        {/* Patient Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-lg sm:text-xl font-bold text-primary-dark mb-4">
            توزيع المرضى
          </h2>
          <div className="w-full max-w-sm mx-auto">
            <Doughnut
              ref={doughnutChartRef}
              data={patientDistributionData}
              options={{ responsive: true, maintainAspectRatio: true }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

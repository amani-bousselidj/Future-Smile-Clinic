"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaSpinner,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
} from "react-icons/fa";
import { appointmentsAPI, servicesAPI, patientsAPI } from "../../../lib/api";

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    totalPatients: 0,
    totalServices: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [appointmentsData, servicesData, patientsData] = await Promise.all([
        appointmentsAPI.getAll(),
        servicesAPI.getAll(),
        patientsAPI.getAll(),
      ]);

      const appointments = appointmentsData.results || [];
      const services = servicesData.results || [];
      const patients = patientsData.results || [];

      const completedAppointments = appointments.filter(
        (apt) => apt.status === "completed"
      );

      let totalRevenue = 0;
      completedAppointments.forEach((apt) => {
        const service = services.find((s) => s.id === apt.service);
        if (service) {
          const price = parseFloat(service.price_max || service.price_min || 0);
          totalRevenue += price;
        }
      });

      setStats({
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        totalPatients: patients.length,
        totalServices: services.length,
        totalRevenue: Math.round(totalRevenue),
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
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

  const StatCard = ({
    icon: Icon,
    label,
    value,
    color,
  }: {
    icon: any;
    label: string;
    value: number | string;
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow-md border-r-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <Icon className="text-4xl text-primary-light" />
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">التحليلات</h1>
        <p className="text-gray-600 mt-2">إحصائيات العيادة والأداء</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={FaCalendarAlt}
          label="إجمالي الحجوزات"
          value={stats.totalAppointments}
          color="border-blue-500"
        />
        <StatCard
          icon={FaChartLine}
          label="الحجوزات المكتملة"
          value={stats.completedAppointments}
          color="border-green-500"
        />
        <StatCard
          icon={FaUsers}
          label="إجمالي المرضى"
          value={stats.totalPatients}
          color="border-purple-500"
        />
        <StatCard
          icon={FaChartLine}
          label="الخدمات"
          value={stats.totalServices}
          color="border-yellow-500"
        />
        <StatCard
          icon={FaMoneyBillWave}
          label="الإيرادات (دج)"
          value={stats.totalRevenue.toLocaleString("ar-DZ")}
          color="border-red-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">ملخص الأداء</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">معدل إتمام الحجوزات</span>
            <span className="text-xl font-bold text-primary-light">
              {stats.totalAppointments > 0
                ? Math.round(
                    (stats.completedAppointments / stats.totalAppointments) *
                      100
                  )
                : 0}
              %
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-light h-2 rounded-full transition-all"
              style={{
                width: `${
                  stats.totalAppointments > 0
                    ? (stats.completedAppointments / stats.totalAppointments) *
                      100
                    : 0
                }%`,
              }}
            ></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

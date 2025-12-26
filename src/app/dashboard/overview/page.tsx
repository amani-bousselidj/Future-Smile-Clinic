"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "../../../contexts/AuthContext";
import { apiRequest } from "../../../lib/api";

interface Stats {
  totalAppointments: number;
  totalPatients: number;
  totalServices: number;
  totalRevenue: number;
  appointmentsTrend: Array<{ date: string; count: number }>;
  appointmentsByStatus: Array<{ status: string; count: number }>;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // جلب البيانات من API
        const [appointmentsRes, patientsRes, servicesRes] = await Promise.all([
          apiRequest("/appointments/", { method: "GET" }),
          apiRequest("/patients/", { method: "GET" }),
          apiRequest("/services/", { method: "GET" }),
        ]);

        const appointments = (appointmentsRes as any)?.results || [];
        const patients = (patientsRes as any)?.results || [];
        const services = (servicesRes as any)?.results || [];

        // حساب الإيرادات من المواعيد المكتملة فقط
        const completedAppointments = appointments.filter(
          (apt: any) => apt.status === "completed"
        );

        const totalRevenue = completedAppointments.reduce(
          (sum: number, apt: any) => {
            const service = services.find((s: any) => s.id === apt.service);
            const price = service
              ? parseFloat(service.price_max || service.price_min || 0)
              : 0;
            return sum + price;
          },
          0
        );

        // عد حالات المواعيد
        const statusCounts = appointments.reduce((acc: any, apt: any) => {
          const status = apt.status || "pending";
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        // بيانات الاتجاه (آخر 7 أيام) - محسوبة من البيانات الفعلية
        const dayNames = [
          "الأحد",
          "الاثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];
        const today = new Date();
        const appointmentsTrend = [];

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dayIndex = date.getDay();

          // حساب عدد المواعيد في هذا اليوم من البيانات الفعلية
          const dayAppointments = appointments.filter((apt: any) => {
            if (!apt.appointment_date) return false;
            const aptDate = new Date(apt.appointment_date);
            return aptDate.toDateString() === date.toDateString();
          });

          appointmentsTrend.push({
            date: dayNames[dayIndex],
            count: dayAppointments.length,
          });
        }

        setStats({
          totalAppointments: appointments.length,
          totalPatients: patients.length,
          totalServices: services.length,
          totalRevenue,
          appointmentsTrend,
          appointmentsByStatus: Object.entries(statusCounts).map(
            ([status, count]) => ({
              status,
              count: count as number,
            })
          ),
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإحصائيات...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">فشل تحميل البيانات</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* رأس الصفحة */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>
        <p className="text-gray-600 mt-2">
          مرحباً {user?.username}، إليك ملخص عملك
        </p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المواعيد</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalAppointments}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي المرضى</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalPatients}
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM15 20h.01"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">إجمالي الخدمات</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalServices}
              </p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">الإيرادات المتوقعة</p>
              <p className="text-3xl font-bold text-gray-900">
                ${stats.totalRevenue}
              </p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* الرسوم البيانية */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* رسم بياني للاتجاه */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            اتجاه المواعيد
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.appointmentsTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="عدد المواعيد"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* رسم بياني للحالات */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            توزيع حالات المواعيد
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.appointmentsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {stats.appointmentsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* النشاط الأخير */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          آخر المواعيد
        </h2>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">يتم تحديثها قريباً...</p>
        </div>
      </div>
    </div>
  );
}

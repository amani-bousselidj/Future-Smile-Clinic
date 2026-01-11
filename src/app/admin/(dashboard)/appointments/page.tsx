"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type Appointment = {
  id: number;
  booking_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service_name: string;
  doctor_name: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  message?: string | null;
  created_at: string;
};

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: string }> = {
  pending: { label: "معلق", bg: "bg-yellow-100", text: "text-yellow-800", icon: "⏳" },
  confirmed: { label: "مؤكد", bg: "bg-blue-100", text: "text-blue-800", icon: "✓" },
  completed: { label: "مكتمل", bg: "bg-green-100", text: "text-green-800", icon: "✔️" },
  cancelled: { label: "ملغي", bg: "bg-red-100", text: "text-red-800", icon: "✕" },
};

export default function AdminAppointmentsPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fail = async (res: Response, fallback: string) => {
    if (res.status === 401) {
      addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
      window.location.href = "/admin/login";
      return;
    }
    const d = await res.json().catch(() => ({}));
    throw new Error(d?.detail || fallback);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/proxy/api/appointments/?page_size=200", { cache: "no-store" });
      if (!res.ok) await fail(res, "فشل تحميل المواعيد");
      const d = await res.json();
      setItems(d?.results || []);
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل التحميل" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (a: Appointment, newStatus: string) => {
    const res = await fetch(`/api/admin/proxy/api/appointments/${a.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const err = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: err?.detail || "فشل تحديث الموعد" });
      return;
    }
    addNotification({ type: "success", message: "تم تحديث الموعد" });
    await load();
  };

  const filteredItems = filterStatus === "all" ? items : items.filter((i) => i.status === filterStatus);

  const stats = {
    total: items.length,
    pending: items.filter((a) => a.status === "pending").length,
    confirmed: items.filter((a) => a.status === "confirmed").length,
    completed: items.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📅</span>
            <span>إدارة المواعيد</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">عرض وإدارة جميع حجوزات المرضى</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
        >
          <span>🔄</span>
          <span>{loading ? "جاري التحميل..." : "تحديث"}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي المواعيد</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-800 mb-1">معلق</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="text-4xl">⏳</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-500/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 mb-1">مؤكد</p>
              <p className="text-3xl font-bold text-blue-700">{stats.confirmed}</p>
            </div>
            <div className="text-4xl">✓</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 mb-1">مكتمل</p>
              <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
            </div>
            <div className="text-4xl">✔️</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-sm font-semibold text-gray-700">عرض:</span>
        {["all", "pending", "confirmed", "completed", "cancelled"].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
              filterStatus === st
                ? "bg-blue-600 border-blue-500 text-white shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {st === "all" ? "الكل" : statusConfig[st]?.label || st}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">قائمة المواعيد</span>
            <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-bold">{filteredItems.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-500 mt-4">جاري تحميل المواعيد...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">لا توجد مواعيد</p>
            <p className="text-sm text-gray-500">
              {filterStatus === "all" ? "لم يتم حجز أي مواعيد بعد" : `لا توجد مواعيد بحالة "${statusConfig[filterStatus]?.label || filterStatus}"`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((a) => {
              const cfg = statusConfig[a.status] || statusConfig.pending;
              return (
                <div key={a.id} className="p-5 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{a.first_name} {a.last_name}</h3>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span>{cfg.icon}</span>
                          <span>{cfg.label}</span>
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 font-medium mb-2">رقم الحجز: #{a.booking_id}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <span>🗓️</span>
                          <span>{a.date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{a.time}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>🦷</span>
                          <span>{a.service_name}</span>
                        </span>
                        {a.doctor_name && (
                          <span className="flex items-center gap-1">
                            <span>👨‍⚕️</span>
                            <span>د. {a.doctor_name}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <span>📧</span>
                          <span>{a.email}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <span>📱</span>
                          <span>{a.phone}</span>
                        </span>
                      </div>
                      {a.message && (
                        <p className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          💬 {a.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      {a.status === "pending" && (
                        <>
                          <button
                            onClick={() => setStatus(a, "confirmed")}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-blue-500/30 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 transition"
                          >
                            ✓ تأكيد
                          </button>
                          <button
                            onClick={() => setStatus(a, "cancelled")}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                          >
                            ✕ إلغاء
                          </button>
                        </>
                      )}
                      {a.status === "confirmed" && (
                        <>
                          <button
                            onClick={() => setStatus(a, "completed")}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition"
                          >
                            ✔️ إكمال
                          </button>
                          <button
                            onClick={() => setStatus(a, "cancelled")}
                            className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                          >
                            ✕ إلغاء
                          </button>
                        </>
                      )}
                      {a.status === "completed" && (
                        <span className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-green-300 bg-green-100 text-green-800 text-center">
                          ✔️ مكتمل
                        </span>
                      )}
                      {a.status === "cancelled" && (
                        <button
                          onClick={() => setStatus(a, "pending")}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                          ↶ استرجاع
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

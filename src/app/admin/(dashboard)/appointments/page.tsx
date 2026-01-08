"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type Appointment = {
  id: number;
  booking_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  patient_detail?: { full_name: string; phone: string };
  service_detail?: { name: string };
};

export default function AdminAppointmentsPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/proxy/api/appointments/?page_size=100", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل تحميل المواعيد");
      const data = await res.json();
      setItems(data?.results || []);
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل تحميل المواعيد" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/admin/proxy/api/appointments/${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      addNotification({ type: "error", message: "فشل تحديث الحالة" });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">المواعيد</h2>
          <p className="text-sm text-gray-600">إدارة طلبات الحجز</p>
        </div>
        <button onClick={load} className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">تحديث</button>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">جاري التحميل...</div>
        ) : (
          <div className="divide-y">
            {items.map((a) => (
              <div key={a.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-gray-900">{a.booking_id}</div>
                  <div className="text-sm text-gray-600">
                    {a.patient_detail?.full_name || "—"} • {a.patient_detail?.phone || "—"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {a.service_detail?.name || "—"} • {a.appointment_date} • {a.appointment_time}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["pending", "confirmed", "in_progress", "completed", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(a.id, s)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border ${a.status === s ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

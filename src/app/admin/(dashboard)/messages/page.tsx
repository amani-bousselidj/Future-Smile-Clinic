"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type Message = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function AdminMessagesPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/proxy/api/contact/?page_size=100", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل تحميل الرسائل");
      const data = await res.json();
      setItems(data?.results || []);
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل تحميل الرسائل" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markRead = async (id: number) => {
    const res = await fetch(`/api/admin/proxy/api/contact/${id}/mark_read/`, { method: "POST" });
    if (!res.ok) {
      addNotification({ type: "error", message: "فشل تحديث الرسالة" });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">الرسائل</h2>
          <p className="text-sm text-gray-600">رسائل نموذج التواصل</p>
        </div>
        <button onClick={load} className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">تحديث</button>
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-4 text-sm text-gray-600">جاري التحميل...</div>
        ) : (
          <div className="divide-y">
            {items.map((m) => (
              <div key={m.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold text-gray-900">{m.subject || "(بدون عنوان)"}</div>
                    <div className="text-sm text-gray-600">{m.name} • {m.email} • {m.phone}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => markRead(m.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border ${m.is_read ? "bg-green-50 border-green-200 text-green-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                  >
                    {m.is_read ? "مقروءة" : "تحديد كمقروءة"}
                  </button>
                </div>
                <p className="text-sm text-gray-700 mt-3 whitespace-pre-wrap">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

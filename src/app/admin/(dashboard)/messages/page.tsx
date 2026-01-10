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
  const [filterRead, setFilterRead] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

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
      const res = await fetch("/api/admin/proxy/api/contact-messages/?page_size=200", { cache: "no-store" });
      if (!res.ok) await fail(res, "فشل تحميل الرسائل");
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

  const markRead = async (m: Message, read: boolean) => {
    const res = await fetch(`/api/admin/proxy/api/contact-messages/${m.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: read }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const err = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: err?.detail || "فشل تحديث الرسالة" });
      return;
    }
    await load();
  };

  const deleteMsg = async (m: Message) => {
    const ok = window.confirm(`حذف رسالة من: ${m.name} ؟`);
    if (!ok) return;
    const res = await fetch(`/api/admin/proxy/api/contact-messages/${m.id}/`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const err = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: err?.detail || "فشل حذف الرسالة" });
      return;
    }
    addNotification({ type: "success", message: "تم حذف الرسالة" });
    await load();
  };

  const filteredItems =
    filterRead === "all" ? items : filterRead === "unread" ? items.filter((i) => !i.is_read) : items.filter((i) => i.is_read);

  const stats = {
    total: items.length,
    unread: items.filter((m) => !m.is_read).length,
    read: items.filter((m) => m.is_read).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>💬</span>
            <span>إدارة الرسائل</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">عرض وإدارة رسائل التواصل من الزوار</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
        >
          <span>🔄</span>
          <span>{loading ? "جاري التحميل..." : "تحديث"}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الرسائل</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="text-4xl">📨</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 mb-1">غير مقروءة</p>
              <p className="text-3xl font-bold text-blue-900">{stats.unread}</p>
            </div>
            <div className="text-4xl">📬</div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 mb-1">مقروءة</p>
              <p className="text-3xl font-bold text-green-900">{stats.read}</p>
            </div>
            <div className="text-4xl">📭</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <span className="text-sm font-semibold text-gray-700">عرض:</span>
        {["all", "unread", "read"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterRead(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
              filterRead === f
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f === "all" ? "الكل" : f === "unread" ? "غير مقروءة" : "مقروءة"}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">قائمة الرسائل</span>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{filteredItems.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            <p className="text-sm text-gray-500 mt-4">جاري تحميل الرسائل...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">لا توجد رسائل</p>
            <p className="text-sm text-gray-500">
              {filterRead === "all"
                ? "لم يتم استلام أي رسائل بعد"
                : filterRead === "unread"
                ? "لا توجد رسائل غير مقروءة"
                : "لا توجد رسائل مقروءة"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((m) => (
              <div key={m.id} className={`p-5 transition ${m.is_read ? "bg-white hover:bg-gray-50" : "bg-blue-50 hover:bg-blue-100"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{m.name}</h3>
                      {!m.is_read && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200">
                          <span>🆕</span>
                          <span>جديدة</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-600 font-semibold mb-2">الموضوع: {m.subject}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <span>📧</span>
                        <span>{m.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📱</span>
                        <span>{m.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📅</span>
                        <span>{new Date(m.created_at).toLocaleDateString("ar-EG")}</span>
                      </span>
                    </div>
                    {expandedId === m.id ? (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{m.message}</p>
                        <button
                          onClick={() => setExpandedId(null)}
                          className="mt-3 text-xs text-indigo-600 font-semibold hover:underline"
                        >
                          ▲ إخفاء الرسالة
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setExpandedId(m.id)}
                        className="mt-2 text-xs text-indigo-600 font-semibold hover:underline"
                      >
                        ▼ عرض الرسالة الكاملة
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    {!m.is_read ? (
                      <button
                        onClick={() => markRead(m, true)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition"
                      >
                        ✓ تعليم كمقروءة
                      </button>
                    ) : (
                      <button
                        onClick={() => markRead(m, false)}
                        className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      >
                        ✉️ تعليم كغير مقروءة
                      </button>
                    )}
                    <button
                      onClick={() => deleteMsg(m)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

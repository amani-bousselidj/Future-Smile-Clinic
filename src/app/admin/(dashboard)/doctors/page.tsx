"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type Doctor = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  specialization: string;
  license_number: string;
  biography?: string | null;
  photo_url?: string | null;
  is_active: boolean;
  services: number[];
};

type Service = { id: number; name: string };

export default function AdminDoctorsPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    specialization: "",
    license_number: "",
    biography: "",
    photo_url: "",
    is_active: true,
    services: [] as number[],
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialization: "",
      license_number: "",
      biography: "",
      photo_url: "",
      is_active: true,
      services: [],
    });
    setShowForm(false);
  };

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
      const [drRes, svcRes] = await Promise.all([
        fetch("/api/admin/proxy/api/doctors/?page_size=100", { cache: "no-store" }),
        fetch("/api/admin/proxy/api/services/?page_size=200", { cache: "no-store" }),
      ]);
      if (!drRes.ok) await fail(drRes, "فشل تحميل الأطباء");
      if (!svcRes.ok) await fail(svcRes, "فشل تحميل الخدمات");
      const dr = await drRes.json();
      const sv = await svcRes.json();
      setItems(dr?.results || []);
      setServices((sv?.results || []).map((x: any) => ({ id: x.id, name: x.name })));
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

  const upsert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        biography: form.biography || null,
        photo_url: form.photo_url || null,
      };
      const url = editingId ? `/api/admin/proxy/api/doctors/${editingId}/` : "/api/admin/proxy/api/doctors/";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) await fail(res, editingId ? "فشل تحديث الطبيب" : "فشل إنشاء الطبيب");
      addNotification({ type: "success", message: editingId ? "تم تحديث الطبيب" : "تم إنشاء الطبيب" });
      resetForm();
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : editingId ? "فشل تحديث الطبيب" : "فشل إنشاء الطبيب" });
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (d: Doctor) => {
    setEditingId(d.id);
    setForm({
      first_name: d.first_name || "",
      last_name: d.last_name || "",
      email: d.email || "",
      phone: d.phone || "",
      specialization: d.specialization || "",
      license_number: d.license_number || "",
      biography: d.biography || "",
      photo_url: d.photo_url || "",
      is_active: Boolean(d.is_active),
      services: Array.isArray(d.services) ? d.services : [],
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (d: Doctor) => {
    const ok = window.confirm(`حذف الطبيب: ${d.first_name} ${d.last_name} ؟`);
    if (!ok) return;
    const res = await fetch(`/api/admin/proxy/api/doctors/${d.id}/`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const err = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: err?.detail || "فشل حذف الطبيب" });
      return;
    }
    addNotification({ type: "success", message: "تم حذف الطبيب" });
    await load();
  };

  const toggleActive = async (d: Doctor) => {
    const res = await fetch(`/api/admin/proxy/api/doctors/${d.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !d.is_active }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const err = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: err?.detail || "فشل تحديث الطبيب" });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>👨‍⚕️</span>
            <span>إدارة الأطباء</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">إضافة وتعديل وحذف الأطباء والموظفين</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <span>{showForm ? "إخفاء النموذج" : "+ إضافة طبيب"}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-500/20 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "تعديل الطبيب" : "طبيب جديد"}
          </h3>
          <form onSubmit={upsert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الاسم *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.first_name}
                  onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
                  required
                  placeholder="محمد"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اللقب *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.last_name}
                  onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
                  required
                  placeholder="أحمد"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  placeholder="doctor@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">الهاتف *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التخصص *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.specialization}
                  onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))}
                  required
                  placeholder="مثال: جراحة الفم والأسنان"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">رقم الترخيص *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                  value={form.license_number}
                  onChange={(e) => setForm((p) => ({ ...p, license_number: e.target.value }))}
                  required
                  placeholder="ABC123456"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">نبذة (اختياري)</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
                rows={3}
                value={form.biography}
                onChange={(e) => setForm((p) => ({ ...p, biography: e.target.value }))}
                placeholder="خبرة وتخصصات الطبيب..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">صورة (URL) (اختياري)</label>
              <input
                type="url"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                value={form.photo_url}
                onChange={(e) => setForm((p) => ({ ...p, photo_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">الخدمات التي يقدمها</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-blue-500/50 cursor-pointer transition">
                    <input
                      type="checkbox"
                      checked={form.services.includes(s.id)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm((p) => ({
                          ...p,
                          services: checked ? [...p.services, s.id] : p.services.filter((x) => x !== s.id),
                        }));
                      }}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
                    />
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/50"
              />
              <span>طبيب مفعّل</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold disabled:opacity-60 hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                {saving ? "جاري الحفظ..." : editingId ? "💾 حفظ التعديلات" : "➕ إضافة الطبيب"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl bg-white border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                >
                  إلغاء التعديل
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Doctors List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">قائمة الأطباء</span>
            <span className="px-3 py-1 rounded-full bg-blue-600/10 text-blue-700 text-xs font-bold">{items.length}</span>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <span>🔄</span>
            <span>{loading ? "جاري التحميل..." : "تحديث"}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-500 mt-4">جاري تحميل الأطباء...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <p className="text-lg font-semibold text-gray-900 mb-2">لا يوجد أطباء بعد</p>
            <p className="text-sm text-gray-500 mb-6">ابدأ بإضافة أول طبيب</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-600-dark transition"
            >
              + إضافة طبيب
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((d) => (
              <div key={d.id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">د. {d.first_name} {d.last_name}</h3>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${d.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        <span>{d.is_active ? "✓" : "×"}</span>
                        <span>{d.is_active ? "مفعّل" : "معطّل"}</span>
                      </span>
                    </div>
                    <p className="text-sm text-blue-700 font-medium mb-2">{d.specialization}</p>
                    {d.biography && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{d.biography}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>📧</span>
                        <span>{d.email}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>📱</span>
                        <span>{d.phone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🆔</span>
                        <span>{d.license_number}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(d)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border-2 transition ${
                        d.is_active
                          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {d.is_active ? "✓ تعطيل" : "✓ تفعيل"}
                    </button>
                    <button
                      onClick={() => onEdit(d)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border-2 border-blue-500/30 bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 transition"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => onDelete(d)}
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

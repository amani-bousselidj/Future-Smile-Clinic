"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type Service = {
  id: number;
  name: string;
  description: string;
  category: string;
  price_min: string | number;
  price_max: string | number | null;
  duration_minutes: number;
  image_url?: string | null;
  is_active: boolean;
};

export default function AdminServicesPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "cleaning",
    price_min: "0",
    price_max: "",
    duration_minutes: "30",
    image_url: "",
    is_active: true,
  });

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
      const res = await fetch("/api/admin/proxy/api/services/?page_size=100", { cache: "no-store" });
      if (!res.ok) await fail(res, "فشل تحميل الخدمات");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.results || [];
      setItems(list);
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل تحميل الخدمات" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        price_min: Number(form.price_min || 0),
        price_max: form.price_max ? Number(form.price_max) : null,
        duration_minutes: Number(form.duration_minutes || 30),
        image_url: form.image_url || null,
      };
      const res = await fetch("/api/admin/proxy/api/services/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) await fail(res, "فشل إنشاء الخدمة");
      addNotification({ type: "success", message: "تم إنشاء الخدمة" });
      setForm({
        name: "",
        description: "",
        category: "cleaning",
        price_min: "0",
        price_max: "",
        duration_minutes: "30",
        image_url: "",
        is_active: true,
      });
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل إنشاء الخدمة" });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (svc: Service) => {
    const res = await fetch(`/api/admin/proxy/api/services/${svc.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !svc.is_active }),
    });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const d = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: d?.detail || "فشل تحديث الخدمة" });
      return;
    }
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">الخدمات</h2>
        <p className="text-sm text-gray-600">إضافة/تفعيل/تعطيل الخدمات</p>
      </div>

      <form onSubmit={create} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              <option value="cleaning">Cleaning</option>
              <option value="whitening">Whitening</option>
              <option value="orthodontics">Orthodontics</option>
              <option value="implants">Implants</option>
              <option value="cosmetic">Cosmetic</option>
              <option value="restorative">Restorative</option>
              <option value="preventive">Preventive</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
          <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200" rows={3} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">السعر (من)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.price_min} onChange={(e) => setForm((p) => ({ ...p, price_min: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">السعر (إلى)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.price_max} onChange={(e) => setForm((p) => ({ ...p, price_max: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">المدة (دقيقة)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.duration_minutes} onChange={(e) => setForm((p) => ({ ...p, duration_minutes: e.target.value }))} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رابط الصورة (اختياري)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mt-7">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
            خدمة مفعّلة
          </label>
        </div>

        <button disabled={saving} className="px-4 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-60">
          {saving ? "جاري الحفظ..." : "إضافة خدمة"}
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">قائمة الخدمات</div>
          <button onClick={load} className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">تحديث</button>
        </div>
        {loading ? (
          <div className="p-4 text-sm text-gray-600">جاري التحميل...</div>
        ) : (
          <div className="divide-y">
            {items.map((svc) => (
              <div key={svc.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{svc.name}</div>
                  <div className="text-sm text-gray-600 line-clamp-2">{svc.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{svc.category} • {svc.duration_minutes} دقيقة</div>
                </div>
                <button
                  onClick={() => toggleActive(svc)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium border ${svc.is_active ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700"}`}
                >
                  {svc.is_active ? "مفعلة" : "معطلة"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

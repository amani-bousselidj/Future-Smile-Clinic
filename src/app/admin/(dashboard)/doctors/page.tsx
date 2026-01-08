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

  const load = async () => {
    setLoading(true);
    try {
      const [drRes, svcRes] = await Promise.all([
        fetch("/api/admin/proxy/api/doctors/?page_size=100", { cache: "no-store" }),
        fetch("/api/admin/proxy/api/services/?page_size=200", { cache: "no-store" }),
      ]);
      if (!drRes.ok) throw new Error("فشل تحميل الأطباء");
      if (!svcRes.ok) throw new Error("فشل تحميل الخدمات");
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

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        biography: form.biography || null,
        photo_url: form.photo_url || null,
      };
      const res = await fetch("/api/admin/proxy/api/doctors/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.detail || "فشل إنشاء الطبيب");
      }
      addNotification({ type: "success", message: "تم إنشاء الطبيب" });
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
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل إنشاء الطبيب" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">الأطباء</h2>
        <p className="text-sm text-gray-600">إضافة/تفعيل/تعطيل الأطباء</p>
      </div>

      <form onSubmit={create} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.first_name} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اللقب</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.last_name} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الإيميل</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التخصص</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.specialization} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الرخصة</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.license_number} onChange={(e) => setForm((p) => ({ ...p, license_number: e.target.value }))} required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نبذة (اختياري)</label>
          <textarea className="w-full px-4 py-3 rounded-xl border border-gray-200" rows={3} value={form.biography} onChange={(e) => setForm((p) => ({ ...p, biography: e.target.value }))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">صورة (URL)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={form.photo_url} onChange={(e) => setForm((p) => ({ ...p, photo_url: e.target.value }))} />
          </div>
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700 mt-7">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} />
            طبيب مفعّل
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">الخدمات</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map((s) => (
              <label key={s.id} className="flex items-center gap-2 text-sm text-gray-700">
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
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        <button disabled={saving} className="px-4 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-60">
          {saving ? "جاري الحفظ..." : "إضافة طبيب"}
        </button>
      </form>

      <div className="rounded-2xl border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-900">قائمة الأطباء</div>
          <button onClick={load} className="text-sm px-3 py-2 rounded-xl border border-gray-200 hover:bg-gray-50">تحديث</button>
        </div>
        {loading ? (
          <div className="p-4 text-sm text-gray-600">جاري التحميل...</div>
        ) : (
          <div className="divide-y">
            {items.map((d) => (
              <div key={d.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-900">{d.first_name} {d.last_name}</div>
                  <div className="text-sm text-gray-600">{d.specialization}</div>
                  <div className="text-xs text-gray-500 mt-1">{d.email} • {d.phone}</div>
                </div>
                <div className={`px-3 py-2 rounded-xl text-xs font-medium border ${d.is_active ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                  {d.is_active ? "مفعّل" : "معطّل"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

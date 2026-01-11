"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { Activity, Plus, RefreshCw, Edit, Trash2, Power, PowerOff } from "lucide-react";

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

const categories = [
  { value: "cleaning", label: "تنظيف" },
  { value: "whitening", label: "تبييض" },
  { value: "orthodontics", label: "تقويم" },
  { value: "implants", label: "زراعة" },
  { value: "cosmetic", label: "تجميل" },
  { value: "restorative", label: "ترميم" },
  { value: "preventive", label: "وقائي" },
];

export default function AdminServicesPage() {
  const { addNotification } = useApp();
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const formatApiError = (data: any, fallback: string) => {
    if (!data) return fallback;
    if (typeof data === "string") return data;
    if (typeof data?.detail === "string") return data.detail;
    if (Array.isArray(data)) return data.map(String).join("، ") || fallback;

    if (typeof data === "object") {
      const parts = Object.entries(data)
        .map(([k, v]) => {
          if (Array.isArray(v)) return `${k}: ${v.map(String).join("، ")}`;
          if (v && typeof v === "object") return `${k}: ${JSON.stringify(v)}`;
          return `${k}: ${String(v)}`;
        })
        .filter(Boolean);
      return parts.join(" | ") || fallback;
    }

    return fallback;
  };

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

  const resetForm = () => {
    setEditingId(null);
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
    setShowForm(false);
  };

  const fail = async (res: Response, fallback: string) => {
    if (res.status === 401) {
      addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
      window.location.href = "/admin/login";
      return;
    }
    const d = await res.json().catch(() => ({}));
    throw new Error(formatApiError(d, fallback));
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

  const upsert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const priceMin = Number(form.price_min);
      const priceMax = form.price_max === "" ? null : Number(form.price_max);
      const duration = Number(form.duration_minutes);

      const payload = {
        ...form,
        price_min: Number.isFinite(priceMin) && priceMin >= 0 ? priceMin : 0,
        price_max: priceMax != null && Number.isFinite(priceMax) ? priceMax : null,
        duration_minutes: Number.isFinite(duration) && duration > 0 ? duration : 30,
        image_url: form.image_url || null,
      };
      const url = editingId ? `/api/admin/proxy/api/services/${editingId}/` : "/api/admin/proxy/api/services/";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) await fail(res, editingId ? "فشل تحديث الخدمة" : "فشل إنشاء الخدمة");
      addNotification({ type: "success", message: editingId ? "تم تحديث الخدمة" : "تم إنشاء الخدمة" });
      resetForm();
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : editingId ? "فشل تحديث الخدمة" : "فشل إنشاء الخدمة" });
    } finally {
      setSaving(false);
    }
  };

  const onEdit = (svc: Service) => {
    setEditingId(svc.id);
    setForm({
      name: svc.name || "",
      description: svc.description || "",
      category: svc.category || "cleaning",
      price_min: String(svc.price_min ?? "0"),
      price_max: svc.price_max == null ? "" : String(svc.price_max),
      duration_minutes: String(svc.duration_minutes ?? 30),
      image_url: svc.image_url || "",
      is_active: Boolean(svc.is_active),
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (svc: Service) => {
    const ok = window.confirm(`حذف الخدمة: ${svc.name} ؟`);
    if (!ok) return;
    const res = await fetch(`/api/admin/proxy/api/services/${svc.id}/`, { method: "DELETE" });
    if (!res.ok) {
      if (res.status === 401) {
        addNotification({ type: "error", message: "انتهت الجلسة، يرجى تسجيل الدخول" });
        window.location.href = "/admin/login";
        return;
      }
      const d = await res.json().catch(() => ({}));
      addNotification({ type: "error", message: formatApiError(d, "فشل حذف الخدمة") });
      return;
    }
    addNotification({ type: "success", message: "تم حذف الخدمة" });
    await load();
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
      addNotification({ type: "error", message: formatApiError(d, "فشل تحديث الخدمة") });
      return;
    }
    await load();
  };

  const getCategoryLabel = (val: string) => categories.find((c) => c.value === val)?.label || val;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-blue-600" />
            <span>إدارة الخدمات</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">إضافة وتعديل وحذف خدمات العيادة</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>{showForm ? "إخفاء النموذج" : "إضافة خدمة"}</span>
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingId ? "تعديل الخدمة" : "خدمة جديدة"}
          </h3>
          <form onSubmit={upsert} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">اسم الخدمة *</label>
                <input
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="مثال: تنظيف الأسنان"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">التصنيف *</label>
                <select
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">الوصف *</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                required
                placeholder="وصف تفصيلي للخدمة..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">السعر الأدنى (دج)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.price_min}
                  onChange={(e) => setForm((p) => ({ ...p, price_min: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">السعر الأقصى (دج)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.price_max}
                  onChange={(e) => setForm((p) => ({ ...p, price_max: e.target.value }))}
                  placeholder="اختياري"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">المدة (دقيقة)</label>
                <input
                  type="number"
                  min={1}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  value={form.duration_minutes}
                  onChange={(e) => setForm((p) => ({ ...p, duration_minutes: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">رابط الصورة (اختياري)</label>
              <input
                type="url"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                value={form.image_url}
                onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="https://..."
              />
            </div>

            <label className="flex items-center gap-3 text-sm font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                className="w-5 h-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span>خدمة مفعّلة</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold disabled:opacity-60 hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                {saving ? "جاري الحفظ..." : editingId ? <><Edit className="w-5 h-5" /> حفظ التعديلات</> : <><Plus className="w-5 h-5" /> إضافة الخدمة</>}
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

      {/* Services List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">قائمة الخدمات</span>
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{items.length}</span>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50 transition disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? "جاري التحميل..." : "تحديث"}</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
            <p className="text-sm text-gray-500 mt-4">جاري تحميل الخدمات...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mb-2">لا توجد خدمات بعد</p>
            <p className="text-sm text-gray-500 mb-6">ابدأ بإضافة أول خدمة</p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-600-dark transition"
            >
              <Plus className="w-5 h-5" />
              <span>إضافة خدمة</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {items.map((svc) => (
              <div key={svc.id} className="p-5 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{svc.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 text-xs font-semibold">
                        {getCategoryLabel(svc.category)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{svc.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span>السعر:</span>
                        <span>{svc.price_min} {svc.price_max ? `- ${svc.price_max}` : ""} دج</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <span>المدة:</span>
                        <span>{svc.duration_minutes} دقيقة</span>
                      </span>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-lg font-semibold ${svc.is_active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                        <span>{svc.is_active ? "مفعّلة" : "معطّلة"}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => toggleActive(svc)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border-2 transition ${
                        svc.is_active
                          ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {svc.is_active ? <><Power className="w-3 h-3" /> تعطيل</> : <><PowerOff className="w-3 h-3" /> تفعيل</>}
                    </button>
                    <button
                      onClick={() => onEdit(svc)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border-2 border-blue-500/30 bg-blue-600/10 text-blue-600 hover:bg-blue-600/20 transition"
                    >
                      <Edit className="w-3 h-3" /> تعديل
                    </button>
                    <button
                      onClick={() => onDelete(svc)}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border-2 border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      <Trash2 className="w-3 h-3" /> حذف
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

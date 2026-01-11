"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

type ClinicProfile = {
  id: number;
  name: string;
  tagline: string;
  primary_phone: string;
  secondary_phone: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  hours_weekdays: string;
  hours_weekend: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
};

export default function AdminSettingsPage() {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ClinicProfile | null>(null);

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
      const res = await fetch("/api/admin/proxy/api/clinic-profile/", { cache: "no-store" });
      if (!res.ok) await fail(res, "فشل تحميل إعدادات العيادة");
      const data = await res.json();
      setProfile(data);
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل تحميل إعدادات العيادة" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/proxy/api/clinic-profile/${profile.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) await fail(res, "فشل حفظ الإعدادات");
      addNotification({ type: "success", message: "تم حفظ الإعدادات" });
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل حفظ الإعدادات" });
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof ClinicProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile((p) => (p ? { ...p, [k]: e.target.value } : p));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>⚙️</span>
            <span>إعدادات العيادة</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">إدارة المعلومات التي تظهر في الموقع</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-900"></div>
          <p className="text-sm text-gray-500 mt-4">جاري تحميل الإعدادات...</p>
        </div>
      ) : !profile ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-lg font-semibold text-gray-900 mb-2">لا توجد بيانات</p>
        </div>
      ) : (
        <form onSubmit={save} className="space-y-6">
          {/* Basic Info Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>🏥</span>
                <span>المعلومات الأساسية</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">اسم العيادة *</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition"
                    value={profile.name}
                    onChange={set("name")}
                    required
                    placeholder="عيادة المستقبل للأسنان"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الشعار (اختياري)</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 outline-none transition"
                    value={profile.tagline}
                    onChange={set("tagline")}
                    placeholder="ابتسامتك المشرقة تبدأ هنا"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-primary/20">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>📞</span>
                <span>معلومات التواصل</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الهاتف الرئيسي *</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.primary_phone}
                    onChange={set("primary_phone")}
                    required
                    placeholder="0123456789"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">الهاتف الثانوي</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.secondary_phone}
                    onChange={set("secondary_phone")}
                    placeholder="0987654321"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.email}
                    onChange={set("email")}
                    required
                    placeholder="info@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان - السطر 1 *</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.address_line_1}
                    onChange={set("address_line_1")}
                    required
                    placeholder="شارع الملك عبدالله"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">العنوان - السطر 2</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.address_line_2}
                    onChange={set("address_line_2")}
                    placeholder="بجوار مستشفى الملك فهد"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>🕐</span>
                <span>ساعات العمل</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">أيام الأسبوع *</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.hours_weekdays}
                    onChange={set("hours_weekdays")}
                    required
                    placeholder="السبت - الخميس: 9:00 صباحاً - 9:00 مساءً"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">عطلة نهاية الأسبوع</label>
                  <input
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
                    value={profile.hours_weekend}
                    onChange={set("hours_weekend")}
                    placeholder="الجمعة: مغلق"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-primary/20">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>📱</span>
                <span>وسائل التواصل الاجتماعي</span>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span>Instagram</span>
                    <span className="text-pink-500">📷</span>
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={profile.instagram_url}
                    onChange={set("instagram_url")}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span>Facebook</span>
                    <span className="text-blue-600">📘</span>
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={profile.facebook_url}
                    onChange={set("facebook_url")}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <span>TikTok</span>
                    <span>🎵</span>
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                    value={profile.tiktok_url}
                    onChange={set("tiktok_url")}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-lg disabled:opacity-60 hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              <span>{saving ? "⏳" : "💾"}</span>
              <span>{saving ? "جاري الحفظ..." : "حفظ الإعدادات"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

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

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/proxy/api/clinic-profile/", { cache: "no-store" });
      if (!res.ok) throw new Error("فشل تحميل إعدادات العيادة");
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
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d?.detail || "فشل حفظ الإعدادات");
      }
      addNotification({ type: "success", message: "تم حفظ الإعدادات" });
      await load();
    } catch (e) {
      addNotification({ type: "error", message: e instanceof Error ? e.message : "فشل حفظ الإعدادات" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-gray-600">جاري التحميل...</div>;
  if (!profile) return <div className="text-sm text-gray-600">لا توجد بيانات</div>;

  const set = (k: keyof ClinicProfile) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setProfile((p) => (p ? { ...p, [k]: e.target.value } : p));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-gray-900">إعدادات العيادة</h2>
        <p className="text-sm text-gray-600">هذه المعلومات تظهر في الموقع</p>
      </div>

      <form onSubmit={save} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">اسم العيادة</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.name} onChange={set("name")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الشعار (اختياري)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.tagline} onChange={set("tagline")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف 1</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.primary_phone} onChange={set("primary_phone")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الهاتف 2</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.secondary_phone} onChange={set("secondary_phone")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">الإيميل</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.email} onChange={set("email")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">العنوان 1</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.address_line_1} onChange={set("address_line_1")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">العنوان 2</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.address_line_2} onChange={set("address_line_2")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل (أيام الأسبوع)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.hours_weekdays} onChange={set("hours_weekdays")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ساعات العمل (الويكند)</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.hours_weekend} onChange={set("hours_weekend")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.instagram_url} onChange={set("instagram_url")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.facebook_url} onChange={set("facebook_url")} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
            <input className="w-full px-4 py-3 rounded-xl border border-gray-200" value={profile.tiktok_url} onChange={set("tiktok_url")} />
          </div>
        </div>

        <button disabled={saving} className="px-4 py-3 rounded-xl bg-gray-900 text-white font-medium disabled:opacity-60">
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </form>
    </div>
  );
}

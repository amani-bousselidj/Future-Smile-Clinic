import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function fetchJson(path: string) {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto = h.get("x-forwarded-proto") || "http";
  if (!host) return null;

  const cookie = h.get("cookie") || "";

  const url = `${proto}://${host}/api/admin/proxy/${path}`;
  const res = await fetch(url, {
    cache: "no-store",
    headers: cookie ? { cookie } : undefined,
  });
  if (res.status === 401) {
    redirect("/admin/login");
  }
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminHomePage() {
  // Minimal overview: counts only.
  const services = await fetchJson("api/services/?page_size=1");
  const appointments = await fetchJson("api/appointments/?page_size=1");
  const messages = await fetchJson("api/contact/?page_size=1");

  const serviceCount = services?.count ?? "—";
  const appointmentCount = appointments?.count ?? "—";
  const messageCount = messages?.count ?? "—";

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">نظرة عامة</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-600">الخدمات</div>
          <div className="text-2xl font-bold text-gray-900">{serviceCount}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-600">المواعيد</div>
          <div className="text-2xl font-bold text-gray-900">{appointmentCount}</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="text-sm text-gray-600">الرسائل</div>
          <div className="text-2xl font-bold text-gray-900">{messageCount}</div>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        ملاحظة: سيتم إضافة صفحات إدارة كاملة (CRUD) تدريجياً.
      </p>
    </div>
  );
}

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
  const services = await fetchJson("api/services/?page_size=1");
  const appointments = await fetchJson("api/appointments/?page_size=1");
  const messages = await fetchJson("api/contact/?page_size=1");

  const serviceCount = services?.count ?? "—";
  const appointmentCount = appointments?.count ?? "—";
  const messageCount = messages?.count ?? "—";

  const stats = [
    { 
      label: "الخدمات المتاحة", 
      value: serviceCount, 
      icon: "🦷", 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    { 
      label: "المواعيد", 
      value: appointmentCount, 
      icon: "📅", 
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50"
    },
    { 
      label: "الرسائل", 
      value: messageCount, 
      icon: "💬", 
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">نظرة عامة</h2>
        <p className="text-sm text-gray-500 mt-1">إحصائيات سريعة عن النظام</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${stat.bgGradient} p-6 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">{stat.label}</div>
                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
              </div>
              <div className="text-4xl opacity-80">{stat.icon}</div>
            </div>
            <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-12 -mb-12`} />
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl">ℹ️</div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">مرحباً بك في لوحة التحكم</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              استخدم القائمة الجانبية للوصول إلى جميع أقسام الإدارة. يمكنك إضافة وتعديل وحذف الخدمات والأطباء، 
              وإدارة المواعيد والرسائل، وتحديث معلومات العيادة من قسم الإعدادات.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

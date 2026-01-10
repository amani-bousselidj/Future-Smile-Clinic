"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "نظرة عامة", icon: "📊" },
  { href: "/admin/services", label: "الخدمات", icon: "🦷" },
  { href: "/admin/doctors", label: "الأطباء", icon: "👨‍⚕️" },
  { href: "/admin/appointments", label: "المواعيد", icon: "📅" },
  { href: "/admin/messages", label: "الرسائل", icon: "💬" },
  { href: "/admin/settings", label: "إعدادات العيادة", icon: "⚙️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                لوحة التحكم - عيادة ابتسامة المستقبل
              </h1>
              <p className="text-sm text-gray-500 mt-1">إدارة شاملة للموقع والعيادة</p>
            </div>
            <form action="/api/admin/auth/logout" method="post">
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-800 to-gray-900 text-white text-sm font-medium hover:from-gray-900 hover:to-black transition-all shadow-md hover:shadow-lg">
                <span>تسجيل الخروج</span>
                <span>🚪</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar */}
          <aside className="bg-white border border-gray-200 rounded-2xl shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] overflow-hidden">
            <div className="p-4">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">القائمة الرئيسية</div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

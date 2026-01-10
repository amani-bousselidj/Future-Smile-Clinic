"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Activity, Users, Calendar, MessageSquare, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "نظرة عامة", Icon: BarChart3 },
  { href: "/admin/services", label: "الخدمات", Icon: Activity },
  { href: "/admin/doctors", label: "الأطباء", Icon: Users },
  { href: "/admin/appointments", label: "المواعيد", Icon: Calendar },
  { href: "/admin/messages", label: "الرسائل", Icon: MessageSquare },
  { href: "/admin/settings", label: "إعدادات العيادة", Icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Fixed Sidebar */}
        <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 shadow-lg flex flex-col z-10">
          {/* Logo/Title */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              عيادة ابتسامة المستقبل
            </h1>
            <p className="text-xs text-gray-500 mt-1">لوحة التحكم</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">القائمة الرئيسية</div>
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <form action="/api/admin/auth/logout" method="post">
              <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-all">
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content - with margin for fixed sidebar */}
        <main className="flex-1 mr-64 p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

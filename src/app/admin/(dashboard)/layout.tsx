import React from "react";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-sm text-gray-600">إدارة الموقع والبيانات</p>
          </div>
          <form action="/api/admin/auth/logout" method="post">
            <button className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium hover:bg-gray-50">
              تسجيل الخروج
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
          <aside className="bg-white border border-gray-200 rounded-2xl p-4 md:sticky md:top-6 md:h-[calc(100vh-3rem)]">
            <nav className="space-y-1">
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin">نظرة عامة</Link>
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin/services">الخدمات</Link>
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin/doctors">الأطباء</Link>
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin/appointments">المواعيد</Link>
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin/messages">الرسائل</Link>
              <Link className="block px-3 py-2 rounded-xl hover:bg-gray-50" href="/admin/settings">إعدادات العيادة</Link>
            </nav>
          </aside>

          <main className="bg-white border border-gray-200 rounded-2xl p-5">{children}</main>
        </div>
      </div>
    </div>
  );
}

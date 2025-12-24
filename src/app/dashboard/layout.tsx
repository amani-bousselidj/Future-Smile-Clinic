"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome,
  FaTooth,
  FaCalendarAlt,
  FaUsers,
  FaComments,
  FaBlog,
  FaBars,
  FaTimes,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: "الرئيسية", href: "/dashboard", icon: <FaHome /> },
    {
      name: "النظرة العامة",
      href: "/dashboard/overview",
      icon: <FaChartLine />,
    },
    { name: "التحليلات", href: "/dashboard/analytics", icon: <FaChartLine /> },
    { name: "الخدمات", href: "/dashboard/services", icon: <FaTooth /> },
    {
      name: "الحجوزات",
      href: "/dashboard/appointments",
      icon: <FaCalendarAlt />,
    },
    { name: "المرضى", href: "/dashboard/patients", icon: <FaUsers /> },
    { name: "الآراء", href: "/dashboard/testimonials", icon: <FaComments /> },
    { name: "المقالات", href: "/dashboard/blog", icon: <FaBlog /> },
  ];

  const handleLogout = () => {
    if (confirm("هل أنت متأكد من تسجيل الخروج؟")) {
      logout();
      router.push("/login");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block lg:w-64 bg-gradient-to-b from-primary-dark to-primary-light text-white flex-shrink-0">
          <div className="h-screen overflow-y-auto sticky top-0">
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold">لوحة التحكم</h2>
                <p className="text-sm text-white/80 mt-2">
                  مرحباً، {user?.username}
                </p>
              </div>

              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/")
                        ? "bg-white text-primary-dark font-bold shadow-md"
                        : "hover:bg-white/20"
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 space-y-4">
                <div className="p-4 bg-white/10 rounded-lg">
                  <p className="text-sm mb-2">عيادة ابتسامة المستقبل</p>
                  <Link
                    href="/"
                    className="text-xs hover:underline inline-flex items-center gap-1"
                  >
                    العودة للموقع ←
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition-all font-bold"
                >
                  <FaSignOutAlt />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar - overlay when open */}
        <aside
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-primary-dark to-primary-light text-white transform transition-transform duration-300 ease-in-out lg:hidden shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold">لوحة التحكم</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                  aria-label="إغلاق القائمة"
                >
                  <FaTimes className="text-xl sm:text-2xl" />
                </button>
              </div>

              <nav className="space-y-1 sm:space-y-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${
                      pathname === item.href
                        ? "bg-white text-primary-dark font-bold shadow-md"
                        : "hover:bg-white/20"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-lg sm:text-xl">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/10 rounded-lg">
                <p className="text-xs sm:text-sm mb-2">
                  عيادة ابتسامة المستقبل
                </p>
                <Link
                  href="/"
                  className="text-xs hover:underline inline-flex items-center gap-1"
                >
                  العودة للموقع ←
                </Link>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-h-screen flex flex-col">
          {/* Top Bar */}
          <header className="bg-white shadow-sm sticky top-0 z-30">
            <div className="flex items-center justify-between p-3 sm:p-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-primary-dark hover:bg-gray-100 p-2 rounded-lg transition"
                aria-label="فتح القائمة"
              >
                <FaBars className="text-xl sm:text-2xl" />
              </button>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark">
                لوحة التحكم
              </h1>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-xs sm:text-sm text-gray-600">
                  مرحبًا، Admin
                </span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
          />
        )}
      </div>
    </ProtectedRoute>
  );
}

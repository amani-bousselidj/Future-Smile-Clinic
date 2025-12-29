/**
 * Header Component - Navigation header with logo and Arabic support
 */
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./Button";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-l from-blue-50 to-white shadow-lg sticky top-0 z-40 border-b-2 border-blue-600">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-bold text-2xl text-blue-700 hover:text-blue-800 transition-colors"
          >
            <div className="w-12 h-12 bg-gradient-to-b from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">FS</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold">عيادة ابتسامة</div>
              <div className="text-xs text-blue-500">المستقبل</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              الرئيسية
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              الخدمات
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              عن العيادة
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1"
            >
              اتصل بنا
            </Link>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {user.full_name || user.email}
                  </div>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={logout}
                  className="whitespace-nowrap"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    دخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="whitespace-nowrap">
                    اشتراك
                  </Button>
                </Link>
              </>
            )}
            <Link href="/appointments">
              <Button
                variant="primary"
                size="sm"
                className="whitespace-nowrap bg-gradient-to-l from-blue-600 to-blue-500"
              >
                حجز موعد
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

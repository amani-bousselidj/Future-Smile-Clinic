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
    <header className="bg-white/95 backdrop-blur-md shadow-xl sticky top-0 z-50 border-b-4 border-blue-500">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-4 group"
          >
            <div className="relative transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-2">
              <img 
                src="/images/logo.png" 
                alt="Future Smile Clinic Logo" 
                className="h-16 w-auto drop-shadow-lg"
              />
            </div>
            <div className="hidden lg:block">
              <div className="text-lg font-bold text-blue-700 group-hover:text-blue-800 transition-colors">
                عيادة ابتسامة المستقبل
              </div>
              <div className="text-xs text-blue-500 font-medium tracking-wider">
                YOUR SMILE OUR CARE
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10">الرئيسية</span>
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/services"
              className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10">الخدمات</span>
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10">عن العيادة</span>
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/contact"
              className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 group"
            >
              <span className="relative z-10">اتصل بنا</span>
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gradient-to-l from-blue-600 to-blue-400 group-hover:w-full transition-all duration-300"></span>
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
                    className="whitespace-nowrap hover:bg-blue-50 transition-all duration-300 hover:scale-105"
                  >
                    دخول
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="whitespace-nowrap bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:scale-105 shadow-lg">
                    اشتراك
                  </Button>
                </Link>
              </>
            )}
            <Link href="/appointments">
              <Button
                variant="primary"
                size="sm"
                className="whitespace-nowrap bg-gradient-to-l from-blue-600 via-blue-500 to-blue-600 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 shadow-xl animate-pulse"
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

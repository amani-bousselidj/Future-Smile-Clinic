/**
 * Header Component - Navigation header with logo and Arabic support
 */
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";

export function Header() {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="Future Smile Clinic Logo"
              className="h-14 w-auto"
            />
            <div className="hidden lg:block">
              <div className="text-lg font-bold text-gray-900">
                عيادة ابتسامة المستقبل
              </div>
              <div className="text-xs text-gray-500">
                YOUR SMILE OUR CARE
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              الرئيسية
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              الخدمات
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              عن العيادة
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              اتصل بنا
            </Link>
          </div>

          {/* Appointment Button */}
          <div>
            <Link href="/appointments">
              <Button
                variant="primary"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
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

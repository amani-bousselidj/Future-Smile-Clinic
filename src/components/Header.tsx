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
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/images/logo.png"
              alt="Future Smile Clinic Logo"
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="hidden lg:block">
              <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                عيادة ابتسامة المستقبل
              </div>
              <div className="text-xs text-gray-500">YOUR SMILE OUR CARE</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors pb-1"
            >
              الرئيسية
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link
              href="/services"
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors pb-1"
            >
              الخدمات
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/about"
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors pb-1"
            >
              عن العيادة
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
            </Link>
            <Link
              href="/contact"
              className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors pb-1"
            >
              اتصل بنا
              <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 hover:w-full"></span>
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

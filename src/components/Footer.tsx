/**
 * Footer Component - Professional footer with Arabic support
 */
"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 text-gray-300 mt-20 overflow-hidden">
      {/* Decorative Top Wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full transform rotate-180"
        >
          <path
            d="M0,64 C240,100 480,100 720,64 C960,28 1200,28 1440,64 L1440,120 L0,120 Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/logo.png"
                alt="Future Smile Clinic"
                className="h-12 w-auto drop-shadow-lg"
              />
            </div>
            <h3 className="text-white font-bold text-xl mb-4">
              عيادة ابتسامة المستقبل
            </h3>
            <p className="text-base leading-relaxed text-gray-400">
              عيادة متخصصة بأعلى معايير الجودة والاحترافية في رعاية الأسنان مع
              أحدث التقنيات والأطباء المتمرسين.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">خدماتنا</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  طب الأسنان العام
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  تقويم الأسنان
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  تجميل الأسنان
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-blue-400 transition-colors"
                >
                  زراعة الأسنان
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  من نحن
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  شروط الخدمة
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-lg">تواصل معنا</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">رقم الهاتف:</span>
                <span>+966 12 345 6789</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">البريد:</span>
                <span>info@futuresmile.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">الساعات:</span>
                <span>ح-خ 9-6 مساءً</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400 font-bold">السبت:</span>
                <span>10 صباحاً - 4 مساءً</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p className="text-gray-400">
            جميع الحقوق محفوظة لعام 2024 عيادة ابتسامة المستقبل
          </p>
          <p className="text-gray-500 mt-2 text-xs">
            عيادتك الموثوقة للعناية بصحة أسنانك وابتسامتك
          </p>
        </div>
      </div>
    </footer>
  );
}

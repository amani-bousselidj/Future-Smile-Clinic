"use client";

import React from "react";
import Link from "next/link";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { title: "الصفحة الرئيسية", slideIndex: 0 },
    { title: "الخدمات", slideIndex: 1 },
    { title: "الأطباء", slideIndex: 2 },
    { title: "نتائج قبل وبعد", slideIndex: 4 },
    { title: "احجز موعد", slideIndex: 6 },
  ];

  const goToSlide = (slideIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("fps:go", {
        detail: { index: slideIndex },
      })
    );
  };

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden relative">
      {/* Top Navigation */}
      <nav className="px-6 sm:px-12 md:px-16 lg:px-24 py-8 sm:py-10">
        <ul className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 text-sm sm:text-base">
          {navLinks.map((link) => (
            <li key={link.title}>
              <button
                type="button"
                onClick={() => goToSlide(link.slideIndex)}
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                {link.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center px-6 sm:px-12 md:px-16 lg:px-24">
        <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Right Section - Schedule & Contact */}
          <div className="space-y-6 order-1 lg:order-1">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3">جدول العمل</h3>
              <p className="text-sm sm:text-base text-gray-300">
                السبت - الخميس: 11:00 - 20:30
                <br />
                الجمعة - عطلة
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-semibold mb-3">الاتصال</h3>
              <p className="text-sm sm:text-base text-gray-300">
                الرياض، شارع الملك فهد، 17
                <br />
                <a href="tel:+966500000000" className="hover:text-gray-400 transition-colors">
                  + 966 50 000 00 00
                </a>
              </p>
              <p className="text-sm sm:text-base text-gray-300 pt-3">
                جدة، شارع التحلية، 40
                <br />
                <a href="tel:+966511111111" className="hover:text-gray-400 transition-colors">
                  +966 51 111 11 11
                </a>
              </p>
              <p className="text-sm sm:text-base pt-3">
                <a
                  href="mailto:info@futuresmile.sa"
                  className="text-gray-300 hover:text-gray-400 transition-colors"
                >
                  info@futuresmile.sa
                </a>
              </p>
            </div>
          </div>

          {/* Center Section - Large Clinic Name */}
          <div className="flex items-center justify-center order-3 lg:order-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-none tracking-tight text-center">
              FUTURE
              <br />
              SMILE
            </h1>
          </div>

          {/* Left Section - Social Media */}
          <div className="space-y-4 order-2 lg:order-3 lg:text-left">
            <h3 className="text-base sm:text-lg font-semibold mb-4">وسائل التواصل</h3>
            <ul className="space-y-3 text-sm sm:text-base">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300 inline-block"
                >
                  INSTAGRAM
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300 inline-block"
                >
                  FACEBOOK
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-300 transition-colors duration-300 inline-block"
                >
                  TIKTOK
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 sm:px-12 md:px-16 lg:px-24 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm text-gray-400">
          <p>© {currentYear} Future Smile Clinic</p>
          <Link
            href="/privacy"
            className="hover:text-gray-300 transition-colors duration-300"
          >
            سياسة الخصوصية
          </Link>
          <p className="text-left">
            WEBSITE DEVELOPMENT:{" "}
            <span className="font-semibold text-white">ِAmani Bousselidj</span>
          </p>
        </div>
      </div>
    </div>
  );
}

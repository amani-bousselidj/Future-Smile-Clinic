/**
 * Header Component - Presentation-style navigation header
 */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
  onLoadingComplete?: boolean;
}

export function Header({ onLoadingComplete = false }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (onLoadingComplete) {
      // Start entrance animation after loading completes
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [onLoadingComplete]);

  const navItems = [
    { id: "home", label: "الرئيسية", href: "/" },
    { id: "about", label: "عن العيادة", href: "/about" },
    { id: "services", label: "الخدمات", href: "/services" },
    { id: "doctors", label: "الأطباء", href: "/about" },
    { id: "testimonials", label: "قصص المرضى", href: "/about" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out"
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(-20px)",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div className="mx-auto px-6 py-4 max-w-[1280px]">
        <div className="flex items-center justify-between gap-8">
          {/* Left: Clinic Name */}
          <div className="text-[17px] font-medium text-gray-800 whitespace-nowrap">
            Future Smile Clinic
          </div>

          {/* Center: Navigation Capsule */}
          <nav className="hidden md:flex items-center justify-center flex-1 max-w-[600px]">
            <div
              className="flex items-center gap-1 px-2 py-2 rounded-full shadow-sm"
              style={{
                backgroundColor: "#F6F7F8",
              }}
            >
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    relative px-6 py-2.5 rounded-full text-[15px] font-medium
                    transition-all duration-200
                    ${
                      activeTab === item.id
                        ? "bg-gray-800 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Right: Booking Button (hidden on small screens) */}
          <Link
            href="/appointments"
            className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-300 
                     text-[15px] font-medium text-gray-800 whitespace-nowrap
                     hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200 shadow-sm"
          >
            <span>حجز موعد</span>
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-800"
            aria-label="Open menu"
            onClick={() => setMobileOpen((s) => !s)}
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Mobile Nav Sidebar */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-50 transition-transform duration-500 ease-out ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all duration-200"
          aria-label="Close menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Content */}
        <div className="flex flex-col h-full pt-20 pb-8 px-6">
          {/* Logo/Title */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-1">Future Smile</h2>
            <p className="text-sm text-gray-400">ابتسامتك تبدأ هنا</p>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`block px-5 py-4 rounded-xl text-right transition-all duration-300 transform hover:translate-x-[-4px] ${
                  activeTab === item.id
                    ? "bg-white text-gray-900 shadow-lg font-semibold"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: mobileOpen ? 'slideIn 0.4s ease-out forwards' : 'none'
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{item.label}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <Link
            href="/appointments"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-center font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3"
          >
            <span>احجز موعدك الآن</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Contact Info */}
          <div className="mt-6 pt-6 border-t border-gray-700 text-center">
            <p className="text-sm text-gray-400 mb-2">تواصل معنا</p>
            <div className="flex justify-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
}

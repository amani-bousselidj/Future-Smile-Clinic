/**
 * Header Component - Presentation-style navigation header
 */
"use client";

import React, { useState, useEffect } from "react";

interface HeaderProps {
  onLoadingComplete?: boolean;
}

export function Header({ onLoadingComplete = false }: HeaderProps) {
  const [isVisible, setIsVisible] = useState(!onLoadingComplete);
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
    setIsVisible(true);
    return undefined;
  }, [onLoadingComplete]);

  const navItems = [
    { id: "home", label: "الرئيسية", sectionIndex: 0 },
    { id: "services", label: "الخدمات", sectionIndex: 1 },
    { id: "doctors", label: "الأطباء", sectionIndex: 2 },
    { id: "testimonials", label: "قصص المرضى", sectionIndex: 4 },
  ];

  const goToSection = (sectionIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("fps:go", {
        detail: { index: sectionIndex },
      })
    );
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-out"
        style={{
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
          opacity: isVisible ? 1 : 0,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div
          data-header-inner="true"
          className="mx-auto px-6 py-4 max-w-[1280px]"
        >
          <div className="flex items-center justify-between gap-8">
            {/* Left: Clinic Name */}
            <button
              onClick={() => goToSection(0)}
              data-header-left="true"
              className="text-[17px] font-medium text-gray-800 whitespace-nowrap hover:text-gray-600 transition-colors"
            >
              Future Smile Clinic
            </button>

            {/* Center: Navigation Capsule */}
            <nav className="hidden md:flex items-center justify-center flex-1 max-w-[600px]">
              <div
                className="flex items-center gap-1 px-2 py-2 rounded-full shadow-sm"
                style={{
                  backgroundColor: "#F6F7F8",
                }}
              >
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      goToSection(item.sectionIndex);
                    }}
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
                  </button>
                ))}
              </div>
            </nav>

            {/* Right: Booking Button (hidden on small screens) */}
            <button
              data-header-right="true"
              onClick={() => goToSection(6)}
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
            </button>

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
      </header>

      {/* Mobile Nav Sidebar - Creative Design */}
      <div
        className={`md:hidden fixed top-0 right-0 h-screen w-[280px] bg-white/10 backdrop-blur-2xl shadow-2xl z-[100] transition-transform duration-500 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent"></div>

        {/* Close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-white/30 transition-all"
          aria-label="Close menu"
        >
          <svg
            className="w-5 h-5"
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
        </button>

        {/* Content */}
        <div className="relative h-full flex flex-col pt-24 pb-8 px-6 z-10 overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                  goToSection(item.sectionIndex);
                }}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 w-full text-right ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-[#1e3a8a]/20 to-[#3b82f6]/20 backdrop-blur-sm shadow-lg text-[#1e3a8a]"
                    : "text-gray-800 hover:bg-white/30"
                }`}
                style={{
                  animationDelay: `${index * 80}ms`,
                  animation: mobileOpen
                    ? "slideInLeft 0.5s ease-out forwards"
                    : "none",
                }}
              >
                <div
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTab === item.id
                      ? "bg-[#1e3a8a] scale-100"
                      : "bg-gray-500 scale-0 group-hover:scale-100"
                  }`}
                ></div>
                <span className="text-[15px] font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <button
            onClick={() => {
              setMobileOpen(false);
              goToSection(6);
            }}
            className="relative overflow-hidden mt-6 py-4 px-6 bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all duration-300 group w-full"
          >
            <div className="relative flex items-center justify-between text-white">
              <span className="font-semibold">احجز موعدك الآن</span>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-500">
                <svg
                  className="w-4 h-4"
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
            </div>
          </button>

          {/* Social icons */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-xs text-gray-600 text-center mb-3">تواصل معنا</p>
            <div className="flex justify-center gap-3">
              {[
                {
                  icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                },
                {
                  icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                },
                {
                  icon: "M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z",
                },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-gray-800 hover:bg-[#1e3a8a]/20 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none"></div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}

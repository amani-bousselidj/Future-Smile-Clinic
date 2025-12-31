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
      {/* Mobile Nav Panel */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`px-4 py-2 rounded-md text-right ${
                  activeTab === item.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

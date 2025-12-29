"use client";

import React from "react";

export default function HeroTooth() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-r from-blue-50 via-green-50 to-white">
      {/* Full-bleed SVG background with masked large text */}
      <svg className="absolute inset-0 w-full h-full block" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <mask id="toothMaskBg">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <path d="M800 220c30-40 80-40 110 0 33 46 25 78 8 113-17 35-38 52-50 92-12 40-3 80-8 113-5 33-28 58-56 58s-51-25-56-58c-5-33 3-73-8-113-12-40-33-57-50-92-17-35-25-67 8-113 30-40 80-40 110 0z" fill="#000" />
          </mask>
        </defs>

        <g mask="url(#toothMaskBg)">
          <rect width="100%" height="100%" fill="transparent" />
          <text x="50%" y="58%" textAnchor="middle" fontFamily="Inter, system-ui, Arial" fontWeight={900}
            fontSize="220" fill="#D6E8E8" style={{ letterSpacing: '-0.02em' }}>
            Future Smile Clinic
          </text>
        </g>
      </svg>

      {/* Centered tooth image and content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-6xl px-6 lg:px-12 py-24 lg:py-32">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
              <img
                src="/images/clinic-hero.jpg"
                alt="tooth"
                className="w-[40vw] max-w-[900px] object-contain drop-shadow-2xl"
                style={{ filter: 'brightness(1.02) contrast(0.95)' }}
              />
            </div>

            <div className="relative z-20 pt-12 lg:pt-6 text-center">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">ابتسامتك تستحق الأفضل</h2>
              <p className="mt-4 text-gray-600 max-w-2xl mx-auto">رعاية متقدمة، أطباء متخصصين، وبيئة مريحة للعائلة كاملة.</p>
              <div className="mt-8 flex justify-center gap-4">
                <a href="/appointments" className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition">حجز موعد</a>
                <a href="/services" className="px-6 py-3 rounded-full border border-gray-200 text-gray-800 font-medium hover:bg-gray-50 transition">الخدمات</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

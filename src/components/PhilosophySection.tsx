"use client";

import React from "react";

export default function PhilosophySection() {
  const statistics = [
    {
      id: 1,
      number: "1350+",
      label: "مرضى راضون",
    },
    {
      id: 2,
      number: "94%",
      label: "عملاء يأتون بالتوصية",
    },
    {
      id: 3,
      number: "13+",
      label: "سنوات من الخبرة",
    },
  ];

  return (
    <div
      className="h-screen w-full relative flex flex-col justify-between overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #E8F4F8 0%, #D4E7ED 100%)",
      }}
    >
      {/* Background Image - Aligners */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{
          backgroundImage: "url('/images/philosophy-background.png')",
          backgroundPosition: "right center",
        }}
      />

      {/* Top Section Brand Name (Optional) */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-12 z-10">
        <p className="text-gray-600 text-xs sm:text-sm md:text-base text-right leading-relaxed">
          <span className="font-semibold">Future Smile</span> — عيادة أسنان حديثة
          <br className="hidden sm:block" />
          <span className="text-xs sm:text-sm">رعاية متميزة لجميع أفراد العائلة</span>
        </p>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-12 sm:py-16">
        <div className="max-w-2xl">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            فلسفة عيادة
            <br />
            <span className="text-gray-700">FUTURE SMILE</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed max-w-xl">
            Future Smile — المكان الذي تتحقق فيه الابتسامة المثالية، والنتيجة تمنح
            الثقة والراحة
          </p>

          {/* CTA Button */}
          <button className="group bg-gray-800 hover:bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 flex items-center gap-3">
            المزيد عن العيادة
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Statistics Cards at Bottom */}
      <div className="relative z-10 px-4 sm:px-8 md:px-12 lg:px-16 pb-6 sm:pb-10 md:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              className="backdrop-blur-md bg-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/40 hover:bg-white/70 transition-all duration-300 hover:scale-105"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="text-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-1 sm:mb-2">
                  {stat.number}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-tight">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-blue-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-1/4 w-40 h-40 sm:w-64 sm:h-64 bg-cyan-200/20 rounded-full blur-3xl" />
    </div>
  );
}

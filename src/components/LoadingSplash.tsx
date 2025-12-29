"use client";

import React, { useState, useEffect } from "react";

export const LoadingSplash: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    // بعد 2.5 ثانية نبدأ الزوم
    const zoomTimer = setTimeout(() => {
      setIsZooming(true);
    }, 2500);

    // بعد 3 ثوانٍ نخفي الشاشة بالكامل
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-500 ${
        isZooming ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgb(255, 255, 255) 1px, transparent 0)",
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="relative flex flex-col items-center gap-12">
        {/* Main Badge with Animations */}
        <div
          className={`badge-container ${isZooming ? "zoom-out" : ""}`}
          style={{
            animation: isZooming
              ? "zoomOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards"
              : "fadeInScale 0.8s ease-in-out forwards, breathe 2s ease-in-out 0.8s infinite",
          }}
        >
          <div className="relative px-20 py-8 bg-white rounded-full shadow-2xl">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-white rounded-full blur-xl opacity-30"></div>

            {/* Logo/Text */}
            <h1 className="relative z-10 text-4xl md:text-5xl font-black text-slate-900 whitespace-nowrap tracking-tight">
              Future Smile Clinic
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="text-gray-400 text-sm font-medium tracking-wider"
          style={{
            animation: "fadeIn 1s ease-in-out 0.5s forwards",
            opacity: 0,
          }}
        >
          عيادة أسنان بريميوم - رعاية استثنائية لابتسامتك
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes zoomOut {
          0% {
            transform: scale(1);
            border-radius: 9999px;
          }
          100% {
            transform: scale(15);
            border-radius: 0;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

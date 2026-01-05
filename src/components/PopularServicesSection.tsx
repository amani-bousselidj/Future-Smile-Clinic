"use client";

import React, { useState, useEffect } from "react";

interface PopularService {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export default function PopularServicesSection() {
  const [activeServiceId, setActiveServiceId] = useState<number>(1);

  const services: PopularService[] = [
    {
      id: 1,
      title: "طقم الأسنان",
      description:
        "استعادة كاملة للأسنان المفقودة باستخدام طقم الأسنان، تركيب مريح مع مظهر طبيعي.",
      icon: "🦷",
    },
    {
      id: 2,
      title: "نظافة مهنية",
      description:
        "إزالة الجير باستخدام الموجات فوق الصوتية، التلميع، الفلورايد، التوصيات الشخصية للحفاظ على ابتسامة صحية.",
      icon: "✨",
    },
    {
      id: 3,
      title: "طب الأسنان التجميلي",
      description:
        "الفينير، تبييض الأسنان، الترميم، تغيير الشكل واللون، استعادة الابتسامة المثالية، المظهر الطبيعي.",
      icon: "💎",
    },
    {
      id: 4,
      title: "تقويم الأسنان",
      description:
        "تقويم الأسنان باستخدام الأجهزة الشفافة (الإلاينر) أو البراكت، تصحيح التراكم، تحسين الوظائف والجمالية للابتسامة.",
      icon: "🦷",
    },
  ];

  // Auto-rotate active service every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServiceId((prevId) => {
        const currentIndex = services.findIndex((s) => s.id === prevId);
        const nextIndex = (currentIndex + 1) % services.length;
        return services[nextIndex].id;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [services]);

  return (
    <div
      className="h-screen w-full overflow-hidden relative"
      style={{
        backgroundImage: "url('/images/clinic-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes pulseGlow {
            0%, 100% { 
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1);
            }
            50% { 
              box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.2);
            }
          }
          .active-card {
            animation: pulseGlow 2s ease-in-out infinite;
          }
        `
      }} />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/70 via-gray-800/60 to-gray-900/70" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            خدمات شائعة
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        {/* Services Grid */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-6xl">
            {services.map((service, index) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`group relative p-6 sm:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg transition-all duration-700 ${
                    isActive
                      ? "bg-white/25 border-2 border-white/40 active-card scale-105"
                      : "bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-102"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    boxShadow: isActive
                      ? "0 20px 60px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`text-5xl sm:text-6xl mb-4 transition-transform duration-500 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`}
                  >
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-xl sm:text-2xl font-bold mb-3 transition-colors duration-500 ${
                      isActive ? "text-white" : "text-white/90"
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-sm sm:text-base leading-relaxed transition-all duration-500 ${
                      isActive
                        ? "text-white/95 opacity-100"
                        : "text-white/70 opacity-90"
                    }`}
                  >
                    {service.description}
                  </p>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-400 rounded-full shadow-lg" />
                  )}

                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div
                      className="absolute inset-0 rounded-2xl sm:rounded-3xl"
                      style={{
                        background:
                          "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
                        backgroundSize: "200% 200%",
                        animation: "shine 3s ease-in-out infinite",
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveServiceId(service.id)}
              className={`h-2 rounded-full transition-all duration-500 ${
                service.id === activeServiceId
                  ? "w-8 bg-blue-400"
                  : "w-2 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`انتقل إلى ${service.title}`}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `
      }} />
    </div>
  );
}

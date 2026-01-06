"use client";

import React, { useState, useEffect } from "react";

interface PopularService {
  id: number;
  title: string;
  description: string;
  position: { top: string; left: string };
  image: string;
}

export default function PopularServicesSection() {
  const [activeServiceId, setActiveServiceId] = useState<number>(1);

  // Calculate semicircular path positions for tooth images
  const getPathPosition = (index: number, total: number) => {
    // Angle from 0 to 180 degrees (semicircle from bottom-left to bottom-right)
    const angle = (index / (total - 1)) * Math.PI;
    
    // Radius of the semicircle (percentage of screen)
    const radiusX = 35; // horizontal radius
    const radiusY = 25; // vertical radius
    
    // Calculate position
    const x = 50 + radiusX * Math.cos(angle + Math.PI); // Start from left
    const y = 70 - radiusY * Math.sin(angle); // Start from bottom
    
    return { x: `${x}%`, y: `${y}%` };
  };

  const services: PopularService[] = [
    {
      id: 1,
      title: "طقم الأسنان",
      description:
        "استعادة كاملة للأسنان المفقودة باستخدام طقم الأسنان، تركيب مريح مع مظهر طبيعي.",
      position: { top: "15%", left: "5%" },
      image: "/images/services/dentures.png",
    },
    {
      id: 2,
      title: "نظافة مهنية",
      description:
        "إزالة الجير باستخدام الموجات فوق الصوتية، التلميع، الفلورايد، التوصيات الشخصية للحفاظ على ابتسامة صحية.",
      position: { top: "20%", left: "75%" },
      image: "/images/services/tooth.png",
    },
    {
      id: 3,
      title: "طب الأسنان التجميلي",
      description:
        "الفينير، تبييض الأسنان، الترميم، تغيير الشكل واللون، استعادة الابتسامة المثالية، المظهر الطبيعي.",
      position: { top: "65%", left: "8%" },
      image: "/images/services/tooth.png",
    },
    {
      id: 4,
      title: "تقويم الأسنان",
      description:
        "تقويم الأسنان باستخدام الأجهزة الشفافة (الإلاينر) أو البراكت، تصحيح التراكم، تحسين الوظائف والجمالية للابتسامة.",
      position: { top: "65%", left: "70%" },
      image: "/images/services/aligners.png",
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
          @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        `
      }} />

      <div className="relative z-10 h-full">
        {/* Header */}
        <div className="pt-8 sm:pt-12 pb-6 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
            خدمات شائعة
          </h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        {/* Randomly Positioned Cards */}
        <div className="relative h-[calc(100%-200px)]">
          {/* Semicircular Path Tooth Elements */}
          <div className="absolute inset-0 pointer-events-none">
            {services.map((service, index) => {
              const pathPos = getPathPosition(index, services.length);
              const isActive = activeServiceId === service.id;
              
              return (
                <img
                  key={service.id}
                  src={service.image}
                  alt={service.title}
                  className="absolute w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain transition-all duration-1000 ease-in-out"
                  style={{
                    left: pathPos.x,
                    top: pathPos.y,
                    transform: `translate(-50%, -50%) scale(${isActive ? 1.2 : 0.9}) ${isActive ? 'rotate(0deg)' : 'rotate(-10deg)'}`,
                    opacity: isActive ? 1 : 0.6,
                    filter: `drop-shadow(0 ${isActive ? '15' : '8'}px ${isActive ? '40' : '20'}px rgba(0, 0, 0, 0.3))`,
                    zIndex: isActive ? 30 : 10,
                  }}
                />
              );
            })}
          </div>

          {services.map((service) => {
            const isActive = activeServiceId === service.id;
            return (
              <button
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`group absolute p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg transition-all duration-700 w-[85%] sm:w-[40%] md:w-[30%] lg:w-[22%] ${
                  isActive
                    ? "bg-white/25 border-2 border-white/40 active-card scale-105 z-20"
                    : "bg-white/10 border border-white/20 hover:bg-white/15 hover:scale-102 z-10"
                }`}
                style={{
                  top: service.position.top,
                  left: service.position.left,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isActive
                    ? "0 20px 60px rgba(0, 0, 0, 0.3)"
                    : "0 8px 32px rgba(0, 0, 0, 0.2)",
                }}
              >
                {/* Title */}
                <h3
                  className={`text-lg sm:text-xl md:text-2xl font-bold mb-3 transition-colors duration-500 ${
                    isActive ? "text-gray-800" : "text-gray-700"
                  }`}
                >
                  {service.title}
                </h3>

                {/* Description */}
                <p
                  className={`text-xs sm:text-sm md:text-base leading-relaxed transition-all duration-500 ${
                    isActive
                      ? "text-gray-700 opacity-100"
                      : "text-gray-600 opacity-90"
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

        {/* Progress Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
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
    </div>
  );
}

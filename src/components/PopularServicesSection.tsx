"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface PopularService {
  id: number;
  title: string;
  description: string;
  position: { top: string; left: string };
  image: string;
}

const SERVICES: PopularService[] = [
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
    image: "/images/services/implant.png",
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

export default function PopularServicesSection() {
  const [activeServiceId, setActiveServiceId] = useState<number>(1);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [isSectionActive, setIsSectionActive] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({});

  const services = SERVICES;

  const activeService =
    services.find((s) => s.id === activeServiceId) ?? services[0];

  // Only run auto-rotate / auto-centering when this section is actually on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsSectionActive(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const active = Boolean(entry?.isIntersecting) && (entry?.intersectionRatio ?? 0) >= 0.6;
        setIsSectionActive(active);
      },
      { threshold: [0, 0.6, 1] }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isMobile = useCallback(() => {
    if (typeof window === "undefined") return false;
    // Tailwind `sm:` breakpoint is 640px
    return !window.matchMedia("(min-width: 640px)").matches;
  }, []);

  const activateService = useCallback(
    (id: number) => {
      setActiveServiceId(id);
      setAnimationKey((prev) => prev + 1);

      // On mobile, ensure the pressed card becomes the one in front (centered)
      if (!isSectionActive) return;
      if (!isMobile()) return;

      requestAnimationFrame(() => {
        const el = cardRefs.current[id];
        el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      });
    },
    [isMobile, isSectionActive]
  );

  // Auto-rotate active service every 3.5 seconds
  useEffect(() => {
    if (!isSectionActive) return;

    const interval = setInterval(() => {
      setActiveServiceId((prevId) => {
        const currentIndex = services.findIndex((s) => s.id === prevId);
        const safeCurrentIndex = currentIndex < 0 ? 0 : currentIndex;
        const nextIndex = (safeCurrentIndex + 1) % services.length;
        setAnimationKey((prev) => prev + 1);
        const nextId = services[nextIndex].id;

        // Keep the active card in front on mobile while auto-rotating
        if (typeof window !== "undefined" && !window.matchMedia("(min-width: 640px)").matches) {
          requestAnimationFrame(() => {
            const el = cardRefs.current[nextId];
            el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
          });
        }

        return nextId;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isSectionActive, services]);

  return (
    <div
      ref={sectionRef}
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
          @keyframes softSwap {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.98);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .tooth-swap {
            animation: softSwap 520ms ease-out both;
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
        <div className="relative h-[calc(100%-200px)] flex flex-col px-4 sm:px-0">
          {/* Center Image (no path) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {activeService?.image && (
              <img
                key={`${activeService.id}-${animationKey}`}
                src={activeService.image}
                alt={activeService.title}
                className="tooth-swap w-40 h-40 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-[12rem] lg:h-[12rem] object-contain"
                style={{
                  filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.4))",
                }}
              />
            )}
          </div>

          {/* Cards: horizontal swipe on mobile, absolute on larger screens */}
          <div
            className="mt-auto mb-16 sm:mb-0 flex flex-row gap-3 overflow-x-auto touch-pan-x snap-x snap-mandatory scroll-smooth pb-3 sm:block sm:overflow-visible"
            dir="rtl"
          >
            {services.map((service) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  ref={(el) => {
                    cardRefs.current[service.id] = el;
                  }}
                  onClick={() => {
                    activateService(service.id);
                  }}
                  className={`group flex-none snap-center w-[85vw] max-w-sm sm:max-w-none sm:absolute p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-lg transition-all duration-700 sm:w-[40%] md:w-[30%] lg:w-[22%] ${
                    isActive
                      ? "bg-white/25 border-2 border-white/40 active-card scale-[1.02] sm:scale-105 z-20"
                      : "bg-white/10 border border-white/20 hover:bg-white/15 z-10"
                  }`}
                  style={{
                    top: service.position.top,
                    left: service.position.left,
                    boxShadow: isActive
                      ? "0 20px 60px rgba(0, 0, 0, 0.3)"
                      : "0 8px 32px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <h3
                    className={`text-base sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 transition-colors duration-500 ${
                      isActive ? "text-gray-800" : "text-gray-700"
                    }`}
                  >
                    {service.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm md:text-base leading-relaxed transition-all duration-500 ${
                      isActive
                        ? "text-gray-700 opacity-100"
                        : "text-gray-600 opacity-90"
                    }`}
                  >
                    {service.description}
                  </p>

                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-blue-400 rounded-full shadow-lg" />
                  )}

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
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                activateService(service.id);
              }}
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

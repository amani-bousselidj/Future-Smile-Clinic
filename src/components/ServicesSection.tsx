"use client";

import React, { useState } from "react";

interface Service {
  id: number;
  title: string;
  description: string;
  image?: string;
  price?: number;
}

interface ServicesSectionProps {
  services?: Service[];
  loading?: boolean;
}

export default function ServicesSection({
  services,
  loading,
}: ServicesSectionProps) {
  const [activeServiceId, setActiveServiceId] = useState<number | null>(1);

  // Dummy data for preview with images
  const dummyServices: Service[] = [
    {
      id: 1,
      title: "تبييض الأسنان",
      description:
        "احصل على ابتسامة بيضاء مشرقة باستخدام أحدث تقنيات التبييض الآمنة والفعالة. نتائج فورية ودائمة.",
      price: 15000,
      image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800",
    },
    {
      id: 2,
      title: "تقويم الأسنان",
      description:
        "تصحيح وضع الأسنان باستخدام تقنيات التقويم الشفاف أو المعدني. نتائج مضمونة مع متابعة دورية.",
      price: 80000,
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800",
    },
    {
      id: 3,
      title: "زراعة الأسنان",
      description:
        "زراعة الأسنان المفقودة بتقنية حديثة وآمنة. نستخدم أفضل الغرسات العالمية لضمان النجاح.",
      price: 120000,
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800",
    },
    {
      id: 4,
      title: "تنظيف الأسنان",
      description:
        "تنظيف عميق واحترافي للأسنان واللثة. إزالة الجير والبلاك مع تلميع الأسنان.",
      price: 5000,
      image: "https://images.unsplash.com/photo-1609619385002-f40499ef5a5c?w=800",
    },
    {
      id: 5,
      title: "علاج الجذور",
      description:
        "علاج العصب وإنقاذ الأسنان المتضررة. نستخدم أحدث التقنيات لضمان علاج خالٍ من الألم.",
      price: 25000,
      image: "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800",
    },
    {
      id: 6,
      title: "تركيبات الأسنان",
      description:
        "تركيبات ثابتة ومتحركة بجودة عالية. تيجان وجسور بمواد طبية متطورة.",
      price: 35000,
      image: "https://images.unsplash.com/photo-1606811971618-4486d9d8f37a?w=800",
    },
  ];

  // Use dummy data if no services provided
  const displayServices =
    services && services.length > 0 ? services : dummyServices;

  const activeService = displayServices?.find((s) => s.id === activeServiceId);

  if (loading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    <div
      className="h-screen w-full overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
      }}
    >
      {/* Gradient overlay matching HeroTooth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(197, 209, 214, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(197, 209, 214, 0.15) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1.5 sm:mb-2 px-2">
            خدمات شاملة لصحة فمك وأسنانك
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            نستخدم أحدث التقنيات العالمية لنمنحك ابتسامة صحية ومشرقة
          </p>
        </div>

        {/* Two Columns Layout - Responsive with proper spacing */}
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 min-h-0 overflow-hidden">
          {/* Right Side - Services List */}
          <div className="flex flex-col gap-1.5 sm:gap-2 overflow-y-auto pr-1 sm:pr-2 lg:max-h-full" style={{ maxHeight: 'calc(100vh - 240px)' }}>
            {displayServices?.map((service) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`text-right p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/90 shadow-lg scale-[1.02]"
                      : "bg-white/60 hover:bg-white/75 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {service.price && (
                        <span
                          className={`text-xs sm:text-sm font-bold ${
                            isActive ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {service.price.toLocaleString()} دج
                        </span>
                      )}
                      <svg
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${
                          isActive ? "text-gray-800 rotate-180" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                    <h3
                      className={`text-base sm:text-lg font-bold ${
                        isActive ? "text-gray-800" : "text-gray-700"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>
                  {/* Show description when active */}
                  {isActive && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1.5 sm:mt-2 text-right leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Left Side - Service Image with smooth transition */}
          <div className="hidden lg:flex flex-col gap-4">
            {activeService && (
              <>
                <div className="flex-1 relative rounded-2xl overflow-hidden shadow-2xl bg-white/50 transition-opacity duration-500">
                  {activeService.image ? (
                    <img
                      key={activeService.id}
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-full h-full object-cover transition-all duration-700 ease-in-out"
                      style={{ animation: 'fadeIn 0.5s ease-in' }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                      <div className="text-center">
                        <svg
                          className="w-20 h-20 mx-auto text-gray-300 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">صورة الخدمة</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";

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
  const [imageKey, setImageKey] = useState(0);

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

  // Trigger animation when service changes
  useEffect(() => {
    setImageKey((prev) => prev + 1);
  }, [activeServiceId]);

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
    <div
      className="h-screen w-full overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes arcUp {
            0% {
              opacity: 0;
              transform: translate(-50%, 100%) scale(0.3);
            }
            50% {
              opacity: 1;
              transform: translate(-50%, -120%) scale(1);
            }
            100% {
              opacity: 0;
              transform: translate(-50%, 100%) scale(0.3);
            }
          }
          .arc-animation {
            animation: arcUp 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `
      }} />
      
      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(197, 209, 214, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(197, 209, 214, 0.15) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            خدماتنا الطبية
          </h2>
          <p className="text-base text-gray-600">
            نقدم أفضل خدمات العناية بالأسنان
          </p>
        </div>

        {/* Two Columns Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 relative">
          {/* Right Side - Services List */}
          <div className="flex flex-col gap-2 overflow-hidden">
            {displayServices?.map((service) => {
              const isActive = activeServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`text-right p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-white/90 shadow-lg scale-[1.02]"
                      : "bg-white/60 hover:bg-white/75 shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {service.price && (
                        <span
                          className={`text-sm font-bold ${
                            isActive ? "text-gray-800" : "text-gray-600"
                          }`}
                        >
                          {service.price.toLocaleString()} دج
                        </span>
                      )}
                      <svg
                        className={`w-4 h-4 transition-transform duration-300 ${
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
                      className={`text-lg font-bold ${
                        isActive ? "text-gray-800" : "text-gray-700"
                      }`}
                    >
                      {service.title}
                    </h3>
                  </div>
                  {/* Show description when active */}
                  {isActive && (
                    <p className="text-sm text-gray-600 mt-2 text-right leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Left Side - Animated Image with Arc Path */}
          <div className="relative flex items-center justify-center">
            {activeService?.image && (
              <div
                key={imageKey}
                className="absolute left-1/2 bottom-0 w-48 h-48 arc-animation"
              >
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-white/80"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

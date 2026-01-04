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
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Dummy data for preview
  const dummyServices: Service[] = [
    {
      id: 1,
      title: "تبييض الأسنان",
      description:
        "احصل على ابتسامة بيضاء مشرقة باستخدام أحدث تقنيات التبييض الآمنة والفعالة. نتائج فورية ودائمة.",
      price: 15000,
    },
    {
      id: 2,
      title: "تقويم الأسنان",
      description:
        "تصحيح وضع الأسنان باستخدام تقنيات التقويم الشفاف أو المعدني. نتائج مضمونة مع متابعة دورية.",
      price: 80000,
    },
    {
      id: 3,
      title: "زراعة الأسنان",
      description:
        "زراعة الأسنان المفقودة بتقنية حديثة وآمنة. نستخدم أفضل الغرسات العالمية لضمان النجاح.",
      price: 120000,
    },
    {
      id: 4,
      title: "تنظيف الأسنان",
      description:
        "تنظيف عميق واحترافي للأسنان واللثة. إزالة الجير والبلاك مع تلميع الأسنان.",
      price: 5000,
    },
    {
      id: 5,
      title: "علاج الجذور",
      description:
        "علاج العصب وإنقاذ الأسنان المتضررة. نستخدم أحدث التقنيات لضمان علاج خالٍ من الألم.",
      price: 25000,
    },
    {
      id: 6,
      title: "تركيبات الأسنان",
      description:
        "تركيبات ثابتة ومتحركة بجودة عالية. تيجان وجسور بمواد طبية متطورة.",
      price: 35000,
    },
  ];

  // Use dummy data if no services provided
  const displayServices =
    services && services.length > 0 ? services : dummyServices;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center" style={{
        background: "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)"
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-full overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)"
      }}
    >
      {/* Gradient overlay matching HeroTooth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(197, 209, 214, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(197, 209, 214, 0.15) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            خدماتنا الطبية
          </h2>
          <p className="text-lg text-gray-600">
            نقدم أفضل خدمات العناية بالأسنان
          </p>
        </div>

        {/* Services Accordion */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {displayServices?.map((service) => {
            const isExpanded = expandedId === service.id;
            return (
              <div
                key={service.id}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                {/* Service Header - Clickable */}
                <button
                  onClick={() => toggleExpand(service.id)}
                  className="w-full px-5 py-4 text-right flex items-center justify-between hover:bg-gray-50/50 rounded-lg transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    {service.price && (
                      <span className="text-lg font-bold text-gray-700">
                        {service.price.toLocaleString()} دج
                      </span>
                    )}
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {service.title}
                  </h3>
                </button>

                {/* Service Details - Expandable */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-5 pb-4 pt-2 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-right">
                      {service.description}
                    </p>
                    <button className="mt-4 px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 w-full md:w-auto">
                      احجز الآن
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import Image from "next/image";

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
  const [activeServiceId, setActiveServiceId] = useState<number | null>(null);

  // Dummy data for preview
  const dummyServices: Service[] = [
    {
      id: 1,
      title: "تبييض الأسنان",
      description: "احصل على ابتسامة بيضاء مشرقة باستخدام أحدث تقنيات التبييض الآمنة والفعالة. نتائج فورية ودائمة.",
      price: 15000,
    },
    {
      id: 2,
      title: "تقويم الأسنان",
      description: "تصحيح وضع الأسنان باستخدام تقنيات التقويم الشفاف أو المعدني. نتائج مضمونة مع متابعة دورية.",
      price: 80000,
    },
    {
      id: 3,
      title: "زراعة الأسنان",
      description: "زراعة الأسنان المفقودة بتقنية حديثة وآمنة. نستخدم أفضل الغرسات العالمية لضمان النجاح.",
      price: 120000,
    },
    {
      id: 4,
      title: "تنظيف الأسنان",
      description: "تنظيف عميق واحترافي للأسنان واللثة. إزالة الجير والبلاك مع تلميع الأسنان.",
      price: 5000,
    },
    {
      id: 5,
      title: "علاج الجذور",
      description: "علاج العصب وإنقاذ الأسنان المتضررة. نستخدم أحدث التقنيات لضمان علاج خالٍ من الألم.",
      price: 25000,
    },
    {
      id: 6,
      title: "تركيبات الأسنان",
      description: "تركيبات ثابتة ومتحركة بجودة عالية. تيجان وجسور بمواد طبية متطورة.",
      price: 35000,
    },
  ];

  // Use dummy data if no services provided
  const displayServices = services && services.length > 0 ? services : dummyServices;

  // Set first service as active on mount
  React.useEffect(() => {
    if (displayServices && displayServices.length > 0 && !activeServiceId) {
      setActiveServiceId(displayServices[0].id);
    }
  }, [displayServices, activeServiceId]);

  const activeService = displayServices?.find((s) => s.id === activeServiceId);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto px-6 py-12 flex flex-col">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            خدماتنا الطبية
          </h2>
          <p className="text-lg text-gray-600">
            نقدم أفضل خدمات العناية بالأسنان
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* Services List - Left Side */}
          <div className="lg:col-span-5 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-100">
            <div className="space-y-3">
              {displayServices?.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setActiveServiceId(service.id)}
                  className={`w-full text-right p-5 rounded-2xl transition-all duration-300 ${
                    activeServiceId === service.id
                      ? "bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-xl scale-105"
                      : "bg-white text-gray-800 hover:bg-blue-50 hover:shadow-lg shadow-md"
                  }`}
                >
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p
                    className={`text-sm line-clamp-2 ${
                      activeServiceId === service.id
                        ? "text-blue-50"
                        : "text-gray-600"
                    }`}
                  >
                    {service.description}
                  </p>
                  {service.price && (
                    <div className="mt-3 text-lg font-semibold">
                      {service.price.toLocaleString()} دج
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Service Details & Image - Right Side */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {activeService ? (
              <>
                {/* Image */}
                <div className="flex-1 relative rounded-3xl overflow-hidden shadow-2xl bg-gray-100 min-h-[300px]">
                  {activeService.image ? (
                    <Image
                      src={activeService.image}
                      alt={activeService.title}
                      fill
                      className="object-cover transition-opacity duration-500"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                      <div className="text-center">
                        <svg
                          className="w-24 h-24 mx-auto text-blue-300 mb-4"
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
                        <p className="text-gray-500">لا توجد صورة</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details Card */}
                <Card className="p-6 bg-white shadow-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-right">
                    {activeService.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-right">
                    {activeService.description}
                  </p>
                  {activeService.price && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                      <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                        احجز الآن
                      </button>
                      <span className="text-2xl font-bold text-blue-600">
                        {activeService.price.toLocaleString()} دج
                      </span>
                    </div>
                  )}
                </Card>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                اختر خدمة لعرض التفاصيل
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

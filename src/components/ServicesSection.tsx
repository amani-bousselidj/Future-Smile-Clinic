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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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
  const currentIndex = displayServices.findIndex((s) => s.id === activeServiceId);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < displayServices.length - 1) {
      setActiveServiceId(displayServices[currentIndex + 1].id);
    }
    if (isRightSwipe && currentIndex > 0) {
      setActiveServiceId(displayServices[currentIndex - 1].id);
    }
  };

  const nextService = () => {
    if (currentIndex < displayServices.length - 1) {
      setActiveServiceId(displayServices[currentIndex + 1].id);
    }
  };

  const prevService = () => {
    if (currentIndex > 0) {
      setActiveServiceId(displayServices[currentIndex - 1].id);
    }
  };

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
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
          .service-card-active {
            animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

      <div className="relative z-10 h-full flex flex-col px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            خدمات شاملة لصحة فمك وأسنانك
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            نستخدم أحدث التقنيات العالمية لنمنحك ابتسامة صحية ومشرقة
          </p>
        </div>

        {/* Main Service Card with Image Background */}
        <div 
          className="flex-1 flex items-center justify-center"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {activeService && (
            <div className="w-full max-w-5xl h-full max-h-[60vh] relative service-card-active">
              {/* Large Card with Background Image */}
              <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl group">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  {activeService.image && (
                    <img
                      src={activeService.image}
                      alt={activeService.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                </div>

                {/* Content Overlay */}
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 md:p-12 text-white">
                  {/* Price Badge */}
                  {activeService.price && (
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl">
                      <div className="text-gray-800 font-bold text-xl sm:text-2xl">
                        {activeService.price.toLocaleString()} <span className="text-base">دج</span>
                      </div>
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
                    {activeService.title}
                  </h3>

                  {/* Description */}
                  <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed max-w-3xl mb-6 drop-shadow">
                    {activeService.description}
                  </p>

                  {/* CTA Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("fps:go", {
                            detail: { index: 6 },
                          })
                        );
                      }}
                      className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300"
                    >
                      <span>احجز الآن</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Dots & Arrows */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {/* Prev Button */}
          <button
            onClick={prevService}
            disabled={currentIndex === 0}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="الخدمة السابقة"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {displayServices.map((service, idx) => (
              <button
                key={service.id}
                onClick={() => setActiveServiceId(service.id)}
                className={`transition-all duration-300 rounded-full ${
                  service.id === activeServiceId
                    ? "w-12 h-3 bg-gray-800"
                    : "w-3 h-3 bg-white/60 hover:bg-white/90"
                }`}
                aria-label={`خدمة ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextService}
            disabled={currentIndex === displayServices.length - 1}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="الخدمة التالية"
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

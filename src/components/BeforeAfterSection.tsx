"use client";

import React, { useState, useRef, useEffect } from "react";

interface BeforeAfterCase {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
}

export default function BeforeAfterSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Adaptive items per page based on screen size
  const itemsPerPage = isMobile ? 4 : 5;

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

    if (isLeftSwipe && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
    if (isRightSwipe && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const cases: BeforeAfterCase[] = [
    {
      id: "141971b7-1960-45b6-881d-b4652bc3c6c7",
      title: "تبييض الأسنان",
      beforeImage: "/images/BeforeAndAfter/141971b7-1960-45b6-881d-b4652bc3c6c7Before.jpg",
      afterImage: "/images/BeforeAndAfter/141971b7-1960-45b6-881d-b4652bc3c6c7.jpg",
    },
    {
      id: "180b9a05-0b1d-4c58-a55f-02b509d17ffe",
      title: "تقويم الأسنان",
      beforeImage: "/images/BeforeAndAfter/180b9a05-0b1d-4c58-a55f-02b509d17ffeBefore.jpg",
      afterImage: "/images/BeforeAndAfter/180b9a05-0b1d-4c58-a55f-02b509d17ffe.jpg",
    },
    {
      id: "2d98ff7b-22c4-4968-867e-5d4572e3089f",
      title: "زراعة الأسنان",
      beforeImage: "/images/BeforeAndAfter/2d98ff7b-22c4-4968-867e-5d4572e3089fBefore.jpg",
      afterImage: "/images/BeforeAndAfter/2d98ff7b-22c4-4968-867e-5d4572e3089f.jpg",
    },
    {
      id: "702a397f-faf7-45b4-a2be-4bec2410198e",
      title: "ابتسامة هوليود",
      beforeImage: "/images/BeforeAndAfter/702a397f-faf7-45b4-a2be-4bec2410198eBefore.jpg",
      afterImage: "/images/BeforeAndAfter/702a397f-faf7-45b4-a2be-4bec2410198e.jpg",
    },
    {
      id: "ce57930b-f0eb-4b26-bb95-88e24676888d",
      title: "تجميل الأسنان",
      beforeImage: "/images/BeforeAndAfter/ce57930b-f0eb-4b26-bb95-88e24676888dBefore.jpg",
      afterImage: "/images/BeforeAndAfter/ce57930b-f0eb-4b26-bb95-88e24676888d.jpg",
    },
    {
      id: "fe4c0af2-d8a2-455b-82be-656a9ac174e7",
      title: "علاج اللثة",
      beforeImage: "/images/BeforeAndAfter/fe4c0af2-d8a2-455b-82be-656a9ac174e7Before.jpg",
      afterImage: "/images/BeforeAndAfter/fe4c0af2-d8a2-455b-82be-656a9ac174e7.jpg",
    },
  ];

  const totalPages = Math.ceil(cases.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const visibleCases = cases.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6 sm:mb-10 z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-800">
          نتائج قبل وبعد
        </h2>
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
          شاهد التحولات الرائعة التي حققناها لمرضانا
        </p>
        <div className="w-20 h-1 bg-blue-500 mx-auto mt-3 rounded-full" />
      </div>

      {/* Cases Grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 w-full max-w-7xl px-2 sm:px-4 z-10"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {visibleCases.map((caseItem) => (
          <BeforeAfterCard
            key={caseItem.id}
            title={caseItem.title}
            beforeImage={caseItem.beforeImage}
            afterImage={caseItem.afterImage}
          />
        ))}
      </div>

      {/* Pagination Dots */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2 mt-6 sm:mt-10 z-10">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentPage
                  ? "w-8 sm:w-10 h-2 sm:h-2.5 bg-blue-500"
                  : "w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`الصفحة ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// BeforeAfter Card Component with Interactive Slider
function BeforeAfterCard({
  title,
  beforeImage,
  afterImage,
}: {
  title: string;
  beforeImage: string;
  afterImage: string;
}) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Interactive Comparison Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[3/4] overflow-hidden cursor-ew-resize select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* After Image (Background) */}
        <img
          src={afterImage}
          alt={`${title} - بعد`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before Image (Clipped Overlay) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={beforeImage}
            alt={`${title} - قبل`}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Slider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Handle Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-blue-500 rounded-full" />
              <div className="w-0.5 h-3 bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-2 left-2 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded backdrop-blur-sm">
          قبل
        </div>
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs sm:text-sm px-2 py-1 rounded backdrop-blur-sm">
          بعد
        </div>
      </div>

      {/* Title */}
      <div className="p-2 sm:p-3 md:p-4 text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
      </div>

      {/* Decorative Corner */}
      <div className="absolute top-0 left-0 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

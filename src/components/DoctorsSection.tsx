"use client";

import React, { useState, useRef } from "react";

interface Doctor {
  id: number;
  name: string;
  role: string;
  image: string;
  link: string;
}

export default function DoctorsSection() {
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
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "د. سارة أحمد",
      role: "استشارية طب الأسنان",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=800&fit=crop",
      link: "/doctors/sarah-ahmed",
    },
    {
      id: 2,
      name: "د. مريم الخليلي",
      role: "أخصائية تقويم الأسنان",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&h=800&fit=crop",
      link: "/doctors/mariam-khalili",
    },
    {
      id: 3,
      name: "د. عمر السيد",
      role: "استشاري جراحة الفم والفكين",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&h=800&fit=crop",
      link: "/doctors/omar-elsayed",
    },
    {
      id: 4,
      name: "د. أحمد كريم",
      role: "أخصائي زراعة الأسنان",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&h=800&fit=crop",
      link: "/doctors/ahmed-karim",
    },
    {
      id: 5,
      name: "د. كريم بشير",
      role: "أخصائي تجميل الأسنان",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=600&h=800&fit=crop",
      link: "/doctors/karim-bashir",
    },
    {
      id: 6,
      name: "د. ليلى حسن",
      role: "أخصائية طب أسنان الأطفال",
      image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=600&h=800&fit=crop",
      link: "/doctors/layla-hassan",
    },
    {
      id: 7,
      name: "د. يوسف الصالح",
      role: "استشاري علاج اللثة",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600&h=800&fit=crop",
      link: "/doctors/youssef-saleh",
    },
    {
      id: 8,
      name: "د. نور الدين مراد",
      role: "أخصائي تركيبات الأسنان",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop",
      link: "/doctors/noureddine-mourad",
    },
    {
      id: 9,
      name: "د. فاطمة الزهراء",
      role: "استشارية علاج الجذور",
      image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=800&fit=crop",
      link: "/doctors/fatima-zahra",
    },
    {
      id: 10,
      name: "د. محمد علي",
      role: "أخصائي جراحة الفكين",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop",
      link: "/doctors/mohamed-ali",
    },
  ];

  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDoctors = doctors.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `
      }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(197, 209, 214, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(197, 209, 214, 0.15) 100%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 h-full flex flex-col px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            نخبة من أفضل أطباء الأسنان
          </h2>
          <p className="text-base text-gray-600">
            فريق طبي متميز بخبرات عالمية وشهادات معتمدة لخدمتكم
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center px-2 sm:px-0">
          <div 
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full max-w-6xl transition-all duration-500 ease-in-out"
            style={{ opacity: 1 }}
          >
            {currentDoctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="group relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-white/60 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fadeIn"
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'both'
                }}
              >
                {/* Link button in top-left corner */}
                <a
                  href={doctor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`عرض ملف ${doctor.name}`}
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>

                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-center filter grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 text-white">
                    <h3 className="text-sm sm:text-base font-bold mb-0.5 sm:mb-1 leading-tight">{doctor.name}</h3>
                    <p className="text-[10px] sm:text-xs opacity-90 leading-tight">{doctor.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 px-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
              aria-label="الصفحة السابقة"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex gap-1.5 sm:gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg transition-all text-sm sm:text-base font-medium ${
                    currentPage === index
                      ? "bg-gray-700 text-white shadow-lg scale-110"
                      : "bg-white/60 hover:bg-white/80 text-gray-700"
                  }`}
                  aria-label={`الصفحة ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 sm:px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-gray-700"
              aria-label="الصفحة التالية"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

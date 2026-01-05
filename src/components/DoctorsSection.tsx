"use client";

import React, { useState } from "react";

interface Doctor {
  id: number;
  name: string;
  role: string;
  image: string;
  link: string;
}

export default function DoctorsSection() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

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
            أطباؤنا وخبراؤنا
          </h2>
          <p className="text-base text-gray-600">فريق متخصص بخبرة عالية</p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentDoctors.map((doctor) => (
              <a
                key={doctor.id}
                href={doctor.link}
                className="group block relative rounded-2xl overflow-hidden shadow-lg bg-white/60 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="h-full w-full object-cover object-center filter grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <h3 className="text-base font-bold mb-1">{doctor.name}</h3>
                    <p className="text-xs opacity-90">{doctor.role}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
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

            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    currentPage === index
                      ? "bg-gray-700 text-white shadow-lg"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
              className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg shadow-md hover:bg-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
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

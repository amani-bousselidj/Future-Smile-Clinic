"use client";

import React from "react";

interface Doctor {
  id: number;
  name: string;
  role: string;
  image: string;
  link: string;
}

export default function DoctorsSection() {
  const doctors: Doctor[] = [
    {
      id: 1,
      name: "د. سامي بلحسن",
      role: "استشاري زراعة أسنان",
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=900",
      link: "#doctor-1",
    },
    {
      id: 2,
      name: "د. مريم بوزيد",
      role: "تقويم الأسنان الشفاف",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
      link: "#doctor-2",
    },
    {
      id: 3,
      name: "د. كريم شريف",
      role: "جراحة وجه وفكين",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900",
      link: "#doctor-3",
    },
    {
      id: 4,
      name: "د. ليلى حمدي",
      role: "تجميل الأسنان والابتسامة",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
      link: "#doctor-4",
    },
    {
      id: 5,
      name: "د. أنس بوشيخي",
      role: "علاج جذور وأعصاب",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=900",
      link: "#doctor-5",
    },
    {
      id: 6,
      name: "د. سارة زروقي",
      role: "طب أسنان الأطفال",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900",
      link: "#doctor-6",
    },
  ];

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

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-0">
          {doctors.map((doctor) => (
            <a
              key={doctor.id}
              href={doctor.link}
              className="group relative rounded-2xl overflow-hidden shadow-lg bg-white/60 backdrop-blur-sm transition-transform duration-500 hover:scale-105"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="h-full w-full object-cover filter grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <h3 className="text-lg font-bold">{doctor.name}</h3>
                  <p className="text-sm opacity-90">{doctor.role}</p>
                  <span className="text-xs underline opacity-80">تفاصيل الطبيب</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

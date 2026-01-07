/**
 * About Page - Redesigned to match main site style
 */
"use client";

import React from "react";

export default function AboutPage() {
  const statistics = [
    { number: "1350+", label: "مرضى راضون" },
    { number: "94%", label: "عملاء يأتون بالتوصية" },
    { number: "13+", label: "سنوات من الخبرة" },
    { number: "10+", label: "أطباء متخصصون" },
  ];

  const values = [
    {
      title: "التميز",
      description: "نسعى دائماً لتقديم أعلى مستويات الجودة في كل خدماتنا الطبية والعناية بكل تفاصيل علاج مرضانا",
    },
    {
      title: "الاحترافية",
      description: "فريق طبي مؤهل بخبرات عالمية وشهادات معتمدة يضمن تقديم أفضل مستوى من الخدمات الطبية",
    },
    {
      title: "الابتكار",
      description: "نستخدم أحدث التقنيات والأجهزة الطبية المتطورة لضمان نتائج دقيقة وفعالة",
    },
    {
      title: "الرعاية",
      description: "نهتم براحة وسلامة مرضانا في كل خطوة من رحلتهم العلاجية ونوفر بيئة آمنة ومريحة",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section with gradient background */}
      <div
        className="relative overflow-hidden py-20 sm:py-32"
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
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              عيادة ابتسامة المستقبل
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              رحلتنا بدأت من شغف حقيقي بتقديم رعاية أسنان استثنائية تجمع بين الخبرة
              العالمية والتقنيات الحديثة في بيئة مريحة وآمنة
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              فلسفتنا
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              نؤمن بأن الابتسامة الصحية هي مفتاح الثقة والسعادة. نعمل على تحقيق
              هذا الهدف من خلال تقديم رعاية شخصية تراعي احتياجات كل مريض
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/70 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/40"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-base">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center">
            رحلتنا عبر السنوات
          </h2>

          <div className="space-y-8">
            {[
              {
                year: "2010",
                title: "التأسيس",
                description:
                  "بدأنا بفريق صغير ورؤية كبيرة: تقديم رعاية أسنان تتجاوز التوقعات",
              },
              {
                year: "2015",
                title: "التوسع",
                description:
                  "افتتاح فرع ثانٍ وإضافة أحدث الأجهزة الطبية والتقنيات المتطورة",
              },
              {
                year: "2018",
                title: "الرقمنة",
                description:
                  "إطلاق نظام الحجز الإلكتروني والاستشارات عن بُعد لراحة مرضانا",
              },
              {
                year: "2023",
                title: "الاعتماد الدولي",
                description:
                  "حصلنا على شهادات الجودة الدولية وتوسعنا في الخدمات المتخصصة",
              },
            ].map((milestone, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <div className="text-4xl sm:text-5xl font-bold text-gray-800">
                      {milestone.year}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-12 text-center">
            إنجازاتنا بالأرقام
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-white/60 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-gray-800 mb-2">
                    {stat.number}
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div
        className="py-16 sm:py-24"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #c5d1d6 30%, #c5d1d6 70%, #ffffff 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-md bg-white/70 rounded-3xl p-8 sm:p-12 shadow-2xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
              رسالتنا
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
              نلتزم بتوفير رعاية أسنان متميزة تجمع بين الخبرة الطبية العالية
              والتكنولوجيا المتطورة، مع التركيز على راحة المريض وتحقيق نتائج تدوم
              طويلاً. هدفنا أن نكون شريكك الموثوق في رحلتك نحو ابتسامة صحية
              وجميلة.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

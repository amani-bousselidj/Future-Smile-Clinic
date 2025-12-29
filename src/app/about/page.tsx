/**
 * About Page - Arabic Version
 */
"use client";

import React from "react";
import { Card } from "@/components/Card";
import { useFetch } from "@/lib/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
  bio?: string;
  photo?: string;
}

export default function AboutPage() {
  const { data: response, loading } = useFetch<{ results: Doctor[] }>(
    "/api/doctors/"
  );
  const doctors = response?.results || [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">عن عيادة ابتسامة المستقبل</h1>
          <p className="text-xl text-blue-100">
            متخصصون في رعاية الأسنان برعاية واحترافية عالية منذ عام 2010
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card shadow="md" className="hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">رسالتنا</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              تقديم رعاية أسنان استثنائية تحسن صحة أسناننا وسلامتنا العامة. نحن ملتزمون باستخدام أحدث التقنيات والأساليب لتحقيق نتائج رائعة في بيئة مريحة وحانية.
            </p>
          </Card>

          <Card shadow="md" className="hover:shadow-lg transition-shadow">
            <div className="text-blue-600 text-4xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">رؤيتنا</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              أن نكون العيادة السنية الموثوقة بالمنطقة، معروفة بخبرتنا وعطفنا والتزامنا برضا المريض. نسعى لجعل رعاية الأسنان الجودة في متناول الجميع.
            </p>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">قيمنا الأساسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: "التميز",
                icon: "⭐",
                desc: "أعلى المعايير في كل ما نقوم به",
              },
              {
                title: "النزاهة",
                icon: "🤝",
                desc: "ممارسات صادقة وأخلاقية",
              },
              { title: "الرحمة", icon: "❤️", desc: "رعاية موجهة للمريض" },
              {
                title: "الابتكار",
                icon: "🔬",
                desc: "أحدث التقنيات والأساليب",
              },
            ].map((value, index) => (
              <Card key={index} shadow="sm" className="hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-base">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">فريقنا الخبير</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : doctors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {doctors.map((doctor) => (
                <Card key={doctor.id} shadow="md" className="hover:shadow-xl transition-shadow">
                  {doctor.photo && (
                    <img
                      src={doctor.photo}
                      alt={`د. ${doctor.first_name} ${doctor.last_name}`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    د. {doctor.first_name} {doctor.last_name}
                  </h3>
                  <p className="text-blue-600 font-bold mb-3 text-lg">
                    {doctor.specialization}
                  </p>
                  {doctor.bio && <p className="text-gray-600 text-base">{doctor.bio}</p>}
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600 text-lg">لا توجد أعضاء فريق متاحين حالياً</p>
          )}
        </div>

        {/* History */}
        <Card shadow="md" className="bg-gradient-to-r from-blue-50 to-indigo-50 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900">رحلتنا</h2>
          <div className="space-y-5 text-gray-700 text-lg">
            <p>
              <strong className="text-blue-600">2010:</strong> تأسست عيادة ابتسامة المستقبل برؤية لإحداث ثورة في رعاية الأسنان بالمجتمع.
            </p>
            <p>
              <strong className="text-blue-600">2015:</strong> توسعنا بمرافق حديثة متطورة وإضافة متخصصين جدد لفريقنا.
            </p>
            <p>
              <strong className="text-blue-600">2018:</strong> أطلقنا مبادرة التحول الرقمي، بما في ذلك حجز المواعيد عبر الإنترنت والاستشارات الطبية عن بعد.
            </p>
            <p>
              <strong className="text-blue-600">2023:</strong> حققنا الاعتماد كعيادة سنية رائدة وتوسعنا في خدماتنا لخدمة المزيد من المرضى.
            </p>
            <p>
              <strong className="text-blue-600">2024:</strong> طبقنا التشخيص الذكي المتقدم وأطلقنا منصة الصحة الرقمية الشاملة.
            </p>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { number: "14+", label: "سنة خبرة" },
            { number: "10K+", label: "مريض سعيد" },
            { number: "20+", label: "متخصص" },
            { number: "1000+", label: "عملية شهرياً" },
          ].map((stat, index) => (
            <Card key={index} shadow="sm" className="text-center hover:shadow-md transition-shadow">
              <div className="text-5xl font-bold text-blue-600 mb-3">
                {stat.number}
              </div>
              <div className="text-gray-700 font-semibold text-lg">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

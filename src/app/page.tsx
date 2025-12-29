/**
 * Home Page - Main landing page (Arabic Version)
 */
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useFetch } from "@/lib/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Service {
  id: number;
  name: string;
  description: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  image_url?: string;
}

export default function HomePage() {
  const { data: services, loading } = useFetch<{ results: Service[] }>(
    "/api/services/?is_active=true"
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            مرحباً بك في عيادة ابتسامة المستقبل
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            رعاية أسنان احترافية بأحدث التكنولوجيا وأطباء متخصصين وذوي خبرة
            عالية. ابتسامتك المثالية على بعد موعد واحد فقط
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/appointments">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                حجز موعد الآن
              </Button>
            </Link>
            <Link href="/services">
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-white hover:bg-blue-700"
              >
                عرض الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-gray-900">
              خدماتنا المتميزة
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              نقدم مجموعة شاملة من الخدمات السنية المتخصصة لتلبية جميع احتياجاتك
              الصحية
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : services?.results && services.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.results.slice(0, 6).map((service) => (
                <Card
                  key={service.id}
                  shadow="md"
                  className="hover:shadow-xl transition-shadow"
                >
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-600 font-bold text-lg">
                      {service.price_min} - {service.price_max} ريال
                    </span>
                    <span className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded">
                      {service.duration_minutes} دقيقة
                    </span>
                  </div>
                  <Link href="/appointments">
                    <Button fullWidth className="bg-blue-600 hover:bg-blue-700">
                      احجز الآن
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              لا توجد خدمات متاحة حالياً
            </p>
          )}

          <div className="text-center mt-16">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                عرض جميع الخدمات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-gray-900">
              لماذا تختار عيادتنا
            </h2>
            <p className="text-gray-600 text-lg">
              أفضل خدمات طب الأسنان في المنطقة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚙️",
                title: "تكنولوجيا حديثة",
                description: "أحدث الأجهزة الطبية لضمان أفضل النتائج",
              },
              {
                icon: "🩺",
                title: "أطباء متخصصون",
                description: "فريق من الأطباء المؤهلين وذوي الخبرة العالية",
              },
              {
                icon: "📅",
                title: "حجز سهل",
                description: "نظام حجز مرن وسريل وسهل الاستخدام",
              },
              {
                icon: "💰",
                title: "أسعار مناسبة",
                description: "خيارات دفع متعددة وأسعار مخفضة",
              },
              {
                icon: "❤️",
                title: "راحة المريض",
                description: "بيئة آمنة ومريحة وودية للغاية",
              },
              {
                icon: "📱",
                title: "دعم 24/7",
                description: "خدمة عملاء متوفرة على مدار الساعة",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                shadow="sm"
                className="hover:shadow-lg transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 text-gray-900">
              تقييمات المرضى
            </h2>
            <p className="text-gray-600 text-lg">اسمع من مرضانا الراضين</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد محمد",
                text: "خدمة ممتازة وأطباء محترفون جداً. شعرت براحة كاملة خلال العملية",
              },
              {
                name: "سارة علي",
                text: "أفضل عيادة أسنان زرتها. جودة عالية وأسعار عادلة وفريق رائع",
              },
              {
                name: "محمود حسن",
                text: "رضا تام عن الخدمات المقدمة والطاقم الطبي المميز والاحترافي",
              },
            ].map((testimonial, index) => (
              <Card
                key={index}
                shadow="md"
                className="bg-gradient-to-b from-blue-50 to-white"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg text-gray-900">
                    {testimonial.name}
                  </h4>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-l from-blue-600 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-pattern"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl font-bold mb-6">هل أنت مستعد للبدء؟</h2>
          <p className="text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            احجز موعدك اليوم وجرب الفرق الذي تحدثه رعايتنا الاحترافية
          </p>
          <Link href="/appointments">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-3 text-lg"
            >
              احجز موعدك الآن
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

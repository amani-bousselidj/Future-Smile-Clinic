/**
 * Home Page - Main landing page (Arabic Version)
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useFetch } from "@/lib/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LoadingSplash } from "@/components/LoadingSplash";
import { Header } from "@/components/Header";
import { FullPageScroller } from "@/components/FullPageScroller";
import { Footer } from "@/components/Footer";
import HeroTooth from "@/components/HeroTooth";

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
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { data: services, loading } = useFetch<{ results: Service[] }>(
    "/api/services/?is_active=true"
  );

  return (
    <>
      {!loadingComplete && (
        <LoadingSplash onComplete={() => setLoadingComplete(true)} />
      )}
      <Header onLoadingComplete={loadingComplete} />
      <FullPageScroller enabled={loadingComplete} scrollableSlideIndex={-1}>
        <HeroTooth loadingComplete={loadingComplete} />
        <div
          className="w-full h-screen overflow-hidden overflow-x-hidden transition-opacity duration-500"
          style={{
            backgroundColor: "#F8F9FA",
            opacity: loadingComplete ? 1 : 0,
          }}
        >
          {/* Hero Section - Premium Presentation Style */}
          <section className="relative min-h-screen bg-white overflow-hidden flex items-center">
            {/* Decorative Elements - Minimal & Premium */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-50/40 to-transparent rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-green-50/30 to-transparent rounded-full translate-y-1/2 -translate-x-1/3"></div>

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.015]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(0,0,0,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.03) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>

            <div className="max-w-[1400px] mx-auto px-8 sm:px-12 lg:px-16 relative z-10 w-full py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                {/* Right Side - Content (Takes 6 columns) */}
                <div className="lg:col-span-6 text-right space-y-8">
                  {/* Premium Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200/50 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">
                      عيادة أسنان بريميوم
                    </span>
                  </div>

                  {/* Main Heading - Extra Large */}
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                      <span className="block text-gray-900">ابتسامتك</span>
                      <span className="block bg-gradient-to-l from-blue-600 via-green-500 to-blue-600 bg-clip-text text-transparent mt-2">
                        تستحق الأفضل
                      </span>
                    </h1>

                    {/* Decorative Line */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
                      <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-transparent rounded-full"></div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light">
                    رعاية استثنائية لأسنانك مع أحدث التقنيات الطبية وفريق من
                    أمهر الأطباء المتخصصين
                  </p>

                  {/* Stats - Premium Style */}
                  <div className="grid grid-cols-3 gap-6 py-6 max-w-2xl">
                    <div className="text-center space-y-1">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-600 to-green-500 bg-clip-text text-transparent">
                        14+
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        سنة خبرة
                      </div>
                    </div>
                    <div className="text-center space-y-1 border-x border-gray-200">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-green-500 to-blue-600 bg-clip-text text-transparent">
                        10K+
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        عميل سعيد
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-br from-blue-600 to-green-500 bg-clip-text text-transparent">
                        99%
                      </div>
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        رضا العملاء
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons - Premium */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/appointments">
                      <Button
                        size="lg"
                        className="group relative bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-10 py-5 font-bold shadow-xl hover:shadow-2xl transition-all duration-500 text-lg overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          احجز استشارة مجانية
                          <svg
                            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      </Button>
                    </Link>

                    <Link href="/services">
                      <Button
                        size="lg"
                        className="group bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-10 py-5 font-bold transition-all duration-300 text-lg"
                      >
                        <span className="flex items-center justify-center gap-3">
                          عرض الخدمات
                          <svg
                            className="w-5 h-5 group-hover:rotate-45 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </span>
                      </Button>
                    </Link>
                  </div>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap items-center gap-6 pt-4">
                    {[
                      { icon: "✓", text: "معتمد دولياً" },
                      { icon: "✓", text: "ضمان مدى الحياة" },
                      { icon: "✓", text: "فريق محترف" },
                    ].map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {badge.icon}
                        </div>
                        <span className="text-sm font-semibold text-gray-600">
                          {badge.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Left Side - Premium Image (Takes 6 columns) */}
                <div className="lg:col-span-6 relative order-first lg:order-last">
                  <div className="relative">
                    {/* Main Image Container */}
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl">
                      <div className="aspect-[4/5] relative">
                        <img
                          src="/images/clinic-hero.png"
                          alt="عيادة ابتسامة المستقبل"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&h=1100&fit=crop";
                          }}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                      </div>
                    </div>

                    {/* Floating Card - Top Right */}
                    <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-black">
                          ⭐
                        </div>
                        <div>
                          <div className="text-3xl font-black text-gray-900">
                            4.9
                          </div>
                          <div className="text-xs text-gray-500 font-semibold">
                            من 1,247 تقييم
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Floating Card - Bottom Left */}
                    <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-blue-600 to-green-500 rounded-2xl p-6 shadow-2xl text-white">
                      <div className="flex items-center gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-semibold opacity-90">
                            تكنولوجيا متقدمة
                          </div>
                          <div className="text-2xl font-black">100%</div>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Decorative Circle */}
                    <div
                      data-hero-circle
                      className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-blue-100/30 to-green-100/30 rounded-full blur-3xl"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll Indicator - Minimal */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2">
                <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          </section>
        </div>
        {/* Services Section - Enhanced */}
        <section
          className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative"
          style={{ opacity: loadingComplete ? 1 : 0 }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-30"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider">
                  خدماتنا المميزة
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
                حلول شاملة لصحة
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  أسنانك وابتسامتك
                </span>
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                نقدم مجموعة واسعة من الخدمات الطبية المتخصصة باستخدام أحدث
                التقنيات والمعدات الطبية العالمية
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="relative">
                  <LoadingSpinner />
                  <p className="mt-4 text-gray-600 text-center">
                    جاري تحميل الخدمات...
                  </p>
                </div>
              </div>
            ) : services?.results && services.results.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {services.results.slice(0, 6).map((service, index) => (
                    <div
                      key={service.id}
                      className="group relative"
                      style={{
                        animation: `fade-in-up 0.6s ease-out ${
                          index * 0.1
                        }s both`,
                      }}
                    >
                      <Card
                        shadow="md"
                        className="h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500 overflow-hidden bg-white"
                      >
                        {/* Service Image */}
                        {service.image_url && (
                          <div className="relative overflow-hidden rounded-xl mb-6 h-56">
                            <img
                              src={service.image_url}
                              alt={service.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        )}

                        {/* Service Content */}
                        <div className="space-y-4">
                          <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                            {service.name}
                          </h3>

                          <p className="text-gray-600 leading-relaxed line-clamp-2">
                            {service.description}
                          </p>

                          {/* Service Details */}
                          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                {service.price_min} - {service.price_max}
                              </span>
                              <span className="text-sm text-gray-500">
                                ريال
                              </span>
                            </div>
                            <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-bold flex items-center gap-2">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              {service.duration_minutes} دقيقة
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Link href="/appointments">
                            <Button
                              fullWidth
                              className="group/btn bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              <span className="flex items-center justify-center gap-2">
                                احجز الآن
                                <span className="group-hover/btn:translate-x-1 transition-transform">
                                  ←
                                </span>
                              </span>
                            </Button>
                          </Link>
                        </div>
                      </Card>

                      {/* Corner Badge */}
                      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg transform rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500">
                        ⭐
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Services CTA */}
                <div className="text-center mt-16">
                  <Link href="/services">
                    <Button
                      size="lg"
                      className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
                    >
                      <span className="flex items-center gap-3">
                        عرض جميع الخدمات
                        <svg
                          className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block p-8 bg-gray-50 rounded-2xl">
                  <p className="text-gray-600 text-lg">
                    لا توجد خدمات متاحة حالياً
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section
          className="py-24 bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden"
          style={{ opacity: loadingComplete ? 1 : 0 }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wider border border-white/20">
                  لماذا نحن الأفضل
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-white">
                مميزات تجعلنا
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                  الخيار الأمثل لك
                </span>
              </h2>
              <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                نجمع بين الخبرة الطويلة والتقنيات الحديثة لنقدم لك أفضل تجربة
                علاجية
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  ),
                  title: "تكنولوجيا حديثة",
                  description: "أحدث الأجهزة الطبية لضمان أفضل النتائج",
                  gradient: "from-blue-500 to-cyan-500",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  ),
                  title: "أطباء متخصصون",
                  description: "فريق من الأطباء المؤهلين وذوي الخبرة العالية",
                  gradient: "from-indigo-500 to-purple-500",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "حجز سهل",
                  description: "نظام حجز مرن وسريع وسهل الاستخدام",
                  gradient: "from-purple-500 to-pink-500",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                  title: "أسعار مناسبة",
                  description: "خيارات دفع متعددة وأسعار مخفضة",
                  gradient: "from-pink-500 to-rose-500",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  ),
                  title: "راحة المريض",
                  description: "بيئة آمنة ومريحة وودية للغاية",
                  gradient: "from-rose-500 to-orange-500",
                },
                {
                  icon: (
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  ),
                  title: "دعم 24/7",
                  description: "خدمة عملاء متوفرة على مدار الساعة",
                  gradient: "from-orange-500 to-yellow-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `fade-in-up 0.6s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="h-full p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl">
                    {/* Icon Container */}
                    <div className="relative inline-block mb-6">
                      <div
                        className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
                      >
                        {feature.icon}
                      </div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity`}
                      ></div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-black text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Indicator */}
                    <div className="mt-6 flex items-center gap-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-bold">اعرف المزيد</span>
                      <svg
                        className="w-4 h-4 group-hover:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity -z-10`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Bottom Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "مريض راضٍ" },
                { number: "20+", label: "طبيب متخصص" },
                { number: "14+", label: "سنة خبرة" },
                { number: "99%", label: "نسبة الرضا" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm font-bold">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wave Separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-24 fill-white"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Testimonials Section - Enhanced */}
        <section
          className="py-24 bg-gradient-to-b from-white to-gray-50 relative"
          style={{ opacity: loadingComplete ? 1 : 0 }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-20"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-4">
                <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-bold uppercase tracking-wider">
                  آراء عملائنا
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
                ماذا يقول
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  مرضانا عنا
                </span>
              </h2>
              <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
                رضا عملائنا هو أولويتنا، اقرأ تجاربهم الحقيقية معنا
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "أحمد محمد",
                  role: "مريض منذ 2020",
                  text: "خدمة ممتازة وأطباء محترفون جداً. شعرت براحة كاملة خلال العملية. النتائج تجاوزت كل توقعاتي والفريق كان متعاوناً للغاية.",
                  avatar: "A",
                  rating: 5,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  name: "سارة علي",
                  role: "مريضة منذ 2019",
                  text: "أفضل عيادة أسنان زرتها. جودة عالية وأسعار عادلة وفريق رائع. أنصح الجميع بزيارة عيادة المستقبل للحصول على أفضل رعاية.",
                  avatar: "س",
                  rating: 5,
                  color: "from-indigo-500 to-purple-500",
                },
                {
                  name: "محمود حسن",
                  role: "مريض منذ 2021",
                  text: "رضا تام عن الخدمات المقدمة والطاقم الطبي المميز والاحترافي. التعامل راقي والنظافة ممتازة. سأعود بالتأكيد لإجراء باقي العلاجات.",
                  avatar: "م",
                  rating: 5,
                  color: "from-purple-500 to-pink-500",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group relative"
                  style={{
                    animation: `fade-in-up 0.6s ease-out ${index * 0.15}s both`,
                  }}
                >
                  <Card
                    shadow="md"
                    className="h-full p-8 bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500"
                  >
                    {/* Quote Icon */}
                    <div className="absolute top-6 left-6 text-6xl text-blue-100 font-serif leading-none">
                      "
                    </div>

                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-4 relative z-10">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-6 h-6 text-yellow-400 transform group-hover:scale-110 transition-transform"
                          style={{ transitionDelay: `${i * 50}ms` }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-gray-700 leading-relaxed mb-6 relative z-10 text-lg">
                      "{testimonial.text}"
                    </p>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pt-6 border-t-2 border-gray-100 relative z-10">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${testimonial.color} rounded-full flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-500 text-sm">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>

                    {/* Verified Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      موثق
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            {/* Overall Rating */}
            <div className="text-center">
              <div className="inline-block p-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-blue-200">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <span className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    4.9
                  </span>
                  <div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-8 h-8 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 font-bold mt-1">
                      من 1,247 تقييم
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 font-bold text-lg">
                  تقييم ممتاز على جميع المنصات
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 py-24"
          style={{ opacity: loadingComplete ? 1 : 0 }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${
                  3 + Math.random() * 4
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              {/* Badge */}
              <div className="inline-block mb-6">
                <div className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-bold uppercase tracking-wider border border-white/30 flex items-center gap-2">
                  <span className="animate-pulse">🎯</span>
                  عرض محدود
                </div>
              </div>

              {/* Main Heading */}
              <h2 className="text-5xl md:text-7xl font-black mb-6 text-white leading-tight">
                ابتسامتك الجديدة
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-400">
                  تبدأ من هنا
                </span>
              </h2>

              {/* Subheading */}
              <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                احجز موعدك اليوم واحصل على استشارة مجانية + خصم 20% على أول جلسة
                علاجية
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                <Link href="/appointments">
                  <Button
                    size="lg"
                    className="group bg-white text-blue-600 hover:bg-gray-100 px-12 py-5 text-xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      احجز موعدك الآن
                      <svg
                        className="w-6 h-6 group-hover:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <Link href="/contact">
                  <Button
                    size="lg"
                    className="group bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 px-12 py-5 text-xl font-black border-2 border-white/30 shadow-2xl transform hover:scale-110 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      تواصل معنا
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: "✓", text: "استشارة مجانية" },
                  { icon: "✓", text: "خصم 20% للجدد" },
                  { icon: "✓", text: "إلغاء مجاني" },
                  { icon: "✓", text: "ضمان الجودة" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                    style={{
                      animation: `fade-in-up 0.6s ease-out ${
                        index * 0.1
                      }s both`,
                    }}
                  >
                    <span className="text-3xl text-green-300">{item.icon}</span>
                    <span className="text-white font-bold">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Urgency Text */}
              <div className="mt-12">
                <p className="text-white/80 text-lg font-bold flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6 animate-pulse text-yellow-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  العرض ساري لفترة محدودة - احجز الآن قبل انتهاء العرض
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              className="w-full h-24 fill-gray-50"
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
            >
              <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
            </svg>
          </div>
        </section>

        {/* Footer (Last Slide) */}
        <div
          className="h-full flex flex-col justify-end bg-gray-50"
          style={{ opacity: loadingComplete ? 1 : 0 }}
        >
          <Footer />
        </div>
      </FullPageScroller>
    </>
  );
}

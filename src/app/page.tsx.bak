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
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section - Bold & Modern */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-bl from-cyan-500/10 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left Side - Image */}
            <div className="relative group order-2 lg:order-1 hidden lg:block">
              <div className="absolute -inset-8 bg-gradient-to-br from-blue-600/30 to-indigo-600/30 rounded-3xl blur-2xl transition-all duration-500 group-hover:from-blue-600/50 group-hover:to-indigo-600/50"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 to-transparent z-10"></div>
                <img
                  src="/images/clinic-hero.jpg"
                  alt="عيادة ابتسامة المستقبل"
                  className="w-full h-[650px] object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&h=800&fit=crop";
                  }}
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-600">99%</div>
                    <div className="text-xs text-gray-600 mt-1">نسبة الرضا</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-600">10K+</div>
                    <div className="text-xs text-gray-600 mt-1">مريض</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="text-right order-1 lg:order-2">
              <div className="inline-block mb-6">
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm font-bold backdrop-blur-sm">
                  الاختيار الأول في المنطقة
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-6xl font-black mb-6 leading-tight text-white">
                <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400">
                  ابتسامتك
                </span>
                <span className="block text-white">
                  المثالية انتظرتك
                </span>
              </h1>

              <div className="w-32 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-8"></div>

              <p className="text-xl text-blue-200 mb-4 leading-relaxed font-medium">
                رعاية أسنان احترافية من الجيل التالي
              </p>

              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-lg">
                فريق عملنا يجمع بين الخبرة العميقة والتقنيات الحديثة لتحويل ابتسامتك إلى حقيقة
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/appointments">
                  <Button
                    size="lg"
                    className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-10 py-4 font-bold shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 w-full sm:w-auto text-center"
                  >
                    <span className="flex items-center justify-center gap-3">
                      احجز استشارتك المجانية
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </Button>
                </Link>

                <Link href="/services">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="group border-2 border-blue-400 text-blue-300 hover:bg-blue-500/20 px-10 py-4 font-bold transition-all duration-300 w-full sm:w-auto text-center"
                  >
                    <span className="flex items-center justify-center gap-2">
                      اكتشف الخدمات
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3 pt-8 border-t border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  <span className="text-blue-200">14+ سنة من الخبرة والتميز</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  <span className="text-blue-200">20+ طبيب متخصص ومعتمد</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  <span className="text-blue-200">أحدث تقنيات طب الأسنان</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-blue-300 animate-bounce">
            <span className="text-xs font-medium">استكشف المزيد</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

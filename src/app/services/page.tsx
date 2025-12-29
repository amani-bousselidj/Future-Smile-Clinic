"use client";

import { useState } from "react";
import { Card, Button } from "@/components";
import { useFetch } from "@/lib/hooks";
import { Service } from "@/types";
import Link from "next/link";

export default function ServicesPage() {
  const {
    data: services,
    loading,
    error,
  } = useFetch<Service[]>("/api/services/");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "جميع الخدمات" },
    { id: "dental", label: "طب الأسنان العام" },
    { id: "cosmetic", label: "تجميل الأسنان" },
    { id: "orthodontic", label: "تقويم الأسنان" },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services?.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-3">خدماتنا المتخصصة</h1>
          <p className="text-xl text-blue-100">
            رعاية أسنان شاملة بأفضل التقنيات والأطباء المتخصصين
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            فئات الخدمات
          </h2>
          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-600 hover:shadow-md"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block">
              <div className="animate-spin">
                <p className="text-gray-600 text-lg">جاري تحميل الخدمات...</p>
              </div>
            </div>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-2 border-red-300 text-center py-8">
            <p className="text-red-700 text-lg">
              عذراً، لم نتمكن من تحميل الخدمات
            </p>
          </Card>
        ) : filteredServices && filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-2xl transition-all duration-300 group cursor-pointer transform hover:-translate-y-1 bg-gradient-to-b from-white to-gray-50"
              >
                {service.image_url && (
                  <div className="mb-6 h-48 bg-gradient-to-b from-blue-100 to-blue-50 rounded-lg overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-base mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-lg">
                  <p className="text-base text-gray-700">
                    <span className="font-bold text-blue-600">المدة:</span>{" "}
                    {service.duration_minutes} دقيقة
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {service.price_min} - {service.price_max} ريال
                  </p>
                </div>
                <Link href="/appointments">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 text-lg">
                    احجز الآن
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
            <p className="text-gray-600 text-lg">لا توجد خدمات متاحة حالياً</p>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  treatment_type: string;
  treatment_type_display: string;
  before_image: string;
  after_image: string;
  patient_age?: number;
  treatment_duration?: string;
  is_featured: boolean;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showBefore, setShowBefore] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  useEffect(() => {
    if (selectedFilter === "all") {
      setFilteredGallery(gallery);
    } else if (selectedFilter === "featured") {
      setFilteredGallery(gallery.filter((item) => item.is_featured));
    } else {
      setFilteredGallery(
        gallery.filter((item) => item.treatment_type === selectedFilter)
      );
    }
  }, [selectedFilter, gallery]);

  const fetchGallery = async () => {
    try {
      const response = await fetch("https://future-smile-clinic-production.up.railway.app/api/gallery/");
      const data = await response.json();
      setGallery(data.results || data);
      setFilteredGallery(data.results || data);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: "all", label: "الكل" },
    { value: "featured", label: "المميزة" },
    { value: "whitening", label: "تبييض الأسنان" },
    { value: "veneers", label: "القشور" },
    { value: "implants", label: "زراعة الأسنان" },
    { value: "orthodontics", label: "تقويم الأسنان" },
    { value: "cosmetic", label: "تجميل الأسنان" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              معرض نتائجنا
            </h1>
            <p className="text-xl max-w-3xl mx-auto">
              شاهد التحولات المذهلة لمرضانا - صور حقيقية قبل وبعد العلاج
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedFilter === filter.value
                    ? "bg-primary text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {filteredGallery.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                لا توجد صور لهذه الفئة حالياً
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGallery.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                >
                  {/* Before/After Slider */}
                  <div className="relative h-64 group">
                    <div className="absolute inset-0 flex">
                      <div className="w-1/2 relative overflow-hidden">
                        <Image
                          src={item.before_image}
                          alt={`${item.title} - قبل`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          قبل
                        </div>
                      </div>
                      <div className="w-1/2 relative overflow-hidden">
                        <Image
                          src={item.after_image}
                          alt={`${item.title} - بعد`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          بعد
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all" />
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-primary font-medium mb-3">
                      {item.treatment_type_display}
                    </p>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {item.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      {item.patient_age && (
                        <span>العمر: {item.patient_age} سنة</span>
                      )}
                      {item.treatment_duration && (
                        <span>المدة: {item.treatment_duration}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedImage.title}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            {/* Image Comparison */}
            <div className="relative h-96 bg-gray-100">
              <Image
                src={
                  showBefore
                    ? selectedImage.before_image
                    : selectedImage.after_image
                }
                alt={selectedImage.title}
                fill
                className="object-contain"
                unoptimized
              />
              <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-full font-bold">
                {showBefore ? "قبل" : "بعد"}
              </div>
            </div>

            {/* Toggle Button */}
            <div className="p-6 bg-gray-50">
              <button
                onClick={() => setShowBefore(!showBefore)}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                {showBefore ? (
                  <>
                    عرض صورة بعد
                    <FaChevronLeft />
                  </>
                ) : (
                  <>
                    <FaChevronRight />
                    عرض صورة قبل
                  </>
                )}
              </button>

              <div className="mt-6">
                <p className="text-gray-600 mb-4">
                  {selectedImage.description}
                </p>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span className="font-medium">
                    العلاج: {selectedImage.treatment_type_display}
                  </span>
                  {selectedImage.patient_age && (
                    <span>العمر: {selectedImage.patient_age} سنة</span>
                  )}
                  {selectedImage.treatment_duration && (
                    <span>المدة: {selectedImage.treatment_duration}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

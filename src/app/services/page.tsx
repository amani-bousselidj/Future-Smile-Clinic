"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCheck, FaSpinner } from "react-icons/fa";
import { servicesAPI } from "@/lib/api";

const oldServices = [
  {
    id: 1,
    title: "تبييض الأسنان",
    shortDesc: "احصل على ابتسامة بيضاء ناصعة في جلسة واحدة",
    image:
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
    price: "15,000 دج",
    duration: "ساعة واحدة",
    fullDesc:
      "تبييض الأسنان الاحترافي باستخدام أحدث التقنيات الآمنة والفعالة. نستخدم مواد عالية الجودة معتمدة دوليًا لضمان نتائج مذهلة دون الإضرار بمينا الأسنان.",
    features: [
      "تبييض فوري بنتائج ملحوظة من الجلسة الأولى",
      "استخدام تقنية LED الحديثة",
      "مواد آمنة ومعتمدة من FDA",
      "نتائج تدوم حتى سنتين",
      "جلسة واحدة فقط",
      "بدون ألم أو حساسية",
    ],
    beforeAfter: true,
  },
  {
    id: 2,
    title: "تركيب التقويم",
    shortDesc: "تقويم أسنان احترافي للحصول على ابتسامة مثالية",
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    price: "80,000 - 150,000 دج",
    duration: "12 - 24 شهر",
    fullDesc:
      "تقويم الأسنان هو الحل الأمثل لمشاكل عدم انتظام الأسنان. نقدم أنواع متعددة من التقويم تناسب جميع الحالات والأعمار.",
    features: [
      "تقويم معدني تقليدي",
      "تقويم شفاف (انفزلاين)",
      "تقويم خزفي",
      "متابعة شهرية مجانية",
      "خطة علاجية مخصصة",
      "تقنيات حديثة لتقليل مدة العلاج",
    ],
    beforeAfter: true,
  },
  {
    id: 3,
    title: "علاج التسوس",
    shortDesc: "علاج شامل للتسوس بأحدث التقنيات",
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981407e1f1?w=800&q=80",
    price: "3,000 - 8,000 دج",
    duration: "30 - 60 دقيقة",
    fullDesc:
      "علاج تسوس الأسنان بطرق حديثة وفعالة تحافظ على أسنانك الطبيعية. نستخدم تقنيات متقدمة لتشخيص ومعالجة التسوس في مراحله المبكرة.",
    features: [
      "تشخيص دقيق بالأشعة الرقمية",
      "علاج بدون ألم مع التخدير الموضعي",
      "حشوات تجميلية بلون الأسنان",
      "تقنية الليزر للحالات البسيطة",
      "ضمان على الحشوات",
      "نصائح وقائية مجانية",
    ],
    beforeAfter: false,
  },
  {
    id: 4,
    title: "زراعة الأسنان",
    shortDesc: "استعد أسنانك المفقودة بشكل دائم وطبيعي",
    image:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80",
    price: "60,000 - 120,000 دج",
    duration: "3 - 6 أشهر",
    fullDesc:
      "زراعة الأسنان هي الحل الأمثل والدائم لتعويض الأسنان المفقودة. نستخدم زرعات من التيتانيوم عالي الجودة مع تقنيات جراحية متقدمة.",
    features: [
      "زرعات ألمانية أو سويسرية أصلية",
      "جراحة بدون ألم",
      "تخطيط رقمي ثلاثي الأبعاد",
      "نسبة نجاح 98%",
      "ضمان مدى الحياة على الزرعات",
      "مظهر وأداء طبيعي 100%",
    ],
    beforeAfter: true,
  },
  {
    id: 5,
    title: "حشوات تجميلية",
    shortDesc: "حشوات بلون الأسنان الطبيعي",
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    price: "4,000 - 10,000 دج",
    duration: "30 - 45 دقيقة",
    fullDesc:
      "الحشوات التجميلية (الكومبوزيت) هي الخيار الأمثل لترميم الأسنان بشكل غير مرئي. تتميز بمتانتها وجمالها ومطابقتها للون الأسنان الطبيعي.",
    features: [
      "مواد كومبوزيت عالية الجودة",
      "مطابقة تامة للون الأسنان",
      "قوة ومتانة عالية",
      "نتائج فورية",
      "علاج في جلسة واحدة",
      "لا تحتاج إلى استبدال متكرر",
    ],
    beforeAfter: false,
  },
];

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll();
        const activeServices = (data.results || []).filter(
          (service: any) => service.is_active
        );
        setServices(activeServices);
      } catch (error) {
        // استخدام البيانات الثابتة في حالة الفشل
        setServices(oldServices);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="خدماتنا"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 animated-gradient opacity-90"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-4 shine-effect">
            خدماتنا المتميزة
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-xl">نقدم أفضل خدمات طب الأسنان بأحدث التقنيات</p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-gradient group cursor-pointer shine-effect"
              onClick={() => setSelectedService(service)}
            >
              {service.image && service.image.startsWith("http") ? (
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.name || service.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="relative h-64 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {(service.name || service.title).charAt(0)}
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-primary-dark mb-2 group-hover:text-primary-light transition">
                {service.name || service.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {service.description || service.shortDesc}
              </p>

              <div className="flex justify-between items-center mb-4">
                <span className="badge">
                  {service.price_min && service.price_max
                    ? `${service.price_min} - ${service.price_max} دج`
                    : service.price || "السعر حسب الاستشارة"}
                </span>
                <span className="text-gray-500 text-sm">
                  ⏱️ {service.duration || "حسب الحالة"}
                </span>
              </div>

              <button className="w-full btn-primary">اعرف المزيد</button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-64">
                {selectedService.image &&
                selectedService.image.startsWith("http") ? (
                  <Image
                    src={selectedService.image}
                    alt={selectedService.name || selectedService.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                    <span className="text-9xl font-bold text-white opacity-50">
                      {(selectedService.name || selectedService.title).charAt(
                        0
                      )}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 left-4 bg-white text-primary-dark p-3 rounded-full hover:bg-gray-100 transition"
                >
                  <FaTimes className="text-xl" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-2">
                    {selectedService.name || selectedService.title}
                  </h2>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-primary-light/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">السعر</p>
                    <p className="text-2xl font-bold text-primary-dark">
                      {selectedService.price_min && selectedService.price_max
                        ? `${selectedService.price_min} - ${selectedService.price_max} دج`
                        : selectedService.price || "السعر حسب الاستشارة"}
                    </p>
                  </div>
                  <div className="bg-primary-light/10 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">المدة</p>
                    <p className="text-2xl font-bold text-primary-dark">
                      {selectedService.duration || "حسب الحالة"}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-primary-dark mb-3">
                    عن الخدمة
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedService.description || selectedService.fullDesc}
                  </p>
                </div>

                {selectedService.features &&
                  selectedService.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-primary-dark mb-4">
                        المميزات
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {selectedService.features.map(
                          (feature: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <div className="flex gap-4">
                  <a
                    href="/appointment"
                    className="flex-1 btn-primary text-center"
                  >
                    احجز موعد الآن
                  </a>
                  <a
                    href="https://wa.me/213555123456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 btn-secondary text-center text-primary-dark"
                  >
                    استفسر عبر واتساب
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

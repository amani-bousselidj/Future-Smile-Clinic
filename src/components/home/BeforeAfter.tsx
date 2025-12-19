"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaQuoteRight,
} from "react-icons/fa";

const successStories = [
  {
    id: 1,
    name: "أحمد محمد",
    service: "تبييض الأسنان",
    rating: 5,
    story:
      "كانت تجربة رائعة! الفريق الطبي محترف جداً والنتائج فاقت توقعاتي. حصلت على ابتسامة ناصعة البياض في جلسة واحدة فقط.",
    result: "تحسن بنسبة 95% في بياض الأسنان",
  },
  {
    id: 2,
    name: "فاطمة علي",
    service: "تركيب التقويم",
    rating: 5,
    story:
      "بعد سنتين من العلاج، أصبحت أسناني مرتبة بشكل مثالي. الدكتور كان متابع معي باستمرار وكل شيء تم بدون ألم.",
    result: "تحسين كامل في ترتيب الأسنان",
  },
  {
    id: 3,
    name: "خالد حسن",
    service: "زراعة الأسنان",
    rating: 5,
    story:
      "فقدت ثلاثة أسنان وكنت محرجاً من الابتسامة. بعد الزراعة، عادت ثقتي بنفسي وأصبحت أبتسم بكل حرية.",
    result: "زراعة ناجحة بنسبة 100%",
  },
];

const BeforeAfter = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const paginate = (newDirection: number) => {
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = successStories.length - 1;
      if (newIndex >= successStories.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <section className="section-container bg-gradient-to-br from-gray-50 to-blue-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-4">
          قصص نجاح مرضانا
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          اكتشف تجارب مرضانا الحقيقية ورحلتهم نحو ابتسامة أجمل وصحة أفضل
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden"
        >
          {/* Quote Icon */}
          <FaQuoteRight className="absolute top-6 left-6 text-6xl text-primary-light opacity-10" />

          {/* Rating */}
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(successStories[currentIndex].rating)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-xl" />
            ))}
          </div>

          {/* Service Badge */}
          <div className="text-center mb-6">
            <span className="inline-block bg-primary-light/10 text-primary-dark px-6 py-2 rounded-full text-sm font-semibold">
              {successStories[currentIndex].service}
            </span>
          </div>

          {/* Story */}
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed text-center mb-8 italic">
            "{successStories[currentIndex].story}"
          </p>

          {/* Result Highlight */}
          <div className="bg-gradient-to-r from-primary-light/20 to-primary-dark/20 rounded-lg p-4 mb-6">
            <p className="text-center text-primary-dark font-bold text-lg">
              {successStories[currentIndex].result}
            </p>
          </div>

          {/* Patient Name */}
          <div className="text-center">
            <p className="text-xl font-bold text-primary-dark">
              {successStories[currentIndex].name}
            </p>
            <p className="text-gray-500 text-sm mt-1">مريض سعيد</p>
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 bg-primary-light hover:bg-primary-dark text-white p-3 md:p-4 rounded-full shadow-lg transition-all hover:scale-110 z-20"
          aria-label="السابق"
        >
          <FaChevronLeft className="text-lg md:text-xl" />
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 bg-primary-light hover:bg-primary-dark text-white p-3 md:p-4 rounded-full shadow-lg transition-all hover:scale-110 z-20"
          aria-label="التالي"
        >
          <FaChevronRight className="text-lg md:text-xl" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {successStories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-primary-dark w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfter;

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaStar, FaQuoteRight, FaSpinner } from "react-icons/fa";
import { testimonialsAPI } from "../../lib/api";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const data: any = await testimonialsAPI.getAll();
        const testimonialsArray = Array.isArray(data)
          ? data
          : data.results || [];
        const activeTestimonials = testimonialsArray.filter(
          (t: any) => t.is_active
        );
        setTestimonials(activeTestimonials.slice(0, 6)); // Get first 6 active testimonials
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section className="section-container bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <FaSpinner className="text-5xl text-primary-light animate-spin" />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }
  return (
    <section className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
          آراء عملائنا
        </h2>
        <div className="divider"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          استمع لتجارب مرضانا السعداء واكتشف لماذا يثقون بنا
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="card-gradient relative shine-effect"
          >
            <FaQuoteRight className="absolute top-4 left-4 text-4xl text-primary-light opacity-30" />

            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary-light bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white text-2xl font-bold">
                {testimonial.patient_name?.charAt(0) || "؟"}
              </div>
              <div>
                <h4 className="font-bold text-primary-dark text-lg">
                  {testimonial.patient_name}
                </h4>
                <p className="text-sm text-gray-600">
                  {testimonial.service_name}
                </p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" />
              ))}
            </div>

            <p className="text-gray-700 leading-relaxed">
              {testimonial.comment}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-r from-primary-light to-primary-dark rounded-2xl p-8 text-white"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold mb-2">5000+</h3>
            <p>مريض سعيد</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">98%</h3>
            <p>نسبة الرضا</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">15+</h3>
            <p>سنوات خبرة</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold mb-2">24/7</h3>
            <p>دعم متواصل</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;

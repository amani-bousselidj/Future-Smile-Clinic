"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaPhone, FaWhatsapp, FaTooth } from "react-icons/fa";

const CTASection = () => {
  return (
    <section className="section-container bg-gradient-to-r from-primary-dark to-primary-light text-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          هل أنت مستعد لابتسامة أحلامك؟
        </h2>
        <p className="text-xl mb-8 leading-relaxed">
          احجز موعدك الآن واحصل على استشارة مجانية من خبرائنا
          <br />
          نحن هنا لنجعل ابتسامتك أكثر إشراقًا وثقة
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            href="/appointment"
            className="bg-white text-primary-dark px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 hover:text-primary-dark transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <FaCalendarAlt />
            احجز موعدك الآن
          </Link>

          <a
            href="tel:+213555123456"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary-dark transition-all duration-300 flex items-center gap-2"
          >
            <FaPhone />
            اتصل بنا الآن
          </a>

          <a
            href="https://wa.me/213555123456"
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary-dark transition-all duration-300 flex items-center gap-2"
          >
            <FaWhatsapp />
            واتساب
          </a>
        </div>
      </motion.div>
    </section>
  );
};

export default CTASection;

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaCalendarAlt, FaArrowLeft } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Decorative Circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-light/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
          alt="Future Smile Clinic"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 animated-gradient opacity-60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight relative"
          >
            <span className="relative inline-block">مرحبًا بكم في</span>
            <br />
            <span className="shine-effect inline-block text-yellow-300 drop-shadow-2xl relative">
              ابتسامة المستقبل
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 rounded-full"></span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 leading-relaxed"
          >
            نحن نعتني بابتسامتك بأحدث التقنيات وبأفضل الخبراء.
            <br />
            صحة أسنانك هي أولويتنا الأولى.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/appointment"
              className="btn-primary inline-flex items-center justify-center gap-2 pulse-glow"
            >
              <FaCalendarAlt />
              احجز موعدك الآن
            </Link>

            <Link
              href="/services"
              className="btn-secondary inline-flex items-center justify-center gap-2"
            >
              تعرف على خدماتنا
              <FaArrowLeft />
            </Link>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-4 mt-12"
          >
            <div
              className="text-center glass-effect p-4 rounded-2xl floating"
              style={{ animationDelay: "0s" }}
            >
              <h3 className="text-4xl font-bold heading-gradient">15+</h3>
              <p className="text-sm mt-1">سنوات خبرة</p>
            </div>
            <div
              className="text-center glass-effect p-4 rounded-2xl floating"
              style={{ animationDelay: "0.5s" }}
            >
              <h3 className="text-4xl font-bold heading-gradient">5000+</h3>
              <p className="text-sm mt-1">مريض سعيد</p>
            </div>
            <div
              className="text-center glass-effect p-4 rounded-2xl floating"
              style={{ animationDelay: "1s" }}
            >
              <h3 className="text-4xl font-bold heading-gradient">98%</h3>
              <p className="text-sm mt-1">نسبة الرضا</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaCalendarAlt } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-primary-dark">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-9xl font-bold mb-4"
        >
          404
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          عذراً! الصفحة غير موجودة
        </h1>

        <p className="text-xl mb-8 max-w-md mx-auto">
          الصفحة التي تبحث عنها غير متوفرة أو تم نقلها
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-white text-primary-dark px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-all inline-flex items-center justify-center gap-2"
          >
            <FaHome />
            العودة للرئيسية
          </Link>

          <Link
            href="/appointment"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-primary-dark transition-all inline-flex items-center justify-center gap-2"
          >
            <FaCalendarAlt />
            احجز موعد
          </Link>
        </div>

        <div className="mt-12">
          <p className="text-sm opacity-80">يمكنك أيضاً زيارة:</p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <Link href="/services" className="hover:underline">
              الخدمات
            </Link>
            <Link href="/about" className="hover:underline">
              من نحن
            </Link>
            <Link href="/blog" className="hover:underline">
              المقالات
            </Link>
            <Link href="/contact" className="hover:underline">
              تواصل معنا
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

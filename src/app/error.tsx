"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHome, FaExclamationTriangle } from "react-icons/fa";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Silent error handling - error boundary already caught it
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl text-red-500 mb-6"
        >
          <FaExclamationTriangle className="mx-auto" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
          عذراً! حدث خطأ
        </h1>

        <p className="text-gray-600 mb-8">
          حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary-light text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-dark transition-all"
          >
            حاول مرة أخرى
          </button>

          <Link
            href="/"
            className="bg-white text-primary-dark border-2 border-primary-light px-8 py-3 rounded-lg font-bold hover:bg-primary-light hover:text-white transition-all inline-flex items-center justify-center gap-2"
          >
            <FaHome />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import QueueTracker from "@/components/QueueTracker";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaQrcode, FaHome } from "react-icons/fa";

export default function QueueTrackerPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const [showInfo, setShowInfo] = useState(!bookingId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors">
            <FaHome className="w-5 h-5" />
            الرئيسية
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">متتبع الطابور الفعلي</h1>
          <div className="flex items-center gap-4">
            {bookingId && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-right"
              >
                <p className="text-xs text-gray-600">معرف الحجز</p>
                <p className="text-sm font-mono font-bold text-indigo-600">{bookingId}</p>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      <QueueTracker bookingId={bookingId || undefined} />

      {/* Instructions Panel */}
      {showInfo && !bookingId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 mt-8 mb-8"
        >
          <div className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-indigo-600">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaQrcode className="text-indigo-600" />
              كيفية استخدام متتبع الطابور
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-4">1️⃣</div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">احصل على معرف الحجز</h3>
                <p className="text-gray-600">
                  عند حجز موعدك، ستحصل على معرف حجز فريد بصيغة BK-YYYYMMDD-####
                </p>
              </div>

              <div className="p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-4">2️⃣</div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">قم بزيارة متتبع الطابور</h3>
                <p className="text-gray-600">
                  زر هذه الصفحة وأدخل معرف الحجز الخاص بك للبدء في المراقبة
                </p>
              </div>

              <div className="p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl mb-4">3️⃣</div>
                <h3 className="font-bold text-lg text-gray-800 mb-3">راقب موقعك في الطابور</h3>
                <p className="text-gray-600">
                  سيتم تحديث موقعك تلقائياً كل 5 ثوان مع الإشعارات الصوتية
                </p>
              </div>
            </div>

            {/* Booking ID Input */}
            <div className="bg-indigo-50 p-6 rounded-lg">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ادخل معرف الحجز الخاص بك:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="BK-20251227-1234"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.currentTarget.value) {
                      window.location.href = `/queue-tracker?bookingId=${e.currentTarget.value}`;
                    }
                  }}
                />
                <button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      window.location.href = `/queue-tracker?bookingId=${input.value}`;
                    }
                  }}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold flex items-center gap-2"
                >
                  <FaArrowLeft className="w-5 h-5" />
                  ابدأ المراقبة
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppointmentReceipt from "../../components/AppointmentReceipt";
import Link from "next/link";
import { FaArrowRight, FaHome } from "react-icons/fa";

interface BookingData {
  bookingId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
}

export default function AppointmentConfirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get booking data from URL search params
    const data: BookingData = {
      bookingId: searchParams.get("bookingId") || "",
      patientName: searchParams.get("patientName") || "",
      patientPhone: searchParams.get("patientPhone") || "",
      patientEmail: searchParams.get("patientEmail") || undefined,
      serviceName: searchParams.get("serviceName") || "",
      appointmentDate: searchParams.get("appointmentDate") || "",
      appointmentTime: searchParams.get("appointmentTime") || "",
    };

    if (data.bookingId) {
      setBookingData(data);
    }

    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!bookingData || !bookingData.bookingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">خطأ</h1>
          <p className="text-gray-600 mb-6">
            عذراً، لم نتمكن من العثور على بيانات الحجز. يرجى محاولة الحجز مرة
            أخرى.
          </p>
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaArrowRight /> العودة للحجز
          </Link>
        </div>
      </div>
    );
  }

  const appointmentDate = new Date(
    `${bookingData.appointmentDate}T${bookingData.appointmentTime}`
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <FaHome /> العودة للرئيسية
          </Link>
        </div>

        {/* Receipt Component */}
        <AppointmentReceipt
          bookingId={bookingData.bookingId}
          patientName={bookingData.patientName}
          patientPhone={bookingData.patientPhone}
          patientEmail={bookingData.patientEmail}
          serviceName={bookingData.serviceName}
          appointmentDate={bookingData.appointmentDate}
          appointmentTime={bookingData.appointmentTime}
          appointmentDateTime={appointmentDate}
        />

        {/* Next Steps */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            الخطوات التالية
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">احفظ الرقم</h3>
              <p className="text-gray-600 text-sm">
                احفظ معرف الحجز الخاص بك أو اطبعه للاستخدام لاحقاً
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">تتبع موعدك</h3>
              <p className="text-gray-600 text-sm">
                استخدم معرف الحجز لتتبع حالة موعدك
              </p>
              <Link
                href={`/appointment-status?bookingId=${bookingData.bookingId}`}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
              >
                تتبع الآن
              </Link>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">تواصل معنا</h3>
              <p className="text-gray-600 text-sm">
                اتصل بنا إذا كان لديك أي استفسارات
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            هل تحتاج إلى مساعدة؟
          </h3>
          <p className="text-gray-600 mb-4">
            تواصل معنا مباشرة عبر الوسائل التالية:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <div className="text-gray-700">
              <span className="font-semibold">الهاتف:</span> +213 555 123 456
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">البريد الإلكتروني:</span>{" "}
              info@futuresmile.dz
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

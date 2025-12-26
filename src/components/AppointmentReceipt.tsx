"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  FaCheckCircle,
  FaPrint,
  FaDownload,
  FaWhatsapp,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaUser,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import { useRef } from "react";

interface AppointmentReceiptProps {
  bookingId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentDateTime: Date;
}

export default function AppointmentReceipt({
  bookingId,
  patientName,
  patientPhone,
  patientEmail,
  serviceName,
  appointmentDate,
  appointmentTime,
  appointmentDateTime,
}: AppointmentReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // Generate a simple text file with booking details
    const receiptText = `
=====================================
    عيادة Future Smile للأسنان
=====================================

معرف الحجز الفريد: ${bookingId}

--------- تفاصيل الموعد ---------
اسم المريض: ${patientName}
رقم الهاتف: ${patientPhone}
${patientEmail ? `البريد الإلكتروني: ${patientEmail}` : ""}
الخدمة: ${serviceName}
التاريخ: ${appointmentDate}
الوقت: ${appointmentTime}

--------- ملاحظات مهمة ---------
• يرجى الحضور قبل 10 دقائق من موعد التطبيق
• احضر بطاقة الهوية أو البطاقة الصحية
• إذا لم تتمكن من الحضور، يرجى إلغاء الموعد قبل 24 ساعة على الأقل
• للمزيد من المعلومات، اتصل بنا على +213 555 123 456

--------- معلومات الاتصال ---------
الهاتف: +213 555 123 456
ساعات العمل: 9:00 صباحاً - 5:00 مساءً
الإغلاق يوم الجمعة

=====================================
شكراً لاختيارك عيادة Future Smile! 😊
=====================================
    `.trim();

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(receiptText)
    );
    element.setAttribute("download", `booking-${bookingId}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `مرحباً! رقم حجزي في عيادة Future Smile:\n` +
        `معرف الحجز: ${bookingId}\n` +
        `المريض: ${patientName}\n` +
        `الخدمة: ${serviceName}\n` +
        `التاريخ: ${appointmentDate}\n` +
        `الوقت: ${appointmentTime}\n\n` +
        `شكراً! 😊`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    // Could add toast notification here
  };

  // Format date in Arabic
  const formatter = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedDate = formatter.format(appointmentDateTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Receipt Container */}
      <div
        ref={receiptRef}
        className="bg-white rounded-lg shadow-2xl overflow-hidden print:shadow-none"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="flex justify-center mb-4"
          >
            <FaCheckCircle className="text-5xl" />
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">تم تأكيد موعدك!</h1>
          <p className="text-blue-100">شكراً لاختيارك عيادة Future Smile</p>
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-8">
          {/* Booking ID Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200"
          >
            <p className="text-gray-600 text-sm mb-2">معرف الحجز الفريد</p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-4xl font-bold text-blue-600 font-mono tracking-wider">
                  {bookingId}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  احفظ هذا الرقم للمراجعة عند القدوم
                </p>
              </div>
              <button
                onClick={handleCopyBookingId}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm print:hidden"
              >
                نسخ
              </button>
            </div>
          </motion.div>

          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center py-4 print:py-2"
          >
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <QRCodeSVG
                value={bookingId}
                size={150}
                level="H"
                includeMargin={true}
              />
              <p className="text-center text-xs text-gray-600 mt-2">
                امسح الكود لتتبع موعدك
              </p>
            </div>
          </motion.div>

          {/* Appointment Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              تفاصيل الموعد
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaUser className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">اسم المريض</p>
                  <p className="font-semibold text-gray-800">{patientName}</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaTooth className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">الخدمة</p>
                  <p className="font-semibold text-gray-800">{serviceName}</p>
                </div>
              </div>

              {/* Appointment Date */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaCalendarAlt className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">التاريخ</p>
                  <p className="font-semibold text-gray-800">{formattedDate}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {appointmentDate}
                  </p>
                </div>
              </div>

              {/* Appointment Time */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaClock className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">الوقت</p>
                  <p className="font-semibold text-gray-800">
                    {appointmentTime}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaPhone className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-semibold text-gray-800">{patientPhone}</p>
                </div>
              </div>

              {/* Email */}
              {patientEmail && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <FaEnvelope className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-800">
                      {patientEmail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Important Notes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
          >
            <h3 className="font-bold text-yellow-800 mb-2">ملاحظات مهمة</h3>
            <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
              <li>يرجى الحضور قبل 10 دقائق من موعد التطبيق</li>
              <li>احضر بطاقة الهوية أو البطاقة الصحية</li>
              <li>
                إذا لم تتمكن من الحضور، يرجى إلغاء الموعد قبل 24 ساعة على الأقل
              </li>
              <li>للمزيد من المعلومات، اتصل بنا على +213 555 123 456</li>
            </ul>
          </motion.div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center py-4 border-t"
          >
            <p className="text-gray-600 text-sm mb-2">
              عيادة Future Smile للأسنان
            </p>
            <p className="text-gray-500 text-xs">
              العنوان: الجزائر | الهاتف: +213 555 123 456
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ساعات العمل: 9:00 صباحاً - 5:00 مساءً | الإغلاق يوم الجمعة
            </p>
          </motion.div>
        </div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-wrap gap-3 mt-6 justify-center print:hidden"
      >
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          <FaPrint /> طباعة
        </button>

        <button
          onClick={handleDownloadReceipt}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <FaDownload /> تحميل الإيصال
        </button>

        <button
          onClick={handleShareWhatsApp}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
        >
          <FaWhatsapp /> مشاركة عبر WhatsApp
        </button>
      </motion.div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .print\:hidden {
            display: none !important;
          }
          .print\:py-2 {
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .print\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaTooth,
  FaCheckCircle,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import { servicesAPI, appointmentsAPI } from "../../lib/api";

export default function AppointmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const [apiServices, setApiServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll();
        setApiServices(data.results || []);
      } catch (err) {
        // Fallback to static services
        setApiServices([]);
      }
    };
    fetchServices();
  }, []);

  const services =
    apiServices.length > 0
      ? apiServices
      : [
          "تبييض الأسنان",
          "تركيب التقويم",
          "علاج التسوس",
          "زراعة الأسنان",
          "حشوات تجميلية",
          "تنظيف الأسنان",
          "علاج اللثة",
          "خلع الأسنان",
        ];

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      // Find service ID and name
      const selectedService = apiServices.find(
        (s) =>
          s.name === formData.service || s.id === parseInt(formData.service)
      );

      const appointmentData = {
        patient_name: formData.name,
        patient_phone: formData.phone,
        patient_email: formData.email || undefined,
        service: selectedService?.id || 1,
        appointment_date: formData.date,
        appointment_time: formData.time,
        notes: formData.notes || undefined,
      };

      // Submit to API
      const response = await appointmentsAPI.create(appointmentData);

      // Get booking ID from response
      const id = response.booking_id || response.id;
      if (id) {
        setBookingId(id);
        setIsSuccess(true);

        // Redirect to confirmation page with booking data
        const confirmationUrl = new URL(
          "/appointment-confirmation",
          window.location.origin
        );
        confirmationUrl.searchParams.set("bookingId", id);
        confirmationUrl.searchParams.set("patientName", formData.name);
        confirmationUrl.searchParams.set("patientPhone", formData.phone);
        if (formData.email) {
          confirmationUrl.searchParams.set("patientEmail", formData.email);
        }
        confirmationUrl.searchParams.set(
          "serviceName",
          selectedService?.name || formData.service
        );
        confirmationUrl.searchParams.set("appointmentDate", formData.date);
        confirmationUrl.searchParams.set("appointmentTime", formData.time);

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(confirmationUrl.toString());
        }, 2000);
      } else {
        throw new Error("لم يتم الحصول على معرف الحجز");
      }
    } catch (err: any) {
      setError(
        err.message || "حدث خطأ أثناء حجز الموعد. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="احجز موعدك"
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 px-4">
            احجز موعدك
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-base sm:text-lg md:text-xl px-4">
            نحن في انتظارك لنمنحك ابتسامة أحلامك
          </p>
        </motion.div>
      </section>

      {/* Form Section */}
      <section className="section-container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Form */}
          <div className="card bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg w-full">
            <h2 className="text-3xl font-bold heading-gradient mb-6">
              املأ بيانات الحجز
            </h2>

            {/* Success Message */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4"
              >
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold">تم حجز موعدك بنجاح!</p>
                    {bookingId && (
                      <p className="text-sm mt-1">
                        معرف الحجز:{" "}
                        <span className="font-mono font-bold">{bookingId}</span>
                      </p>
                    )}
                    <p className="text-sm">جاري الانتقال إلى صفحة التأكيد...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                  placeholder="+213 555 123 456"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                  placeholder="example@email.com"
                />
              </div>

              {/* Service */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  الخدمة المطلوبة *
                </label>
                <select
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                >
                  <option value="">اختر الخدمة</option>
                  {services.map((service) => (
                    <option
                      key={typeof service === "object" ? service.id : service}
                      value={typeof service === "object" ? service.id : service}
                    >
                      {typeof service === "object" ? service.name : service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  التاريخ *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  الوقت *
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition bg-white relative z-10"
                >
                  <option value="">اختر الوقت</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                  ملاحظات إضافية
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition resize-none bg-white relative z-10"
                  placeholder="أي ملاحظات أو استفسارات إضافية"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base py-3"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="text-lg sm:text-2xl animate-spin" />
                    جاري الحجز...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="text-lg sm:text-2xl" />
                    تأكيد الحجز
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Why Book */}
            <div className="card bg-gradient-to-br from-primary-light to-primary-dark text-white p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                لماذا تحجز معنا؟
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-light rounded-full mt-2"></span>
                  <span>أطباء متخصصون بخبرة عالية</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-light rounded-full mt-2"></span>
                  <span>أحدث التقنيات والمعدات</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-light rounded-full mt-2"></span>
                  <span>أسعار تنافسية ومناسبة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-light rounded-full mt-2"></span>
                  <span>بيئة نظيفة ومريحة</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary-light rounded-full mt-2"></span>
                  <span>استشارة مجانية أولية</span>
                </li>
              </ul>
            </div>

            {/* Working Hours */}
            <div className="card p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-3 sm:mb-4">
                مواعيد العمل
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">السبت - الخميس</span>
                  <span className="text-primary-light font-bold">
                    09:00 - 18:00
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">الجمعة</span>
                  <span className="text-red-500 font-bold">مغلق</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="card p-4 sm:p-6 md:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-3 sm:mb-4">
                تواصل معنا
              </h3>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                <a
                  href="tel:+213555123456"
                  className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary-light transition"
                >
                  <FaPhone className="text-primary-light text-base sm:text-lg" />
                  <span>+213 555 123 456</span>
                </a>
                <a
                  href="https://wa.me/213555123456"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-green-500 transition"
                >
                  <FaWhatsapp className="text-green-500 text-base sm:text-lg" />
                  <span>واتساب</span>
                </a>
              </div>
            </div>

            {/* Emergency */}
            <div className="card bg-red-50 border-2 border-red-200 p-4 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 mb-2 sm:mb-3">
                حالات الطوارئ
              </h3>
              <p className="text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                في حالة الطوارئ، اتصل بنا فورًا على:
              </p>
              <a
                href="tel:+213555123456"
                className="block text-center bg-red-600 text-white py-2 sm:py-3 rounded-lg font-bold hover:bg-red-700 transition text-sm sm:text-base"
              >
                +213 555 123 456
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useApi } from "@/lib/hooks";
import { useApp } from "@/context/AppContext";

type Service = {
  id: number;
  name: string;
  is_active?: boolean;
};

export default function BookingSection() {
  const { addNotification } = useApp();
  const { execute, loading: apiLoading } = useApi();

  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service_id: "",
    appointment_date: "",
    comment: "",
    agreeToPrivacy: false,
  });

  React.useEffect(() => {
    let mounted = true;
    const loadServices = async () => {
      setServicesLoading(true);
      setServicesError(null);
      try {
        const response = await execute("get", "/api/services/?is_active=true");
        const list = Array.isArray(response)
          ? (response as Service[])
          : ((response as any)?.results as Service[]) || [];
        if (!mounted) return;
        setServices(list);
      } catch (err) {
        if (!mounted) return;
        const message =
          err instanceof Error ? err.message : "فشل تحميل قائمة الخدمات";
        setServicesError(message);
      } finally {
        if (mounted) setServicesLoading(false);
      }
    };
    loadServices();
    return () => {
      mounted = false;
    };
  }, [execute]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeToPrivacy) return;
    if (servicesLoading) return;
    if (!formData.service_id) {
      addNotification({ type: "error", message: "يرجى اختيار الخدمة" });
      return;
    }

    if (!formData.appointment_date) {
      addNotification({ type: "error", message: "يرجى اختيار تاريخ الموعد" });
      return;
    }

    try {
      const payload = {
        patient_name: formData.name,
        patient_phone: formData.phone,
        service_id: parseInt(formData.service_id, 10),
        appointment_date: formData.appointment_date,
        notes: formData.comment,
      };

      const response = await execute("post", "/api/appointments/", payload);
      const bookingId = (response as any)?.booking_id;

      addNotification({
        type: "success",
        message: bookingId
          ? `تم إرسال طلب الحجز بنجاح! رقم الحجز: ${bookingId}`
          : "تم إرسال طلب الحجز بنجاح!",
      });

      setFormData({
        name: "",
        phone: "",
        service_id: "",
        appointment_date: "",
        comment: "",
        agreeToPrivacy: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "فشل حجز الموعد";
      addNotification({ type: "error", message });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center py-8 md:py-0">
      <div className="w-full h-auto md:min-h-screen flex flex-col md:flex-row">
        {/* Left Side - Image */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-blue-50 to-gray-100">
          <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
            <img
              src="/images/booking-consultation.jpg"
              alt="استشارة طبية"
              className="w-full h-full max-h-[600px] object-contain rounded-3xl shadow-2xl"
            />
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-200/30 rounded-full blur-3xl" />
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 md:w-1/2 flex items-start md:items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 overflow-y-auto">
          <div className="w-full max-w-xl my-4 md:my-0">
            {/* Header */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">
                نناقش علاجك
              </h2>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                <span className="font-semibold">استشارة مجانية</span> — اتصل بنا،
                سنساعدك على تحديد وقت مناسب للزيارة
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  الاسم
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل اسمك"
                  required
                  className="w-full px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="رقم هاتفك"
                  required
                  className="w-full px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                />
              </div>

              {/* Service Select */}
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  اختر الخدمة
                </label>
                <select
                  id="service"
                  name="service_id"
                  value={formData.service_id}
                  onChange={handleChange}
                  required
                  disabled={servicesLoading || !!servicesError}
                  className="w-full px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer text-sm sm:text-base"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "left 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                    paddingLeft: "2.5rem",
                  }}
                >
                  <option value="" disabled>
                    {servicesLoading
                      ? "جاري تحميل الخدمات..."
                      : servicesError
                        ? "تعذر تحميل الخدمات"
                        : services.length === 0
                          ? "لا توجد خدمات حاليا"
                        : "الخدمة المطلوبة"}
                  </option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <div>
                  <label
                    htmlFor="appointment_date"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    تاريخ الموعد
                  </label>
                  <input
                    type="date"
                    id="appointment_date"
                    name="appointment_date"
                    value={formData.appointment_date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 sm:py-4 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  تعليق
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="تعليقك..."
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                />
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreeToPrivacy"
                  name="agreeToPrivacy"
                  checked={formData.agreeToPrivacy}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="agreeToPrivacy"
                  className="text-xs sm:text-sm text-gray-600 leading-relaxed cursor-pointer"
                >
                  بملء النموذج، توافق على معالجة بياناتك الشخصية
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  !formData.agreeToPrivacy ||
                  servicesLoading ||
                  !!servicesError ||
                  services.length === 0 ||
                  apiLoading
                }
                className="group w-full bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 sm:py-4 rounded-full text-sm sm:text-base md:text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] disabled:transform-none disabled:shadow-md flex items-center justify-center gap-3"
              >
                {apiLoading ? "جاري الإرسال..." : "إرسال"}
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

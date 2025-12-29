/**
 * Appointments Booking Page - Arabic Version
 */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useApi, useForm } from "@/lib/hooks";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

interface Service {
  id: number;
  name: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
}

interface BookingFormData {
  service_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  patient_full_name: string;
  patient_phone: string;
  patient_email: string;
  notes: string;
}

interface AppointmentResponse {
  id: number;
  booking_id: string;
  service: number;
  doctor: number;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useApp();
  const { execute } = useApi();

  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Load services and doctors
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const servicesResponse = await execute(
          "get",
          "/api/services/?is_active=true"
        );
        const doctorsResponse = await execute("get", "/api/doctors/");

        if (servicesResponse) {
          const servicesList = Array.isArray(servicesResponse)
            ? servicesResponse
            : (servicesResponse as any)?.results || [];
          setServices(servicesList);
        }
        if (doctorsResponse) {
          const doctorsList = Array.isArray(doctorsResponse)
            ? doctorsResponse
            : (doctorsResponse as any)?.results || [];
          setDoctors(doctorsList);
        }
      } catch (error) {
        addNotification({
          type: "error",
          message: "فشل تحميل الخدمات والأطباء",
        });
      }
    };

    loadData();
  }, []);

  const appointmentResponseRef = React.useRef<AppointmentResponse | null>(null);

  const {
    values,
    handleChange,
    handleSubmit,
    loading: isSubmitting,
  } = useForm<BookingFormData>(async (formData) => {
    try {
      const response = await execute("post", "/api/appointments/", {
        ...formData,
        service_id: parseInt(formData.service_id),
        doctor_id: parseInt(formData.doctor_id),
      });

      if (response) {
        const appointmentData = response as AppointmentResponse;
        appointmentResponseRef.current = appointmentData;
        addNotification({
          type: "success",
          message:
            "تم حجز الموعد بنجاح! رقم الحجز: " + appointmentData.booking_id,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "فشل حجز الموعد",
      });
      throw error;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-16 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">احجز موعدك الآن</h1>
          <p className="text-xl text-blue-100">
            حدد موعداً مناسباً مع فريق أطبائنا المتخصصين
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card shadow="lg" padding="lg" className="bg-white border-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                اختر الخدمة *
              </label>
              <select
                name="service_id"
                value={values.service_id || ""}
                onChange={(e) => {
                  handleChange(e);
                  const service = services.find(
                    (s) => s.id === parseInt(e.target.value)
                  );
                  setSelectedService(service || null);
                }}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-gray-50"
              >
                <option value="">-- اختر الخدمة --</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.price_min}-{service.price_max}{" "}
                    ريال
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor Selection */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                اختر الطبيب *
              </label>
              <select
                name="doctor_id"
                value={values.doctor_id || ""}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right bg-gray-50"
              >
                <option value="">-- اختر الطبيب --</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    د. {doctor.first_name} {doctor.last_name} -{" "}
                    {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Input
                type="date"
                name="appointment_date"
                label="تاريخ الموعد"
                value={values.appointment_date || ""}
                onChange={handleChange}
                required
              />
              <Input
                type="time"
                name="appointment_time"
                label="وقت الموعد"
                value={values.appointment_time || ""}
                onChange={handleChange}
                required
              />
            </div>

            {/* Patient Information */}
            <div className="border-t-2 border-gray-200 pt-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                بيانات المريض
              </h3>
              <div className="space-y-5">
                <Input
                  type="text"
                  name="patient_full_name"
                  label="الاسم الكامل"
                  value={values.patient_full_name || user?.full_name || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="email"
                  name="patient_email"
                  label="البريد الإلكتروني"
                  value={values.patient_email || user?.email || ""}
                  onChange={handleChange}
                  required
                />
                <Input
                  type="tel"
                  name="patient_phone"
                  label="رقم الجوال"
                  value={values.patient_phone || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                ملاحظات إضافية
              </label>
              <textarea
                name="notes"
                value={values.notes || ""}
                onChange={handleChange}
                placeholder="أي معلومات إضافية تريد مشاركتها مع الطبيب..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Service Summary */}
            {selectedService && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-4">
                  📋 ملخص الموعد
                </p>
                <div className="text-base text-gray-800 space-y-3">
                  <p>
                    الخدمة:{" "}
                    <span className="font-bold text-blue-600">
                      {selectedService.name}
                    </span>
                  </p>
                  <p>
                    المدة:{" "}
                    <span className="font-bold text-blue-600">
                      {selectedService.duration_minutes} دقيقة
                    </span>
                  </p>
                  <p>
                    السعر:{" "}
                    <span className="font-bold text-blue-600">
                      {selectedService.price_min} - {selectedService.price_max}{" "}
                      ريال
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-4"
            >
              {isSubmitting ? "جاري حجز الموعد..." : "تأكيد حجز الموعد"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

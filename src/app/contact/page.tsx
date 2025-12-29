/**
 * Contact Page - Arabic Version
 */
"use client";

import React from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForm, useApi } from "@/lib/hooks";
import { useApp } from "@/context/AppContext";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { addNotification } = useApp();
  const { execute } = useApi();

  const { values, errors, loading, handleChange, handleSubmit, reset } =
    useForm<ContactFormData>(async (formData) => {
      try {
        await execute("post", "/api/contact-messages/", formData);
        addNotification({
          type: "success",
          message: "تم إرسال رسالتك بنجاح! سنتصل بك قريباً.",
        });
        reset();
      } catch (error) {
        addNotification({
          type: "error",
          message: "فشل إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        });
        throw error;
      }
    });

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 via-blue-700 to-blue-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-xl text-blue-100">
            لديك أسئلة؟ نحن هنا للمساعدة في كل وقت
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card shadow="md" className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📞</span>
                <h3 className="text-xl font-bold text-gray-900">الهاتف</h3>
              </div>
              <p className="text-gray-600 text-lg">+966 12 345 6789</p>
            </Card>

            <Card shadow="md" className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📧</span>
                <h3 className="text-xl font-bold text-gray-900">البريد</h3>
              </div>
              <p className="text-gray-600 text-lg">info@futuresmile.com</p>
            </Card>

            <Card shadow="md" className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">📍</span>
                <h3 className="text-xl font-bold text-gray-900">العنوان</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                شارع الابتسامة
                <br />
                مدينة الأسنان، المملكة العربية السعودية
                <br />
                12345
              </p>
            </Card>

            <Card shadow="md" className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🕐</span>
                <h3 className="text-xl font-bold text-gray-900">الساعات</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                الأحد - الخميس: 9 صباحاً - 6 مساءً
                <br />
                الجمعة: 10 صباحاً - 4 مساءً
                <br />
                السبت: مغلق
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card shadow="lg" padding="lg" className="bg-white border-0">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">أرسل لنا رسالة</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    type="text"
                    name="name"
                    label="الاسم الكامل"
                    value={values.name || ""}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    placeholder="أدخل اسمك"
                  />
                  <Input
                    type="email"
                    name="email"
                    label="البريد الإلكتروني"
                    value={values.email || ""}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    placeholder="أدخل بريدك"
                  />
                </div>

                <Input
                  type="tel"
                  name="phone"
                  label="رقم الجوال"
                  value={values.phone || ""}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="أدخل رقم جوالك"
                />

                <Input
                  type="text"
                  name="subject"
                  label="الموضوع"
                  value={values.subject || ""}
                  onChange={handleChange}
                  error={errors.subject}
                  required
                  placeholder="ما موضوع رسالتك؟"
                />

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    الرسالة *
                  </label>
                  <textarea
                    name="message"
                    value={values.message || ""}
                    onChange={handleChange}
                    placeholder="أخبرنا عما تحتاج..."
                    rows={6}
                    required
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none text-right ${
                      errors.message
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-sm text-red-600 mt-2 block">
                      {errors.message}
                    </span>
                  )}
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  size="lg" 
                  isLoading={loading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg"
                >
                  {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center">موقعنا على الخريطة</h2>
          <Card shadow="md" padding="none">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1825516524!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzcuMCJOIDQ2wrA0MCc1MC4zIkU!5e0!3m2!1sar!2ssa!4v1234567890"
              width="100%"
              height="400"
              loading="lazy"
              className="rounded-lg"
              title="موقع عيادة ابتسامة المستقبل"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

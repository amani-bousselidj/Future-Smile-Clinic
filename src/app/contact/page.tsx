"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import { contactAPI } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await contactAPI.send(formData);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (err: any) {
      setError(
        err.message || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: "الهاتف",
      details: ["+213 555 123 456", "+213 555 789 012"],
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FaEnvelope,
      title: "البريد الإلكتروني",
      details: ["info@futuresmile.dz", "contact@futuresmile.dz"],
      color: "from-green-500 to-green-600",
    },
    {
      icon: FaMapMarkerAlt,
      title: "العنوان",
      details: ["شارع الاستقلال، الجزائر العاصمة", "بالقرب من ساحة أول مايو"],
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FaClock,
      title: "ساعات العمل",
      details: ["السبت - الخميس: 9:00 - 18:00", "الجمعة: مغلق"],
      color: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="تواصل معنا"
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
          <h1 className="text-5xl md:text-7xl font-bold mb-4 shine-effect">
            تواصل معنا
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-xl">نحن هنا للإجابة على جميع استفساراتك</p>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="card-gradient shine-effect"
          >
            <h2 className="text-3xl font-bold heading-gradient mb-6">
              أرسل لنا رسالة
            </h2>

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
              >
                <FaCheckCircle className="text-2xl" />
                <span>تم إرسال رسالتك بنجاح! سنتواصل معك قريبًا.</span>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary-light outline-none transition-all duration-300 hover:border-primary-light/50"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  البريد الإلكتروني *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition"
                  placeholder="example@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition"
                  placeholder="+213 555 123 456"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الموضوع *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition"
                  placeholder="موضوع الرسالة"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  الرسالة *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent outline-none transition resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري الإرسال...
                  </>
                ) : (
                  "إرسال الرسالة"
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="card">
              <h3 className="text-2xl font-bold text-primary-dark mb-6">
                معلومات الاتصال
              </h3>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                  <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white p-4 rounded-xl shadow-lg">
                    <FaMapMarkerAlt className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">العنوان</h4>
                    <p className="text-gray-600">
                      الجزائر العاصمة
                      <br />
                      شارع ديدوش مراد
                      <br />
                      بالقرب من ساحة أول مايو
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary-light text-white p-4 rounded-lg">
                    <FaPhone className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">الهاتف</h4>
                    <a
                      href="tel:+213555123456"
                      className="text-primary-light hover:text-primary-dark transition"
                    >
                      +213 555 123 456
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary-light text-white p-4 rounded-lg">
                    <FaEnvelope className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      البريد الإلكتروني
                    </h4>
                    <a
                      href="mailto:contact@futuresmile.dz"
                      className="text-primary-light hover:text-primary-dark transition"
                    >
                      contact@futuresmile.dz
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-primary-light text-white p-4 rounded-lg">
                    <FaClock className="text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-1">
                      مواعيد العمل
                    </h4>
                    <p className="text-gray-600">
                      السبت - الخميس: 09:00 - 18:00
                      <br />
                      الجمعة: مغلق
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card bg-gradient-to-br from-primary-light to-primary-dark text-white">
              <h3 className="text-2xl font-bold mb-6">تابعنا على</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="bg-white text-primary-dark p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <FaFacebook className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="bg-white text-primary-dark p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <FaInstagram className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="bg-white text-primary-dark p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <FaTwitter className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="bg-white text-primary-dark p-4 rounded-full hover:scale-110 transition-transform"
                >
                  <FaLinkedin className="text-2xl" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="card"
        >
          <h2 className="text-3xl font-bold text-primary-dark mb-6 text-center">
            موقعنا على الخريطة
          </h2>
          <div className="relative w-full h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.1088978146895!2d3.0587999!3d36.7538107!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb27b1e0f92bf%3A0xba89f8a695bfb369!2sDidouche%20Mourad%2C%20Algiers!5e0!3m2!1sen!2sdz!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>
      </section>
    </div>
  );
}

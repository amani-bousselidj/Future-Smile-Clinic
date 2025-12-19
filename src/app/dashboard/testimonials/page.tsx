"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaComments,
  FaStar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
} from "react-icons/fa";
import { testimonialsAPI } from "@/lib/api";
import toast from "react-hot-toast";

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
  const [formData, setFormData] = useState({
    patient_name: "",
    service_name: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await testimonialsAPI.getAll();
      setTestimonials(data.results || []);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTestimonial) {
        await testimonialsAPI.update(editingTestimonial.id, formData);
      } else {
        await testimonialsAPI.create(formData);
      }
      setShowForm(false);
      setEditingTestimonial(null);
      setFormData({
        patient_name: "",
        service_name: "",
        rating: 5,
        comment: "",
      });
      fetchTestimonials();
      toast.success(
        editingTestimonial ? "تم تحديث التقييم بنجاح" : "تم إضافة التقييم بنجاح"
      );
    } catch (error) {
      toast.error("فشل في حفظ التقييم");
    }
  };

  const handleEdit = (testimonial: any) => {
    setEditingTestimonial(testimonial);
    setFormData({
      patient_name: testimonial.patient_name,
      service_name: testimonial.service_name,
      rating: testimonial.rating,
      comment: testimonial.comment,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف هذا التقييم؟")) {
      try {
        await testimonialsAPI.delete(id);
        fetchTestimonials();
        toast.success("تم حذف التقييم بنجاح");
      } catch (error) {
        toast.error("فشل في حذف التقييم");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  const avgRating =
    testimonials.length > 0
      ? (
          testimonials.reduce((acc, t) => acc + t.rating, 0) /
          testimonials.length
        ).toFixed(1)
      : "0";

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark flex items-center gap-3">
            <FaComments />
            إدارة آراء العملاء
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            عرض وإدارة تقييمات وآراء المرضى
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaPlus />
          {showForm ? "إلغاء" : "إضافة رأي جديد"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="card p-4 sm:p-6"
        >
          <h2 className="text-xl font-bold text-primary-dark mb-4">
            {editingTestimonial ? "تعديل التقييم" : "إضافة تقييم جديد"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم المريض *
                </label>
                <input
                  type="text"
                  required
                  value={formData.patient_name}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الخدمة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.service_name}
                  onChange={(e) =>
                    setFormData({ ...formData, service_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: تبييض الأسنان"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التقييم *
                </label>
                <select
                  required
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: Number(e.target.value) })
                  }
                  className="input-field"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 نجوم)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 نجوم)</option>
                  <option value={3}>⭐⭐⭐ (3 نجوم)</option>
                  <option value={2}>⭐⭐ (2 نجمة)</option>
                  <option value={1}>⭐ (1 نجمة)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  التعليق *
                </label>
                <textarea
                  required
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  className="input-field"
                  rows={4}
                  placeholder="تعليق المريض..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTestimonial(null);
                  setFormData({
                    patient_name: "",
                    service_name: "",
                    rating: 5,
                    comment: "",
                  });
                }}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                {editingTestimonial ? "حفظ التعديلات" : "إضافة التقييم"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {testimonials.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">إجمالي الآراء</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {avgRating}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">متوسط التقييم</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {testimonials.filter((t) => t.rating === 5).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">5 نجوم</p>
        </motion.div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary-dark">
                      {testimonial.patient_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {testimonial.service_name}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{testimonial.comment}</p>
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.created_at).toLocaleDateString("ar-DZ")}
                </p>
              </div>
              <div className="flex gap-2 self-start">
                <button
                  onClick={() => handleEdit(testimonial)}
                  className="text-primary-light hover:text-primary-dark p-2"
                  title="تعديل"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="حذف"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

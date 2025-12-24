"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaTooth, FaEdit, FaTrash, FaPlus, FaSpinner } from "react-icons/fa";
import { servicesAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function ServicesManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_min: "",
    price_max: "",
    duration: "",
    image: "",
    is_active: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await servicesAPI.getAll();
      setServices(data.results || []);
    } catch (error: any) {
      console.error("Error fetching services:", error);
      toast.error("فشل تحميل الخدمات. الخادم قد يكون مشغول الآن، حاول لاحقاً");
      // Set empty array to prevent UI breaking
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await servicesAPI.update(editingService.id, formData);
      } else {
        await servicesAPI.create(formData);
      }
      fetchServices();
      resetForm();
      toast.success(
        editingService ? "تم تحديث الخدمة بنجاح" : "تم إضافة الخدمة بنجاح"
      );
    } catch (error: any) {
      console.error("Error saving service:", error);
      const errorMsg = error?.message || "فشل في حفظ الخدمة";
      if (errorMsg.includes("ERR_INSUFFICIENT")) {
        toast.error("الخادم مشغول جداً. حاول مرة أخرى بعد قليل");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price_min: service.price_min,
      price_max: service.price_max,
      duration: service.duration,
      image: service.image || "",
      is_active: service.is_active,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذه الخدمة؟")) {
      try {
        await servicesAPI.delete(id);
        toast.success("تم حذف الخدمة بنجاح");
        fetchServices();
      } catch (error: any) {
        const errorMessage = error?.message?.includes("404")
          ? "الخدمة غير موجودة أو تم حذفها مسبقاً"
          : "فشل في حذف الخدمة";
        toast.error(errorMessage);
        // Refresh list in case service was already deleted
        fetchServices();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price_min: "",
      price_max: "",
      duration: "",
      image: "",
      is_active: true,
    });
    setEditingService(null);
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark flex items-center gap-3">
            <FaTooth />
            إدارة الخدمات
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            إضافة وتعديل وحذف خدمات العيادة
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaPlus />
          إضافة خدمة جديدة
        </button>
      </div>

      {/* Service Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            {editingService ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  اسم الخدمة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: تبييض الأسنان"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  المدة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: ساعة واحدة"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأدنى (دج) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price_min}
                  onChange={(e) =>
                    setFormData({ ...formData, price_min: e.target.value })
                  }
                  className="input-field"
                  placeholder="3000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  السعر الأقصى (دج) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price_max}
                  onChange={(e) =>
                    setFormData({ ...formData, price_max: e.target.value })
                  }
                  className="input-field"
                  placeholder="8000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوصف *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="input-field"
                placeholder="وصف تفصيلي للخدمة..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رابط الصورة
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="input-field"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-4 h-4 text-primary-light rounded"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                الخدمة نشطة
              </label>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingService ? "حفظ التعديلات" : "إضافة الخدمة"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary text-gray-700"
              >
                إلغاء
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card p-4 sm:p-6 hover:shadow-xl transition"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white p-3 rounded-lg">
                <FaTooth className="text-2xl" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-primary-light hover:text-primary-dark p-2"
                  title="تعديل"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="حذف"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2">
              {service.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {service.description}
            </p>
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xs sm:text-sm text-gray-500">السعر</span>
              <span className="text-base sm:text-lg font-bold text-primary-dark">
                {service.price_min} - {service.price_max} دج
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs sm:text-sm text-gray-500">المدة</span>
              <span className="text-sm font-medium text-gray-700">
                {service.duration}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12">
          <FaTooth className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">لا توجد خدمات حالياً</p>
        </div>
      )}
    </div>
  );
}

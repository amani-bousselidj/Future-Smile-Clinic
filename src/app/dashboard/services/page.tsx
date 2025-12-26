"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FaTooth, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaSpinner,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";
import { servicesAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function ServicesManagementPage() {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filter services by search term
  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search Bar */}
      <div className="card p-4">
        <input
          type="text"
          placeholder="ابحث عن خدمة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light outline-none"
        />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {services.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">إجمالي الخدمات</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {services.filter((s) => s.is_active).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">الخدمات النشطة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {services.filter((s) => !s.is_active).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">غير نشطة</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {filteredServices.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">نتائج البحث</p>
        </motion.div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredServices.map((service, index) => (
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
                  onClick={() => {
                    setSelectedService(service);
                    setShowDetails(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 p-2"
                  title="عرض التفاصيل"
                >
                  <FaEye />
                </button>
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

            {/* Status Badge */}
            <div className="mb-3 flex items-center gap-2">
              <FaCheckCircle 
                className={service.is_active ? "text-green-500" : "text-gray-400"} 
              />
              <span className="text-xs sm:text-sm">
                {service.is_active ? "نشط" : "غير نشط"}
              </span>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                  <FaDollarSign className="text-xs" /> السعر
                </span>
                <span className="text-base sm:text-lg font-bold text-primary-dark">
                  {service.price_min} - {service.price_max} دج
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                  <FaClock className="text-xs" /> المدة
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {service.duration}
                </span>
              </div>
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

      {/* Details Modal */}
      {showDetails && selectedService && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-light to-primary-dark text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                  <p className="text-primary-light text-sm mt-1">ID: {selectedService.id}</p>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-2xl hover:text-gray-200"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Image */}
              {selectedService.image && (
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4">الوصف</h3>
                <p className="text-gray-700 leading-relaxed">{selectedService.description}</p>
              </div>

              {/* Pricing */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaDollarSign className="text-primary-light" />
                  التسعير
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">السعر الأدنى</p>
                    <p className="text-2xl font-bold text-primary-dark">
                      {selectedService.price_min}
                      <span className="text-sm"> دج</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">السعر الأقصى</p>
                    <p className="text-2xl font-bold text-primary-dark">
                      {selectedService.price_max}
                      <span className="text-sm"> دج</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaClock className="text-primary-light" />
                  المدة
                </h3>
                <p className="text-gray-700">{selectedService.duration}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-primary-light" />
                  الحالة
                </h3>
                <p className={`inline-block px-4 py-2 rounded-full font-medium ${
                  selectedService.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  {selectedService.is_active ? "نشطة" : "غير نشطة"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-6 border-t">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    handleEdit(selectedService);
                  }}
                  className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark transition flex items-center gap-2"
                >
                  <FaEdit /> تعديل
                </button>
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

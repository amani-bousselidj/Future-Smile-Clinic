"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaSpinner,
  FaSearch,
  FaPlus,
  FaFilePdf,
} from "react-icons/fa";
import { patientsAPI } from "../../../lib/api";
import toast from "react-hot-toast";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    date_of_birth: "",
    address: "",
    medical_history: "",
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await patientsAPI.getAll();
      setPatients(data.results || []);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patientsAPI.create(formData);
      fetchPatients();
      resetForm();
      toast.success("تم إضافة المريض بنجاح");
    } catch (error) {
      toast.error("فشل في إضافة المريض");
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      date_of_birth: "",
      address: "",
      medical_history: "",
    });
    setShowForm(false);
  };

  const handleDownloadPatientPDF = async (patientId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/patients/${patientId}/download_pdf/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `patient_${patientId}_report.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("تم تحميل التقرير بنجاح");
      }
    } catch (error) {
      toast.error("فشل في تحميل التقرير");
    }
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone?.includes(searchTerm) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <FaUsers />
            إدارة المرضى
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            عرض وإدارة معلومات جميع المرضى
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaPlus />
          إضافة مريض جديد
        </button>
      </div>

      {/* Patient Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-primary-dark mb-4">
            إضافة مريض جديد
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                  className="input-field"
                  placeholder="أحمد محمد"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رقم الهاتف *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-field"
                  placeholder="0555123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-field"
                  placeholder="example@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تاريخ الميلاد
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العنوان
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="input-field"
                placeholder="الجزائر، العاصمة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التاريخ الطبي
              </label>
              <textarea
                rows={3}
                value={formData.medical_history}
                onChange={(e) =>
                  setFormData({ ...formData, medical_history: e.target.value })
                }
                className="input-field"
                placeholder="أي معلومات طبية مهمة..."
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                إضافة المريض
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
        <div className="relative">
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن مريض (الاسم، الهاتف، البريد الإلكتروني)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-light outline-none text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {patients.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">إجمالي المرضى</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {patients.filter((p) => p.email).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">مرضى بريد إلكتروني</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {filteredPatients.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">نتائج البحث</p>
        </motion.div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredPatients.map((patient, index) => (
          <motion.div
            key={patient.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="card p-4 sm:p-6 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
                {patient.full_name?.charAt(0) || "؟"}
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold text-primary-dark">
                  {patient.full_name}
                </h3>
                <p className="text-xs text-gray-500">
                  مريض منذ{" "}
                  {new Date(patient.created_at).toLocaleDateString("ar-DZ")}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <FaPhone className="text-primary-light" />
                <span className="text-gray-700">{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-primary-light" />
                  <span className="text-gray-700 truncate">
                    {patient.email}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
              <button
                onClick={() => handleDownloadPatientPDF(patient.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FaFilePdf />
                PDF
              </button>
              <button className="flex-1 btn-primary text-sm py-2">
                عرض التفاصيل
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <FaUsers className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? "لا توجد نتائج للبحث" : "لا يوجد مرضى حالياً"}
          </p>
        </div>
      )}
    </div>
  );
}

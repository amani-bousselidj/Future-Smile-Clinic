"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaBlog,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaSpinner,
} from "react-icons/fa";
import Image from "next/image";
import { blogAPI } from "../../../lib/api";

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "",
    read_time: "5 دقائق",
    image: "",
    is_published: true,
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await blogAPI.getAll();
      setPosts(data.results || []);
    } catch (error) {
      // Silent error handling
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await blogAPI.update(editingPost.id, formData);
      } else {
        await blogAPI.create(formData);
      }
      setShowForm(false);
      setEditingPost(null);
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        author: "",
        read_time: "5 دقائق",
        image: "",
        is_published: true,
      });
      fetchPosts();
    } catch (error) {
      // Silent error handling
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      read_time: post.read_time,
      image: post.image || "",
      is_published: post.is_published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المقال؟")) {
      try {
        await blogAPI.delete(id);
        fetchPosts();
      } catch (error) {
        // Silent error handling
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

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 md:p-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-dark flex items-center gap-3">
            <FaBlog />
            إدارة المقالات
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            إضافة وتعديل وحذف مقالات المدونة
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
        >
          <FaPlus />
          {showForm ? "إلغاء" : "إضافة مقال جديد"}
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
            {editingPost ? "تعديل المقال" : "إضافة مقال جديد"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان المقال *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: أهمية تنظيف الأسنان اليومي"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الفئة *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: نصائح صحية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكاتب *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: د. أحمد بن عيسى"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت القراءة
                </label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={(e) =>
                    setFormData({ ...formData, read_time: e.target.value })
                  }
                  className="input-field"
                  placeholder="مثال: 5 دقائق"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  رابط الصورة
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ملخص المقال *
                </label>
                <textarea
                  required
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  className="input-field"
                  rows={2}
                  placeholder="ملخص قصير عن المقال..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  محتوى المقال *
                </label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="input-field"
                  rows={8}
                  placeholder="محتوى المقال الكامل..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_published: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-primary-light focus:ring-primary-light"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    نشر المقال مباشرة
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  setFormData({
                    title: "",
                    excerpt: "",
                    content: "",
                    category: "",
                    author: "",
                    read_time: "5 دقائق",
                    image: "",
                    is_published: true,
                  });
                }}
                className="btn-secondary"
              >
                إلغاء
              </button>
              <button type="submit" className="btn-primary">
                {editingPost ? "حفظ التعديلات" : "إضافة المقال"}
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
          <div className="bg-gradient-to-br from-primary-light to-primary-dark text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {posts.length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">إجمالي المقالات</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-green-400 to-green-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {posts.filter((p) => p.is_published).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">المقالات المنشورة</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-4"
        >
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white w-12 h-12 rounded-lg flex items-center justify-center mb-2 text-xl font-bold">
            {posts.filter((p) => !p.is_published).length}
          </div>
          <p className="text-xs sm:text-sm text-gray-600">المسودات</p>
        </motion.div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-4 sm:p-6"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex-1">
                    <span className="badge mb-2">{post.category}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                      <span>{post.author}</span>
                      <span>
                        {new Date(post.date).toLocaleDateString("ar-DZ")}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaEye />
                        {post.views}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-primary-light hover:text-primary-dark p-2"
                      title="تعديل"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="حذف"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

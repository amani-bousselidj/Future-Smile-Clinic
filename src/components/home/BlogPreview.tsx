"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaCalendar, FaArrowLeft, FaClock, FaSpinner } from "react-icons/fa";
import { blogAPI } from "@/lib/api";

const BlogPreview = () => {
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data: any = await blogAPI.getAll();
        const postsArray = Array.isArray(data) ? data : data.results || [];
        const publishedPosts = postsArray.filter(
          (post: any) => post.is_published
        );
        setBlogPosts(publishedPosts.slice(0, 3)); // Get first 3 published posts
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (isLoading) {
    return (
      <section className="section-container bg-gray-50">
        <div className="flex items-center justify-center min-h-[400px]">
          <FaSpinner className="text-5xl text-primary-light animate-spin" />
        </div>
      </section>
    );
  }

  if (blogPosts.length === 0) {
    return null; // Don't show section if no blog posts
  }
  return (
    <section className="section-container bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
          مقالات صحية
        </h2>
        <div className="divider"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          نصائح وإرشادات من خبرائنا للحفاظ على صحة أسنانك
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {blogPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="card-gradient group shine-effect"
          >
            <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
              {post.image && post.image.startsWith("http") ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white text-4xl font-bold">
                  {post.title?.charAt(0)}
                </div>
              )}
              <div className="badge absolute top-4 right-4">
                {post.category}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
              <span className="flex items-center gap-1">
                <FaCalendar />
                {new Date(post.created_at).toLocaleDateString("ar-DZ")}
              </span>
              <span className="flex items-center gap-1">
                <FaClock />
                {post.read_time}
              </span>
            </div>

            <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary-light transition">
              {post.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>

            <Link
              href={`/blog/${post.id}`}
              className="text-primary-light hover:text-primary-dark font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
            >
              اقرأ المزيد
              <FaArrowLeft />
            </Link>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          href="/blog"
          className="btn-primary inline-flex items-center gap-2"
        >
          عرض جميع المقالات
          <FaArrowLeft />
        </Link>
      </motion.div>
    </section>
  );
};

export default BlogPreview;

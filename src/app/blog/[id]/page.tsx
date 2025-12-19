"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaArrowRight,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaSpinner,
} from "react-icons/fa";
import { blogAPI } from "@/lib/api";

const BlogPostPage = () => {
  const params = useParams();
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postId = params.id as string;
        const [postData, allPosts] = await Promise.all([
          blogAPI.getById(Number(postId)),
          blogAPI.getAll(),
        ]);

        setPost(postData);

        // Get related posts (same category, excluding current post)
        const related = (allPosts.results || [])
          .filter(
            (p: any) =>
              p.category === postData.category &&
              p.id !== postData.id &&
              p.is_published
          )
          .slice(0, 3);

        setRelatedPosts(related);
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">
            المقال غير موجود
          </h1>
          <Link href="/blog" className="btn-primary">
            العودة إلى المقالات
          </Link>
        </div>
      </div>
    );
  }

  const oldBlogPosts = [
    {
      id: 1,
      title: "أهمية تنظيف الأسنان اليومي",
      excerpt:
        "تعرف على الطرق الصحيحة لتنظيف أسنانك والحفاظ على صحة فمك بشكل يومي",
      content: `تنظيف الأسنان اليومي هو حجر الأساس للحفاظ على صحة الفم والأسنان. إليك أهم النصائح:
      
**التكرار المثالي**: يجب تنظيف الأسنان مرتين يوميًا على الأقل، صباحًا ومساءً.

**المدة المناسبة**: اقضِ دقيقتين على الأقل في كل مرة تنظف فيها أسنانك.

**التقنية الصحيحة**: استخدم حركات دائرية لطيفة، ولا تضغط بقوة على اللثة.

**الخيط الطبي**: استخدم خيط الأسنان مرة يوميًا لإزالة بقايا الطعام بين الأسنان.

**غسول الفم**: استخدم غسول الفم المضاد للبكتيريا للحصول على حماية إضافية.

تذكر أن تغيير فرشاة الأسنان كل 3 أشهر أمر ضروري للحفاظ على فعاليتها.`,
      image:
        "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80",
      date: "2024-12-01",
      readTime: "5 دقائق",
      category: "نصائح صحية",
      author: "د. أحمد بن عيسى",
    },
    {
      id: 2,
      title: "كيف تختار معجون الأسنان المناسب؟",
      excerpt: "دليلك الشامل لاختيار أفضل معجون أسنان يناسب احتياجاتك الخاصة",
      content: `اختيار معجون الأسنان المناسب يعتمد على احتياجاتك الشخصية:

**للأسنان الحساسة:**
- ابحث عن معجون يحتوي على نترات البوتاسيوم
- تجنب المعاجين المبيضة القوية

**للوقاية من التسوس:**
- اختر معجون يحتوي على الفلورايد
- مناسب للأطفال والبالغين

**لتبييض الأسنان:**
- المعاجين المبيضة تحتوي على مواد كاشطة خفيفة
- استخدمها باعتدال

استشر طبيب أسنانك لتحديد الخيار الأمثل لك.`,
      image:
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
      date: "2024-11-28",
      readTime: "4 دقائق",
      category: "منتجات العناية",
      author: "د. سارة المنصوري",
    },
    {
      id: 3,
      title: "فوائد تبييض الأسنان الاحترافي",
      excerpt: "اكتشف الفرق بين التبييض المنزلي والاحترافي وأيهما أفضل لك",
      content: `تبييض الأسنان الاحترافي يقدم العديد من المزايا:

**المميزات الرئيسية:**
- نتائج فورية من الجلسة الأولى
- أمان أعلى تحت إشراف طبيب
- تقنيات متطورة مع LED وليزر
- تبييض موحد على جميع الأسنان

**الفرق مع التبييض المنزلي:**
- تركيزات أعلى من مواد التبييض
- نتائج أسرع (ساعة مقابل أسابيع)
- أقل احتمالية للحساسية

احجز استشارتك المجانية اليوم!`,
      image:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
      date: "2024-11-25",
      readTime: "6 دقائق",
      category: "تجميل الأسنان",
      author: "د. كريم العمري",
    },
  ];

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {post.image && post.image.startsWith("http") ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
              <span className="text-9xl font-bold text-white opacity-50">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white max-w-4xl mx-auto px-4"
        >
          <span className="badge mb-4">{post.category}</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="flex items-center gap-2">
              <FaUser />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar />
              {new Date(post.created_at).toLocaleDateString("ar-DZ")}
            </span>
            <span className="flex items-center gap-2">
              <FaClock />
              {post.read_time}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Content Section */}
      <section className="section-container">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary-light hover:text-primary-dark transition"
            >
              <FaArrowRight />
              العودة للمقالات
            </Link>
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card bg-white p-8 md:p-12"
          >
            <div className="prose prose-lg max-w-none">
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <h3
                      key={index}
                      className="text-2xl font-bold text-primary-dark mt-6 mb-4"
                    >
                      {paragraph.replace(/\*\*/g, "")}
                    </h3>
                  );
                } else if (paragraph.startsWith("- ")) {
                  return (
                    <ul
                      key={index}
                      className="list-disc list-inside space-y-2 text-gray-700 mb-4"
                    >
                      {paragraph.split("\n").map((item, i) => (
                        <li key={i}>{item.replace("- ", "")}</li>
                      ))}
                    </ul>
                  );
                } else {
                  return (
                    <p
                      key={index}
                      className="text-gray-700 leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  );
                }
              })}
            </div>

            {/* Share Section */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h4 className="text-xl font-bold text-gray-800 mb-4">
                شارك المقال:
              </h4>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${post.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                >
                  <FaTwitter size={20} />
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  <FaLinkedin size={20} />
                </a>
                <a
                  href={`https://wa.me/?text=${post.title} ${currentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <FaWhatsapp size={20} />
                </a>
              </div>
            </div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              <h3 className="text-3xl font-bold text-primary-dark mb-8">
                مقالات ذات صلة
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.id}`}
                    className="card group hover:shadow-xl transition-shadow"
                  >
                    {relatedPost.image &&
                    relatedPost.image.startsWith("http") ? (
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                        <span className="text-6xl font-bold text-white">
                          {relatedPost.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <h4 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary-light transition">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPostPage;

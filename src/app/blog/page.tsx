"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaClock,
  FaUser,
  FaArrowLeft,
  FaSpinner,
} from "react-icons/fa";
import { blogAPI } from "../../lib/api";

const blogPosts = [
  {
    id: 1,
    title: "أهمية تنظيف الأسنان اليومي",
    excerpt:
      "تعرف على الطرق الصحيحة لتنظيف أسنانك والحفاظ على صحة فمك بشكل يومي",
    content: `
      تنظيف الأسنان اليومي هو حجر الأساس للحفاظ على صحة الفم والأسنان. إليك أهم النصائح:
      
      1. **التكرار المثالي**: يجب تنظيف الأسنان مرتين يوميًا على الأقل، صباحًا ومساءً.
      
      2. **المدة المناسبة**: اقضِ دقيقتين على الأقل في كل مرة تنظف فيها أسنانك.
      
      3. **التقنية الصحيحة**: استخدم حركات دائرية لطيفة، ولا تضغط بقوة على اللثة.
      
      4. **الخيط الطبي**: استخدم خيط الأسنان مرة يوميًا لإزالة بقايا الطعام بين الأسنان.
      
      5. **غسول الفم**: استخدم غسول الفم المضاد للبكتيريا للحصول على حماية إضافية.
      
      تذكر أن تغيير فرشاة الأسنان كل 3 أشهر أمر ضروري للحفاظ على فعاليتها.
    `,
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
    content: `
      اختيار معجون الأسنان المناسب يعتمد على احتياجاتك الشخصية:
      
      **للأسنان الحساسة:**
      - ابحث عن معجون يحتوي على نترات البوتاسيوم أو كلوريد السترونتيوم
      - تجنب المعاجين المبيضة القوية
      
      **للوقاية من التسوس:**
      - اختر معجون يحتوي على الفلورايد بتركيز 1350-1500 ppm
      - مناسب للأطفال والبالغين
      
      **لتبييض الأسنان:**
      - المعاجين المبيضة تحتوي على مواد كاشطة خفيفة
      - استخدمها باعتدال لتجنب تآكل المينا
      
      **لصحة اللثة:**
      - معاجين تحتوي على مواد مضادة للبكتيريا
      - تساعد في تقليل التهابات اللثة
      
      استشر طبيب أسنانك لتحديد الخيار الأمثل لك.
    `,
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
    content: `
      تبييض الأسنان الاحترافي يقدم العديد من المزايا:
      
      **المميزات الرئيسية:**
      
      1. **نتائج فورية**: تحصل على نتائج ملحوظة من الجلسة الأولى
      
      2. **أمان أعلى**: يتم تحت إشراف طبيب متخصص
      
      3. **تقنيات متطورة**: استخدام تقنية LED وليزر الأسنان
      
      4. **تبييض موحد**: نتائج متساوية على جميع الأسنان
      
      **الفرق مع التبييض المنزلي:**
      
      - التبييض الاحترافي يستخدم تركيزات أعلى من مواد التبييض
      - النتائج تظهر أسرع (ساعة واحدة مقابل أسابيع)
      - أقل احتمالية للحساسية مع المتابعة الطبية
      
      **نصائح بعد التبييض:**
      - تجنب الأطعمة والمشروبات الملونة لمدة 48 ساعة
      - استخدم معجون أسنان للأسنان الحساسة
      - حافظ على نظافة أسنانك اليومية
      
      احجز استشارتك المجانية اليوم!
    `,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80",
    date: "2024-11-25",
    readTime: "6 دقائق",
    category: "تجميل الأسنان",
    author: "د. نور الهدى",
  },
  {
    id: 4,
    title: "العناية بأسنان الأطفال",
    excerpt: "دليل شامل للآباء حول كيفية العناية بأسنان أطفالهم منذ الصغر",
    content: `
      العناية بأسنان الأطفال تبدأ من الولادة:
      
      **من الولادة حتى سنة:**
      - امسح لثة الطفل بقطعة قماش نظيفة
      - ابدأ تنظيف الأسنان بمجرد ظهورها
      
      **من سنة إلى 3 سنوات:**
      - استخدم كمية صغيرة من معجون الأسنان بحجم حبة الأرز
      - نظف مرتين يوميًا
      
      **من 3 سنوات فما فوق:**
      - استخدم كمية بحجم حبة البازلاء
      - علم طفلك تقنية التنظيف الصحيحة
      
      زُر طبيب الأسنان عند عمر سنة واحدة.
    `,
    image:
      "https://images.unsplash.com/photo-1609840114035-3c981407e1f1?w=800&q=80",
    date: "2024-11-20",
    readTime: "5 دقائق",
    category: "صحة الأطفال",
    author: "د. كريم الجزائري",
  },
  {
    id: 5,
    title: "أسباب حساسية الأسنان وعلاجها",
    excerpt: "تعرف على أسباب حساسية الأسنان وكيفية علاجها والوقاية منها",
    content: `
      حساسية الأسنان مشكلة شائعة يمكن علاجها:
      
      **الأسباب الرئيسية:**
      - تآكل مينا الأسنان
      - انحسار اللثة
      - تسوس الأسنان
      - تشقق الأسنان
      
      **العلاجات المتاحة:**
      - معجون أسنان للأسنان الحساسة
      - علاجات الفلورايد
      - ترميم الأسنان المتضررة
      - علاج اللثة
      
      **الوقاية:**
      - تنظيف لطيف بفرشاة ناعمة
      - تجنب الأطعمة الحمضية
      - زيارة منتظمة لطبيب الأسنان
    `,
    image:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=800&q=80",
    date: "2024-11-15",
    readTime: "4 دقائق",
    category: "مشاكل شائعة",
    author: "د. أحمد بن عيسى",
  },
  {
    id: 6,
    title: "أهمية زيارة طبيب الأسنان الدورية",
    excerpt: "لماذا يجب زيارة طبيب الأسنان كل 6 أشهر حتى بدون مشاكل ظاهرة",
    content: `
      الزيارات الدورية لطبيب الأسنان ضرورية للوقاية:
      
      **فوائد الفحص الدوري:**
      - الكشف المبكر عن التسوس
      - تنظيف الجير المتراكم
      - فحص اللثة والأنسجة
      - كشف أمراض الفم المبكرة
      
      **التردد الموصى به:**
      - كل 6 أشهر للأشخاص الأصحاء
      - كل 3-4 أشهر لمن لديهم مشاكل
      
      **ما يشمله الفحص:**
      - فحص شامل للأسنان واللثة
      - تنظيف احترافي
      - أشعة بانورامية عند الحاجة
      - استشارة حول العناية المنزلية
      
      الوقاية أفضل وأرخص من العلاج!
    `,
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80",
    date: "2024-11-10",
    readTime: "5 دقائق",
    category: "نصائح صحية",
    author: "د. سارة المنصوري",
  },
];

const categories = [
  "الكل",
  "نصائح صحية",
  "منتجات العناية",
  "تجميل الأسنان",
  "صحة الأطفال",
  "مشاكل شائعة",
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogAPI.getAll();
        const publishedPosts = (data.results || []).filter(
          (post: any) => post.is_published
        );
        setBlogPosts(publishedPosts);
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "الكل"
      ? blogPosts
      : blogPosts.filter((post) => post.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="text-5xl text-primary-light animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="مقالاتنا الصحية"
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
            مقالات صحية
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-xl">نصائح وإرشادات من خبرائنا للعناية بأسنانك</p>
        </motion.div>
      </section>

      {/* Categories Filter */}
      <section className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                selectedCategory === category
                  ? "badge pulse-glow"
                  : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-gradient group shine-effect"
            >
              {post.image && post.image.startsWith("http") ? (
                <div className="relative h-56 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="badge absolute top-4 right-4">
                    {post.category}
                  </div>
                </div>
              ) : (
                <div className="relative h-56 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">
                    {post.title.charAt(0)}
                  </span>
                  <div className="badge absolute top-4 right-4">
                    {post.category}
                  </div>
                </div>
              )}

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

              <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary-light transition line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <FaUser />
                <span>{post.author}</span>
              </div>

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
      </section>
    </div>
  );
}

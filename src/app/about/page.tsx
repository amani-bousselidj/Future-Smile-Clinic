"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FaAward, FaUsers, FaHeart, FaStar } from "react-icons/fa";

export const metadata = {
  title: "من نحن",
  description:
    "تعرف على عيادة ابتسامة المستقبل - فريقنا الطبي المتخصص وخبرتنا في طب الأسنان والتجميل",
};

const teamMembers = [
  {
    id: 1,
    name: "د. أحمد بن عيسى",
    specialty: "جراح أسنان",
    experience: "15 سنة",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    description: "خبير في زراعة الأسنان والجراحات التجميلية",
  },
  {
    id: 2,
    name: "د. سارة المنصوري",
    specialty: "أخصائية تقويم الأسنان",
    experience: "10 سنوات",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    description: "متخصصة في تقويم الأسنان للأطفال والبالغين",
  },
  {
    id: 3,
    name: "د. كريم الجزائري",
    specialty: "طبيب أسنان عام",
    experience: "12 سنة",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80",
    description: "خبرة واسعة في علاج التسوس والعناية الشاملة",
  },
  {
    id: 4,
    name: "د. نور الهدى",
    specialty: "أخصائية تجميل الأسنان",
    experience: "8 سنوات",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    description: "متخصصة في تبييض الأسنان والحشوات التجميلية",
  },
];

const values = [
  {
    icon: <FaAward className="text-5xl text-primary-light" />,
    title: "الجودة والتميز",
    description: "نلتزم بأعلى معايير الجودة في تقديم خدماتنا",
  },
  {
    icon: <FaUsers className="text-5xl text-primary-light" />,
    title: "رعاية شخصية",
    description: "نهتم بكل مريض كفرد ونقدم له رعاية مخصصة",
  },
  {
    icon: <FaHeart className="text-5xl text-primary-light" />,
    title: "الاهتمام بالمرضى",
    description: "راحتك وسعادتك هي أولويتنا الأولى",
  },
  {
    icon: <FaStar className="text-5xl text-primary-light" />,
    title: "التميز الدائم",
    description: "نسعى دائمًا للتطور ومواكبة أحدث التقنيات",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1920&q=80"
            alt="من نحن"
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
            من نحن
          </h1>
          <div className="divider mx-auto"></div>
          <p className="text-xl">نحن فريق متخصص في العناية بصحة أسنانك</p>
        </motion.div>
      </section>

      {/* About Content */}
      <section className="section-container bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold heading-gradient mb-6">
              عيادة ابتسامة المستقبل
            </h2>
            <div className="divider mr-0"></div>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              تأسست عيادتنا بهدف تقديم أفضل رعاية لأسنانكم. فريقنا ذو خبرة عالية
              يستخدم أحدث الأجهزة العالمية لضمان ابتسامة صحية وجميلة لكل مريض.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              نؤمن بأن الابتسامة الجميلة هي مفتاح الثقة بالنفس، ولذلك نعمل بكل
              جهدنا لتحقيق أحلام مرضانا بابتسامة مشرقة وصحية.
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              نستخدم أحدث التقنيات والمعدات الطبية المتطورة، ونلتزم بأعلى معايير
              النظافة والسلامة لضمان راحتك وصحتك.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image
              src="https://images.unsplash.com/photo-1588776814546-daab20739e9b?w=800&q=80"
              alt="العيادة"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-container bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
            قيمنا
          </h2>
          <div className="divider"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نلتزم بالقيم التي تجعلنا الخيار الأول لعلاج الأسنان
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-gradient text-center shine-effect"
            >
              <div className="flex justify-center mb-4 floating">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold heading-gradient mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="section-container bg-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
            فريقنا الطبي
          </h2>
          <div className="divider"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            أطباء متخصصون بخبرات عالية ومهارات متقدمة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card-gradient text-center shine-effect"
            >
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-primary-light pulse-glow">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold heading-gradient mb-1">
                {member.name}
              </h3>
              <p className="badge mb-1">{member.specialty}</p>
              <p className="text-sm text-gray-600 mb-3">
                خبرة {member.experience}
              </p>
              <p className="text-sm text-gray-700">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-container bg-gradient-to-r from-primary-light to-primary-dark text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl font-bold mb-2">5000+</h3>
            <p className="text-lg">مريض سعيد</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl font-bold mb-2">98%</h3>
            <p className="text-lg">نسبة الرضا</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl font-bold mb-2">15+</h3>
            <p className="text-lg">سنوات خبرة</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-5xl font-bold mb-2">24/7</h3>
            <p className="text-lg">دعم متواصل</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

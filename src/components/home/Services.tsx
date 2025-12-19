"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaArrowLeft, FaSpinner } from "react-icons/fa";
import { servicesAPI } from "@/lib/api";

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data: any = await servicesAPI.getAll();
        const servicesList = Array.isArray(data) ? data : data.results || [];
        setServices(servicesList.slice(0, 3)); // Get first 3 services
      } catch (error) {
        // Silent error handling
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (isLoading) {
    return (
      <section className="section-container bg-white">
        <div className="flex items-center justify-center min-h-[400px]">
          <FaSpinner className="text-5xl text-primary-light animate-spin" />
        </div>
      </section>
    );
  }
  return (
    <section className="section-container bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl md:text-5xl font-bold heading-gradient mb-4">
          خدماتنا المتميزة
        </h2>
        <div className="divider"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          نقدم مجموعة شاملة من خدمات طب الأسنان بأعلى معايير الجودة
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="group"
          >
            <div className="card-gradient overflow-hidden shine-effect">
              <div className="relative h-64 mb-4 rounded-lg overflow-hidden">
                {service.image && service.image.startsWith("http") ? (
                  <Image
                    src={service.image}
                    alt={service.name || service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-light to-primary-dark flex items-center justify-center text-white text-6xl font-bold">
                    {(service.name || service.title)?.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold heading-gradient mb-2">
                {service.name || service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-primary-light hover:text-primary-dark font-bold group-hover:gap-3 transition-all relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-light after:transition-all hover:after:w-full"
              >
                اعرف المزيد
                <FaArrowLeft />
              </Link>
            </div>
          </motion.div>
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
          href="/services"
          className="btn-primary inline-flex items-center gap-2"
        >
          عرض جميع الخدمات
          <FaArrowLeft />
        </Link>
      </motion.div>
    </section>
  );
};

export default Services;

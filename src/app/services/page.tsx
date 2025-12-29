"use client";

import { useState } from "react";
import { Card, Button } from "@/components";
import { useFetch } from "@/lib/hooks";
import { Service } from "@/types";
import Link from "next/link";

export default function ServicesPage() {
  const {
    data: services,
    loading,
    error,
  } = useFetch<Service[]>("/api/services/");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Services" },
    { id: "dental", label: "Dental" },
    { id: "cosmetic", label: "Cosmetic" },
    { id: "orthodontic", label: "Orthodontic" },
  ];

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services?.filter((s) => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Our Services</h1>
          <p className="text-blue-100">
            Comprehensive dental care for your family
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex gap-4 flex-wrap">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading services...</p>
          </div>
        ) : error ? (
          <Card className="bg-red-50 border-red-200">
            <p className="text-red-700">Failed to load services</p>
          </Card>
        ) : filteredServices && filteredServices.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <Card
                key={service.id}
                className="hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {service.image_url && (
                  <div className="mb-4 h-40 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {service.description}
                </p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Duration:</span>{" "}
                    {service.duration_minutes} minutes
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    ${service.price_min} - ${service.price_max}
                  </p>
                </div>
                <Link href="/appointments">
                  <Button variant="primary" fullWidth>
                    Book Now
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <p className="text-gray-600">No services available</p>
          </Card>
        )}
      </div>
    </div>
  );
}

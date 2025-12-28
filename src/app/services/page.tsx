/**
 * Services Page - Browse all dental services
 */
"use client";

import React, { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useFetch } from "@/lib/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";

interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  image_url?: string;
  is_active: boolean;
}

export default function ServicesPage() {
  const { data: response, loading } = useFetch<{ results: Service[] }>(
    "/api/services/"
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const services = response?.results || [];
  const categories = ["all", ...new Set(services.map((s) => s.category))];
  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Our Services</h1>
        <p className="text-xl text-gray-600">
          Comprehensive dental care tailored to your needs
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-4 justify-center mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <Card key={service.id} shadow="md">
              {service.image_url && (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="bg-blue-50 px-3 py-1 rounded-full inline-block text-sm text-blue-700 mb-3">
                {service.category}
              </div>
              <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
              <p className="text-gray-600 mb-6">{service.description}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="font-bold text-blue-600">
                    ${service.price_min}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-bold">
                    {service.duration_minutes} min
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Max Price</div>
                  <div className="font-bold text-green-600">
                    ${service.price_max}
                  </div>
                </div>
              </div>

              <Link href="/appointments">
                <Button fullWidth>Book Service</Button>
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No services found</p>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Can't find what you need?</h2>
        <p className="text-gray-600 mb-6">
          Contact us for custom dental treatment plans
        </p>
        <Link href="/contact">
          <Button>Get in Touch</Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * Home Page - Main landing page
 */
"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { useFetch } from "@/lib/hooks";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface Service {
  id: number;
  name: string;
  description: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
  image_url?: string;
}

export default function HomePage() {
  const { data: services, loading } = useFetch<{ results: Service[] }>(
    "/api/services/?is_active=true"
  );

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Future Smile Clinic
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Professional dental care with modern technology and experienced
            doctors. Your perfect smile is just one appointment away.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/appointments">
              <Button size="lg">Book an Appointment</Button>
            </Link>
            <Link href="/services">
              <Button variant="ghost" size="lg">
                View Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We offer a comprehensive range of dental services to meet all your
              oral health needs
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : services?.results && services.results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.results.slice(0, 6).map((service) => (
                <Card key={service.id} shadow="md">
                  {service.image_url && (
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-600 font-semibold">
                      ${service.price_min} - ${service.price_max}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <Link href="/appointments">
                    <Button fullWidth variant="primary">
                      Book Now
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No services available</p>
          )}

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="secondary" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏥",
                title: "Modern Technology",
                description:
                  "State-of-the-art dental equipment for best results",
              },
              {
                icon: "👨‍⚕️",
                title: "Expert Doctors",
                description:
                  "Highly qualified and experienced dental professionals",
              },
              {
                icon: "⏰",
                title: "Easy Scheduling",
                description: "Quick and convenient appointment booking",
              },
              {
                icon: "💳",
                title: "Flexible Payment",
                description: "Multiple payment options and affordable pricing",
              },
              {
                icon: "😊",
                title: "Patient Comfort",
                description: "Compassionate care in a welcoming environment",
              },
              {
                icon: "📱",
                title: "Online Support",
                description: "24/7 customer support for your convenience",
              },
            ].map((feature, index) => (
              <Card key={index} shadow="sm" padding="md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Schedule your appointment today and experience the difference our
            care makes
          </p>
          <Link href="/appointments">
            <Button size="lg" variant="ghost">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

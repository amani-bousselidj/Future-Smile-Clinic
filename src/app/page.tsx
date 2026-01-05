/**
 * Home Page - Main landing page (Arabic Version)
 */
"use client";

import React, { useState } from "react";
import { useFetch } from "@/lib/hooks";
import { LoadingSplash } from "@/components/LoadingSplash";
import { FullPageScroller } from "@/components/FullPageScroller";
import HeroTooth from "@/components/HeroTooth";
import { ServicesSection, DoctorsSection, PopularServicesSection } from "@/components";

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
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { data: services, loading } = useFetch<{ results: Service[] }>(
    "/api/services/?is_active=true"
  );

  // Transform services data for ServicesSection component
  const transformedServices = services?.results.map((service) => ({
    id: service.id,
    title: service.name,
    description: service.description,
    image: service.image_url,
    price: service.price_min,
  }));

  return (
    <>
      {!loadingComplete && (
        <LoadingSplash onComplete={() => setLoadingComplete(true)} />
      )}
      <FullPageScroller enabled={loadingComplete} scrollableSlideIndex={-1}>
        <HeroTooth loadingComplete={loadingComplete} showHeader={true} />
        <ServicesSection services={transformedServices} loading={loading} />
        <DoctorsSection />
        <PopularServicesSection />
      </FullPageScroller>
    </>
  );
}

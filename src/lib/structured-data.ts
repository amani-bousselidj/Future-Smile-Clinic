export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: "عيادة ابتسامة المستقبل - Future Smile Clinic",
    alternateName: "Future Smile Clinic",
    url: "https://futuresmile.dz",
    logo: "https://futuresmile.dz/images/logo.png",
    image: "https://futuresmile.dz/images/logo.png",
    description:
      "عيادة متخصصة في طب الأسنان وجراحة الفم والتجميل. نقدم خدمات تبييض الأسنان، زراعة الأسنان، تقويم الأسنان بأحدث التقنيات.",
    telephone: "+213555123456",
    email: "contact@futuresmile.dz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 شارع الاستقلال",
      addressLocality: "الجزائر العاصمة",
      addressRegion: "الجزائر",
      postalCode: "16000",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "36.7538",
      longitude: "3.0588",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
    },
    sameAs: [
      "https://facebook.com/futuresmileclinic",
      "https://instagram.com/futuresmileclinic",
      "https://twitter.com/futuresmileclinic",
    ],
  };
}

export function generateBlogPostSchema(post: {
  title: string;
  excerpt: string;
  author: string;
  created_at: string;
  updated_at: string;
  image?: string;
  id: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image || "https://futuresmile.dz/images/logo.png",
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "عيادة ابتسامة المستقبل",
      logo: {
        "@type": "ImageObject",
        url: "https://futuresmile.dz/images/logo.png",
      },
    },
    datePublished: post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://futuresmile.dz/blog/${post.id}`,
    },
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  price_min: number;
  price_max: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: service.name,
    description: service.description,
    offers: {
      "@type": "Offer",
      priceCurrency: "DZD",
      price: service.price_min,
      priceValidUntil: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0],
    },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://futuresmile.dz",
    name: "عيادة ابتسامة المستقبل",
    image: "https://futuresmile.dz/images/logo.png",
    telephone: "+213555123456",
    email: "contact@futuresmile.dz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "123 شارع الاستقلال",
      addressLocality: "الجزائر العاصمة",
      postalCode: "16000",
      addressCountry: "DZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 36.7538,
      longitude: 3.0588,
    },
    url: "https://futuresmile.dz",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
  };
}

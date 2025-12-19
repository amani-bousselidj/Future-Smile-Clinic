import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  author?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = "عيادة أسنان, تبييض أسنان, زراعة أسنان, تقويم أسنان, طب أسنان, الجزائر",
  image = "/images/logo.png",
  url = "https://futuresmile.dz",
  type = "website",
  publishedTime,
  author = "عيادة ابتسامة المستقبل",
}: SEOProps): Metadata {
  const siteName = "عيادة ابتسامة المستقبل - Future Smile Clinic";
  const fullTitle = `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description,
    keywords,
    authors: [{ name: author }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type,
      locale: "ar_DZ",
      url,
      title: fullTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
      creator: "@FutureSmileClinic",
    },
    alternates: {
      canonical: url,
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
  };
}

// Default metadata for the site
export const defaultMetadata: Metadata = {
  metadataBase: new URL("https://futuresmile.dz"),
  title: {
    default: "عيادة ابتسامة المستقبل - Future Smile Clinic",
    template: "%s | عيادة ابتسامة المستقبل",
  },
  description:
    "عيادة متخصصة في طب الأسنان وجراحة الفم والتجميل. نقدم خدمات تبييض الأسنان، زراعة الأسنان، تقويم الأسنان، والقشور التجميلية بأحدث التقنيات في الجزائر.",
  keywords: [
    "عيادة أسنان",
    "طبيب أسنان",
    "تبييض الأسنان",
    "زراعة الأسنان",
    "تقويم الأسنان",
    "القشور التجميلية",
    "تنظيف الأسنان",
    "علاج العصب",
    "جراحة الفم",
    "تجميل الأسنان",
    "الجزائر",
    "Future Smile",
    "dental clinic",
    "teeth whitening",
    "dental implants",
    "orthodontics",
    "veneers",
  ],
  authors: [{ name: "عيادة ابتسامة المستقبل" }],
  creator: "Future Smile Clinic",
  publisher: "Future Smile Clinic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "ar_DZ",
    url: "https://futuresmile.dz",
    title: "عيادة ابتسامة المستقبل - Future Smile Clinic",
    description:
      "عيادة متخصصة في طب الأسنان وجراحة الفم والتجميل. نقدم خدمات تبييض الأسنان، زراعة الأسنان، تقويم الأسنان بأحدث التقنيات.",
    siteName: "عيادة ابتسامة المستقبل",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Future Smile Clinic Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "عيادة ابتسامة المستقبل - Future Smile Clinic",
    description:
      "عيادة متخصصة في طب الأسنان وجراحة الفم والتجميل بأحدث التقنيات في الجزائر.",
    images: ["/images/logo.png"],
    creator: "@FutureSmileClinic",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

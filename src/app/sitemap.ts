import { MetadataRoute } from "next";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SITE_URL = "https://futuresmile.dz";

async function fetchBlogPosts() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    // Silent error handling
    return [];
  }
}

async function fetchServices() {
  try {
    const response = await fetch(`${API_BASE_URL}/services/`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.results || data;
  } catch (error) {
    // Silent error handling
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, services] = await Promise.all([
    fetchBlogPosts(),
    fetchServices(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/appointment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  // Blog posts pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post: any) => ({
    url: `${SITE_URL}/blog/${post.id}`,
    lastModified: new Date(post.updated_at || post.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}

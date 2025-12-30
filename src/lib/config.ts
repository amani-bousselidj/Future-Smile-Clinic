/**
 * Environment configuration
 * Centralized environment variable access with type safety
 */

// Ensure API_BASE_URL does not contain a trailing `/api` to avoid accidental duplicate paths
// Use NEXT_PUBLIC_API_URL without `/api` suffix (e.g. https://example.com)
// Remove any trailing '/api' or trailing slash from the provided URL to avoid '/api/api' when
// frontend code calls endpoints like '/api/services/'.
export const API_BASE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  // strip trailing '/api' or '/api/'
  return raw.replace(/\/api\/?$/i, "").replace(/\/$/, "");
})();

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const APP_NAME = "Future Smile Clinic";
const APP_DESCRIPTION = "Professional Dental Care Excellence";

export const config = {
  api: {
    baseUrl: API_BASE_URL,
    timeout: 10000, // 10 seconds
    retries: 2,
  },
  site: {
    url: SITE_URL,
    name: APP_NAME,
    description: APP_DESCRIPTION,
  },
  features: {
    enableNotifications: true,
    enableAnalytics: true,
    enableDebugMode: process.env.NODE_ENV === "development",
  },
  pagination: {
    defaultPageSize: 10,
    defaultPage: 1,
  },
} as const;

export default config;

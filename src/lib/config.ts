/**
 * Environment configuration
 * Centralized environment variable access with type safety
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8000/api';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

const APP_NAME = 'Future Smile Clinic';
const APP_DESCRIPTION = 'Professional Dental Care Excellence';

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
    enableDebugMode: process.env.NODE_ENV === 'development',
  },
  pagination: {
    defaultPageSize: 10,
    defaultPage: 1,
  },
} as const;

export default config;

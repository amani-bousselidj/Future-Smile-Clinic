// Use Render backend API URL (hardcoded as fallback)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? 
    (window.location.hostname.includes('localhost') 
      ? 'http://localhost:8000/api' 
      : 'https://future-smile-clinic.onrender.com/api') 
    : 'https://future-smile-clinic.onrender.com/api');

// Simple cache with expiration (5 minutes)
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Get cached data if valid
function getCachedData(key: string): any | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

// Set cached data
function setCacheData(key: string, data: any, ttl: number = CACHE_TTL): void {
  cache.set(key, { data, timestamp: Date.now(), ttl });
}

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

// Generic API request handler with caching and retry
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 2
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Use cache only for GET requests
  if (!options.method || options.method === "GET") {
    const cached = getCachedData(endpoint);
    if (cached) {
      return cached as T;
    }
  }

  const token = getAuthToken();
  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle 204 No Content responses (like DELETE)
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as T;
    }

    const data = await response.json();

    // Cache GET requests
    if (!options.method || options.method === "GET") {
      setCacheData(endpoint, data);
    }

    return data;
  } catch (error: any) {
    // Retry on network errors (ERR_INSUFFICIENT_RESOURCES, etc.)
    if (
      retries > 0 &&
      (error.message?.includes("ERR_") ||
        error.message?.includes("Failed to fetch") ||
        error.message?.includes("NetworkError"))
    ) {
      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return apiRequest<T>(endpoint, options, retries - 1);
    }
    throw error;
  }
}

// Export cache invalidation function
export function invalidateCache(pattern?: string): void {
  if (pattern) {
    // Invalidate specific cache entries matching pattern
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    // Clear all cache
    cache.clear();
  }
}

// Services API
export const servicesAPI = {
  getAll: () => apiRequest<{ results: any[] }>("/services/"),
  getById: (id: number) => apiRequest<any>(`/services/${id}/`),
  create: (data: {
    name: string;
    description: string;
    price_min: string;
    price_max: string;
    duration: string;
    image?: string;
    is_active?: boolean;
  }) => {
    const promise = apiRequest<any>("/services/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("services"));
    return promise;
  },
  update: (id: number, data: any) => {
    const promise = apiRequest<any>(`/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("services"));
    return promise;
  },
  delete: (id: number) => {
    const promise = apiRequest<void>(`/services/${id}/`, {
      method: "DELETE",
    });
    promise.then(() => invalidateCache("services"));
    return promise;
  },
};

// Appointments API
export const appointmentsAPI = {
  create: (data: {
    patient_name: string;
    patient_phone: string;
    patient_email?: string;
    service: number;
    appointment_date: string;
    appointment_time: string;
    notes?: string;
  }) => {
    const promise = apiRequest<any>("/appointments/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("appointments"));
    return promise;
  },

  getAll: () => apiRequest<{ results: any[] }>("/appointments/"),
  getById: (id: number) => apiRequest<any>(`/appointments/${id}/`),

  update: (id: number, data: any) => {
    const promise = apiRequest<any>(`/appointments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("appointments"));
    return promise;
  },

  delete: (id: number) => {
    const promise = apiRequest<any>(`/appointments/${id}/`, {
      method: "DELETE",
    });
    promise.then(() => invalidateCache("appointments"));
    return promise;
  },
};

// Contact API
export const contactAPI = {
  send: (data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    // Backend ContactMessage model doesn't have phone field, so exclude it
    const { phone, ...contactData } = data;
    return apiRequest<any>("/contact/", {
      method: "POST",
      body: JSON.stringify(contactData),
    });
  },
};

// Patients API
export const patientsAPI = {
  getAll: () => apiRequest<{ results: any[] }>("/patients/"),
  getById: (id: number) => apiRequest<any>(`/patients/${id}/`),
  create: (data: {
    full_name: string;
    email?: string;
    phone: string;
    date_of_birth?: string;
    address?: string;
    medical_history?: string;
  }) => {
    const promise = apiRequest<any>("/patients/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("patients"));
    return promise;
  },

  update: (id: number, data: any) => {
    const promise = apiRequest<any>(`/patients/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("patients"));
    return promise;
  },
};

// Blog API
export const blogAPI = {
  getAll: () => apiRequest<{ results: any[] }>("/blog/"),
  getById: (id: number) => apiRequest<any>(`/blog/${id}/`),
  create: (data: {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    read_time: string;
    image?: string;
    is_published?: boolean;
  }) => {
    const promise = apiRequest<any>("/blog/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("blog"));
    return promise;
  },
  update: (id: number, data: any) => {
    const promise = apiRequest<any>(`/blog/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("blog"));
    return promise;
  },
  delete: (id: number) => {
    const promise = apiRequest<void>(`/blog/${id}/`, {
      method: "DELETE",
    });
    promise.then(() => invalidateCache("blog"));
    return promise;
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: () => apiRequest<{ results: any[] }>("/testimonials/"),
  getById: (id: number) => apiRequest<any>(`/testimonials/${id}/`),
  create: (data: {
    patient_name: string;
    service_name: string;
    rating: number;
    comment: string;
  }) => {
    const promise = apiRequest<any>("/testimonials/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("testimonials"));
    return promise;
  },
  update: (id: number, data: any) => {
    const promise = apiRequest<any>(`/testimonials/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    promise.then(() => invalidateCache("testimonials"));
    return promise;
  },
  delete: (id: number) => {
    const promise = apiRequest<any>(`/testimonials/${id}/`, {
      method: "DELETE",
    });
    promise.then(() => invalidateCache("testimonials"));
    return promise;
  },
};

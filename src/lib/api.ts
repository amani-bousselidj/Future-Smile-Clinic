const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://future-smile-clinic-production.up.railway.app/api";

// Get auth token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
}

// Generic API request handler
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

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

    return await response.json();
  } catch (error) {
    throw error;
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
  }) =>
    apiRequest<any>("/services/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiRequest<any>(`/services/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/services/${id}/`, {
      method: "DELETE",
    }),
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
  }) =>
    apiRequest<any>("/appointments/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest<{ results: any[] }>("/appointments/"),
  getById: (id: number) => apiRequest<any>(`/appointments/${id}/`),

  update: (id: number, data: any) =>
    apiRequest<any>(`/appointments/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    apiRequest<any>(`/appointments/${id}/`, {
      method: "DELETE",
    }),
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
  }) =>
    apiRequest<any>("/patients/", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: any) =>
    apiRequest<any>(`/patients/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
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
  }) =>
    apiRequest<any>("/blog/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiRequest<any>(`/blog/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/blog/${id}/`, {
      method: "DELETE",
    }),
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
  }) =>
    apiRequest<any>("/testimonials/", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: any) =>
    apiRequest<any>(`/testimonials/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiRequest<void>(`/testimonials/${id}/`, {
      method: "DELETE",
    }),
};

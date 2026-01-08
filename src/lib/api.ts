/**
 * API Client - Axios wrapper with error handling and type safety
 */
import axios, { AxiosInstance, AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/config";

interface ApiResponse<T> {
  data?: T;
  success: boolean;
  error?: {
    status: number;
    message: string;
  };
}

class ApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("access_token");
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get<T>(url, { params });
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post<T>(url, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put<T>(url, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch<T>(url, data);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete<T>(url);
      return {
        data: response.data,
        success: true,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<never> {
    if (axios.isAxiosError(error)) {
      const data: any = error.response?.data;
      const drfValidationMessage = (() => {
        if (!data || typeof data !== "object") return null;
        if (typeof data.detail === "string") return data.detail;
        if (typeof data.error === "string") return data.error;
        // DRF field errors: { field: ["msg"] }
        const entries = Object.entries(data) as Array<[string, any]>;
        const first = entries.find(([, v]) => Array.isArray(v) && v.length > 0);
        if (first) {
          const [field, messages] = first;
          const msg = Array.isArray(messages) ? messages[0] : String(messages);
          return `${field}: ${msg}`;
        }
        return null;
      })();

      return {
        success: false,
        error: {
          status: error.response?.status || 500,
          message:
            drfValidationMessage ||
            data?.error?.message ||
            error.message ||
            "An error occurred",
        },
      };
    }
    return {
      success: false,
      error: {
        status: 500,
        message: "An unexpected error occurred",
      },
    };
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };

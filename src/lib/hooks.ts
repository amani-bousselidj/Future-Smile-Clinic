/**
 * Custom hooks for API calls with loading and error states
 */
"use client";

import { useState, useCallback, useEffect } from "react";
import { apiClient, ApiResponse } from "@/lib/api";

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      method: "get" | "post" | "put" | "patch" | "delete",
      url: string,
      payload?: object
    ) => {
      setLoading(true);
      setError(null);

      try {
        let response: ApiResponse<T>;

        switch (method) {
          case "get":
            response = await apiClient.get<T>(url, payload);
            break;
          case "post":
            response = await apiClient.post<T>(url, payload);
            break;
          case "put":
            response = await apiClient.put<T>(url, payload);
            break;
          case "patch":
            response = await apiClient.patch<T>(url, payload);
            break;
          case "delete":
            response = await apiClient.delete<T>(url);
            break;
        }

        if (response.success && response.data) {
          setData(response.data);
          return response.data;
        } else {
          const errorMessage = response.error?.message || "An error occurred";
          setError(errorMessage);
          throw new Error(errorMessage);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "An unexpected error occurred";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, execute };
}

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get<T>(url);
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.error?.message || "Failed to fetch data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export function useForm<T extends Record<string, any>>(
  onSubmit: (values: T) => Promise<void>
) {
  const [values, setValues] = useState<T>({} as T);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      setValues((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name as keyof T]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof T];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setSuccess(false);

      try {
        await onSubmit(values);
        setSuccess(true);
        setValues({} as T);
        setErrors({});
      } catch (err) {
        if (err instanceof Error && err.message.includes("validation")) {
          // Handle validation errors
          const validationErrors = JSON.parse(err.message);
          setErrors(validationErrors as Partial<Record<keyof T, string>>);
        } else {
          const errorMessage =
            err instanceof Error ? err.message : "An error occurred";
          setErrors({ ["_form" as keyof T]: errorMessage } as Partial<
            Record<keyof T, string>
          >);
        }
      } finally {
        setLoading(false);
      }
    },
    [values, onSubmit]
  );

  const reset = useCallback(() => {
    setValues({} as T);
    setErrors({});
    setSuccess(false);
  }, []);

  return {
    values,
    errors,
    loading,
    success,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  };
}

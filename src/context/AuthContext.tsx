/**
 * Authentication Context - Manages user authentication state
 */
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { User } from "@/types";
import { apiClient } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const response = await apiClient.get<User>("/api/auth/me/");
          if (response.success && response.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        localStorage.removeItem("access_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post<{ access: string; user: User }>(
        "/api/auth/login/",
        { email, password }
      );

      if (response.success && response.data) {
        localStorage.setItem("access_token", response.data.access);
        setUser(response.data.user);
      } else {
        throw new Error(response.error?.message || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const response = await apiClient.post<User>(
        "/api/auth/register/",
        userData
      );

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error?.message || "Registration failed");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    setUser(null);
  }, []);

  const updateUser = useCallback(async (userData: Partial<User>) => {
    try {
      const response = await apiClient.put<User>("/api/auth/me/", userData);

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        throw new Error(response.error?.message || "Update failed");
      }
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

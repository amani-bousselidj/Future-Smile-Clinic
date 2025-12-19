"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verify = () => {
      const isValid = checkAuth();
      if (!isValid && !isLoading) {
        router.push("/login");
      }
      setChecking(false);
    };

    verify();
  }, [isAuthenticated, isLoading, router, checkAuth]);

  if (isLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <FaSpinner className="text-6xl text-primary-light animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">جاري التحقق من الصلاحيات...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

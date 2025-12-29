/**
 * Login Page - Arabic Version
 */
"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useForm } from "@/lib/hooks";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { addNotification } = useApp();

  const { values, errors, loading, handleChange, handleSubmit } =
    useForm<LoginFormData>(async (formData) => {
      try {
        await login(formData.email, formData.password);
        addNotification({
          type: "success",
          message: "تم تسجيل الدخول بنجاح!",
        });
        router.push("/");
      } catch (error) {
        addNotification({
          type: "error",
          message: "بريد إلكتروني أو كلمة مرور غير صحيحة",
        });
        throw error;
      }
    });

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="w-full max-w-md">
        <Card shadow="lg" padding="lg" className="bg-white border-0">
          <div className="text-center mb-10">
            <div className="inline-block w-16 h-16 bg-gradient-to-b from-blue-600 to-blue-400 rounded-xl flex items-center justify-center mb-4">
              <span className="text-white font-bold text-2xl">FS</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">أهلاً وسهلاً</h1>
            <p className="text-gray-600 mt-2 text-lg">
              سجل دخولك للمتابعة مع عيادتك
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              label="البريد الإلكتروني"
              value={values.email || ""}
              onChange={handleChange}
              error={errors.email}
              required
              placeholder="أدخل بريدك الإلكتروني"
            />

            <Input
              type="password"
              name="password"
              label="كلمة المرور"
              value={values.password || ""}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="أدخل كلمة المرور"
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg"
            >
              {loading ? "جاري التحقق..." : "دخول"}
            </Button>
          </form>

          <div className="mt-8 space-y-4">
            <div className="text-center">
              <p className="text-gray-700">
                ليس لديك حساب؟{" "}
                <Link
                  href="/register"
                  className="text-blue-600 font-bold hover:text-blue-700 hover:underline"
                >
                  اشترك الآن
                </Link>
              </p>
            </div>

            <div className="text-center border-t pt-4">
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                هل نسيت كلمة المرور؟
              </Link>
            </div>
          </div>
        </Card>

        <p className="text-center text-gray-600 text-sm mt-6">
          باستخدامك لعيادة ابتسامة المستقبل، فأنت تقبل الشروط والأحكام
        </p>
      </div>
    </div>
  );
}

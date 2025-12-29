/**
 * Register Page - Arabic Version
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

interface RegisterFormData {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { addNotification } = useApp();

  const { values, errors, loading, handleChange, handleSubmit } =
    useForm<RegisterFormData>(async (formData) => {
      if (formData.password !== formData.password_confirm) {
        throw new Error("كلمات المرور غير متطابقة");
      }

      try {
        await register({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
        addNotification({
          type: "success",
          message: "تم إنشاء حسابك بنجاح!",
        });
        router.push("/");
      } catch (error) {
        addNotification({
          type: "error",
          message: "فشل التسجيل. يرجى المحاولة مرة أخرى.",
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
            <h1 className="text-4xl font-bold text-gray-900">إنشاء حساب</h1>
            <p className="text-gray-600 mt-2 text-lg">انضم إلى عيادة ابتسامة المستقبل</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              name="full_name"
              label="الاسم الكامل"
              value={values.full_name || ""}
              onChange={handleChange}
              error={errors.full_name}
              required
              placeholder="أدخل اسمك الكامل"
            />

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
              type="tel"
              name="phone"
              label="رقم الجوال (اختياري)"
              value={values.phone || ""}
              onChange={handleChange}
              error={errors.phone}
              placeholder="أدخل رقم جوالك"
            />

            <Input
              type="password"
              name="password"
              label="كلمة المرور"
              value={values.password || ""}
              onChange={handleChange}
              error={errors.password}
              required
              placeholder="أدخل كلمة مرور قوية"
            />

            <Input
              type="password"
              name="password_confirm"
              label="تأكيد كلمة المرور"
              value={values.password_confirm || ""}
              onChange={handleChange}
              error={errors.password_confirm}
              required
              placeholder="أعد إدخال كلمة المرور"
            />

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              isLoading={loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg"
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </Button>
          </form>

          <div className="mt-8 text-center border-t pt-6">
            <p className="text-gray-700">
              هل لديك حساب بالفعل؟{" "}
              <Link href="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline">
                سجل دخول
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center text-gray-600 text-sm mt-6">
          بالتسجيل في عيادة ابتسامة المستقبل، أنت توافق على شروطنا
        </p>
      </div>
    </div>
  );
}

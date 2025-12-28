/**
 * Login Page
 */
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useForm } from '@/lib/hooks';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { addNotification } = useApp();

  const { values, errors, loading, handleChange, handleSubmit } = useForm<LoginFormData>(
    async (formData) => {
      try {
        await login(formData.email, formData.password);
        addNotification({
          type: 'success',
          message: 'Logged in successfully!',
        });
        router.push('/');
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Invalid email or password',
        });
        throw error;
      }
    }
  );

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card shadow="lg" padding="lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              label="Email Address"
              value={values.email || ''}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              type="password"
              name="password"
              label="Password"
              value={values.password || ''}
              onChange={handleChange}
              error={errors.password}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-gray-600 hover:text-blue-600">
              Forgot password?
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

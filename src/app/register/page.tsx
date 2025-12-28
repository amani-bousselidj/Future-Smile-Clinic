/**
 * Register Page
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

  const { values, errors, loading, handleChange, handleSubmit } = useForm<RegisterFormData>(
    async (formData) => {
      if (formData.password !== formData.password_confirm) {
        throw new Error('Passwords do not match');
      }

      try {
        await register({
          full_name: formData.full_name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
        addNotification({
          type: 'success',
          message: 'Account created successfully!',
        });
        router.push('/');
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Registration failed. Please try again.',
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
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-600">Join Future Smile Clinic</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              name="full_name"
              label="Full Name"
              value={values.full_name || ''}
              onChange={handleChange}
              error={errors.full_name}
              required
            />

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
              type="tel"
              name="phone"
              label="Phone (Optional)"
              value={values.phone || ''}
              onChange={handleChange}
              error={errors.phone}
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

            <Input
              type="password"
              name="password_confirm"
              label="Confirm Password"
              value={values.password_confirm || ''}
              onChange={handleChange}
              error={errors.password_confirm}
              required
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

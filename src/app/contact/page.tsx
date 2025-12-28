/**
 * Contact Page
 */
'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useForm, useApi } from '@/lib/hooks';
import { useApp } from '@/context/AppContext';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const { addNotification } = useApp();
  const { execute } = useApi();

  const { values, errors, loading, handleChange, handleSubmit, reset } = 
    useForm<ContactFormData>(async (formData) => {
      try {
        await execute('post', '/api/contact-messages/', formData);
        addNotification({
          type: 'success',
          message: 'Message sent successfully! We will contact you soon.',
        });
        reset();
      } catch (error) {
        addNotification({
          type: 'error',
          message: 'Failed to send message. Please try again.',
        });
        throw error;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
        <p className="text-gray-600 text-lg">
          Have questions? We're here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card shadow="md">
            <h3 className="text-lg font-semibold mb-2">📞 Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
          </Card>

          <Card shadow="md">
            <h3 className="text-lg font-semibold mb-2">📧 Email</h3>
            <p className="text-gray-600">info@futuresmileclinic.com</p>
          </Card>

          <Card shadow="md">
            <h3 className="text-lg font-semibold mb-2">📍 Address</h3>
            <p className="text-gray-600">
              123 Smile Street<br />
              Dental City, DC 12345<br />
              USA
            </p>
          </Card>

          <Card shadow="md">
            <h3 className="text-lg font-semibold mb-2">🕐 Hours</h3>
            <p className="text-gray-600">
              Mon-Fri: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card shadow="lg" padding="lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  value={values.name || ''}
                  onChange={handleChange}
                  error={errors.name}
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
              </div>

              <Input
                type="tel"
                name="phone"
                label="Phone Number"
                value={values.phone || ''}
                onChange={handleChange}
                error={errors.phone}
              />

              <Input
                type="text"
                name="subject"
                label="Subject"
                value={values.subject || ''}
                onChange={handleChange}
                error={errors.subject}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={values.message || ''}
                  onChange={handleChange}
                  placeholder="Tell us what you need..."
                  rows={6}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.message && (
                  <span className="text-sm text-red-600 mt-1">{errors.message}</span>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={loading}
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <Card shadow="md" padding="none">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1825516524!2d-74.00601!3d40.71278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDC402sIDQyJzUwLjEiTiA3NMKwIDAn MjEuNiJX!5e0!3m2!1sen!2sus!4v1234567890"
            width="100%"
            height="400"
            loading="lazy"
            className="rounded-lg"
            title="Future Smile Clinic Location"
          />
        </Card>
      </div>
    </div>
  );
}

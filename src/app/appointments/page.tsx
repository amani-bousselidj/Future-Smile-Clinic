/**
 * Appointments Booking Page
 */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useApi, useForm } from "@/lib/hooks";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

interface Service {
  id: number;
  name: string;
  price_min: number;
  price_max: number;
  duration_minutes: number;
}

interface Doctor {
  id: number;
  first_name: string;
  last_name: string;
  specialization: string;
}

interface BookingFormData {
  service_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  patient_full_name: string;
  patient_phone: string;
  patient_email: string;
  notes: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { addNotification } = useApp();
  const { execute } = useApi();

  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Load services and doctors
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const servicesResponse = await execute(
          "get",
          "/api/services/?is_active=true"
        );
        const doctorsResponse = await execute("get", "/api/doctors/");

        if (servicesResponse) {
          const servicesList = Array.isArray(servicesResponse) ? servicesResponse : (servicesResponse as any)?.results || [];
          setServices(servicesList);
        }
        if (doctorsResponse) {
          const doctorsList = Array.isArray(doctorsResponse) ? doctorsResponse : (doctorsResponse as any)?.results || [];
          setDoctors(doctorsList);
        }
      } catch (error) {
        addNotification({
          type: "error",
          message: "Failed to load services and doctors",
        });
      }
    };

    loadData();
  }, []);

  const {
    values,
    handleChange,
    handleSubmit,
    loading: isSubmitting,
  } = useForm<BookingFormData>(async (formData) => {
    try {
      const response = await execute("post", "/api/appointments/", {
        ...formData,
        service_id: parseInt(formData.service_id),
        doctor_id: parseInt(formData.doctor_id),
      });

      if (response) {
        addNotification({
          type: "success",
          message:
            "Appointment booked successfully! Booking ID: " +
            response.booking_id,
        });
        router.push("/");
      }
    } catch (error) {
      addNotification({
        type: "error",
        message: "Failed to book appointment",
      });
      throw error;
    }
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Book an Appointment</h1>
        <p className="text-gray-600">
          Schedule your dental care with our experienced team
        </p>
      </div>

      <Card shadow="lg" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service *
            </label>
            <select
              name="service_id"
              value={values.service_id || ""}
              onChange={(e) => {
                handleChange(e);
                const service = services.find(
                  (s) => s.id === parseInt(e.target.value)
                );
                setSelectedService(service || null);
              }}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price_min}-${service.price_max}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Doctor *
            </label>
            <select
              name="doctor_id"
              value={values.doctor_id || ""}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.first_name} {doctor.last_name} -{" "}
                  {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              name="appointment_date"
              label="Appointment Date"
              value={values.appointment_date || ""}
              onChange={handleChange}
              required
            />
            <Input
              type="time"
              name="appointment_time"
              label="Appointment Time"
              value={values.appointment_time || ""}
              onChange={handleChange}
              required
            />
          </div>

          {/* Patient Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="space-y-4">
              <Input
                type="text"
                name="patient_full_name"
                label="Full Name"
                value={values.patient_full_name || user?.full_name || ""}
                onChange={handleChange}
                required
              />
              <Input
                type="email"
                name="patient_email"
                label="Email"
                value={values.patient_email || user?.email || ""}
                onChange={handleChange}
                required
              />
              <Input
                type="tel"
                name="patient_phone"
                label="Phone Number"
                value={values.patient_phone || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={values.notes || ""}
              onChange={handleChange}
              placeholder="Any additional information for your appointment..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Service Summary */}
          {selectedService && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Summary</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Service:{" "}
                  <span className="font-semibold">{selectedService.name}</span>
                </p>
                <p>
                  Duration:{" "}
                  <span className="font-semibold">
                    {selectedService.duration_minutes} minutes
                  </span>
                </p>
                <p>
                  Price:{" "}
                  <span className="font-semibold">
                    ${selectedService.price_min} - ${selectedService.price_max}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting}>
            Confirm Appointment
          </Button>
        </form>
      </Card>
    </div>
  );
}

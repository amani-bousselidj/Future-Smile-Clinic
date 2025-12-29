// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: any;
}

// Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "staff" | "patient";
  full_name: string;
  avatar?: string;
  created_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Patient Types
export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  medical_history?: string;
  created_at: string;
  updated_at: string;
}

// Service Types
export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price_min: number;
  price_max?: number;
  duration_minutes: number;
  image_url?: string;
  is_active: boolean;
}

// Appointment Types
export interface Appointment {
  id: number;
  booking_id: string;
  patient: Patient;
  service: Service;
  appointment_date: string;
  appointment_time: string;
  queue_number: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at: string;
  updated_at: string;
  estimated_wait_minutes?: number;
}

export interface CreateAppointmentRequest {
  patient_name: string;
  patient_phone: string;
  patient_email?: string;
  service_id: number;
  appointment_date: string;
  notes?: string;
}

// Queue Types
export interface QueuePosition {
  queue_number: number;
  appointment_id: number;
  estimated_wait_minutes: number;
  status: string;
}

export interface QueueStatistics {
  service_id: number;
  date: string;
  total_appointments: number;
  completed_appointments: number;
  average_wait_minutes: number;
  min_wait_minutes: number;
  max_wait_minutes: number;
}

// Pagination
export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}

// Form Types
export interface AppointmentFormData {
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  serviceId: number;
  appointmentDate: string;
  notes?: string;
}

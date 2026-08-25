export type UserRole = 'customer' | 'mechanic' | 'admin';
export type AdminRole = 'super_admin' | 'operations_admin' | 'finance_admin' | 'support_admin';

export type JobStatus =
  | 'request_submitted'
  | 'mechanic_searching'
  | 'mechanic_accepted'
  | 'mechanic_travelling'
  | 'mechanic_arrived'
  | 'work_started'
  | 'work_completed'
  | 'payment'
  | 'completed_reviewed'
  | 'cancelled';

export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'cash' | 'card' | 'other';
export type FuelType = 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'unknown';
export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: UserRole;
  admin_role: AdminRole | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  customer_id: string;
  registration_number: string;
  make: string;
  model: string;
  year: number | null;
  fuel_type: FuelType;
  engine_details: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  base_price: number;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  customer_id: string;
  mechanic_id: string | null;
  vehicle_id: string | null;
  service_id: string | null;
  service_name: string;
  problem_description: string;
  status: JobStatus;
  customer_latitude: number | null;
  customer_longitude: number | null;
  customer_location_text: string;
  estimated_price: number;
  final_price: number;
  platform_fee: number;
  mechanic_earnings: number;
  work_performed: string;
  parts_used: string;
  labour_charge: number;
  additional_charges: number;
  final_notes: string;
  mechanic_eta_minutes: number | null;
  accepted_at: string | null;
  travelling_at: string | null;
  arrived_at: string | null;
  work_started_at: string | null;
  work_completed_at: string | null;
  payment_completed_at: string | null;
  cancelled_at: string | null;
  cancel_reason: string;
  created_at: string;
  updated_at: string;
}

export interface JobStatusHistory {
  id: string;
  job_id: string;
  status: JobStatus;
  changed_by: string | null;
  notes: string;
  created_at: string;
}

export interface JobPhoto {
  id: string;
  job_id: string;
  photo_url: string;
  photo_type: 'customer' | 'before' | 'after';
  uploaded_by: string | null;
  created_at: string;
}

export interface MechanicLocation {
  id: string;
  mechanic_id: string;
  latitude: number | null;
  longitude: number | null;
  is_online: boolean;
  last_updated: string;
}

export interface MechanicVerification {
  id: string;
  mechanic_id: string;
  verification_status: VerificationStatus;
  national_id: string;
  qualifications: string;
  certifications: string;
  workshop_info: string;
  document_urls: string[];
  reviewed_by: string | null;
  review_notes: string;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface MechanicProfile {
  id: string;
  mechanic_id: string;
  skills: string;
  specializations: string;
  years_experience: number;
  services_offered: string[];
  vehicle_types_supported: string[];
  working_hours: string;
  emergency_available: boolean;
  mpesa_phone: string;
  service_area: string;
  is_available: boolean;
  total_jobs: number;
  total_earnings: number;
  total_fees_paid: number;
  rating_avg: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  job_id: string;
  customer_id: string;
  mechanic_id: string | null;
  amount: number;
  platform_fee: number;
  mechanic_earnings: number;
  payment_type: 'job_payment' | 'platform_fee' | 'refund';
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  mpesa_reference: string;
  created_at: string;
  completed_at: string | null;
}

export interface Review {
  id: string;
  job_id: string;
  customer_id: string;
  mechanic_id: string;
  rating: number;
  written_review: string;
  photo_url: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface Dispute {
  id: string;
  job_id: string;
  filed_by: string;
  against_user_id: string;
  subject: string;
  description: string;
  status: DisputeStatus;
  resolution: string;
  resolved_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface PlatformSettings {
  id: number;
  platform_fee_percentage: number;
  platform_name: string;
  support_email: string;
  support_phone: string;
  created_at: string;
  updated_at: string;
}

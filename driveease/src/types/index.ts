export type UserRole = 'admin' | 'customer' | 'staff';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  created_at?: string;
}

export interface CustomerProfile {
  id: string | number;
  user_id: string | number;
  nik: string;
  sim_number: string;
  address: string;
  phone: string;
  emergency_contact?: string;
  verified_status: 'pending' | 'verified' | 'rejected';
}

export type TransmissionType = 'manual' | 'automatic';
export type FuelType = 'bensin' | 'diesel' | 'listrik' | 'hybrid';
export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'reserved';

export interface VehicleCategory {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
}

export interface Vehicle {
  id: string | number;
  name: string;
  brand: string;
  model_type: string;
  category_id: string | number;
  category_name?: string;
  license_plate: string;
  year: number;
  transmission: TransmissionType;
  passenger_capacity: number;
  price_per_day: number;
  fuel_type: FuelType;
  description: string;
  image_url: string;
  additional_images?: string[];
  status: VehicleStatus;
  mileage: number;
  features?: string[];
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string | number;
  booking_code: string;
  customer_id: string | number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  vehicle_id: string | number;
  vehicle?: Vehicle;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_rate: number;
  subtotal: number;
  down_payment_required: number;
  paid_amount: number;
  remaining_payment: number;
  deposit_amount: number;
  total_amount: number;
  status: BookingStatus;
  payment_status: 'unpaid' | 'partial' | 'paid' | 'refunded';
  notes?: string;
  created_at: string;
}

export type PaymentMethod = 'bank_transfer' | 'qris' | 'credit_card' | 'cash';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type PaymentType = 'down_payment' | 'full_payment' | 'settlement' | 'penalty';

export interface Payment {
  id: string | number;
  booking_id: string | number;
  booking_code?: string;
  customer_name?: string;
  amount: number;
  payment_type: PaymentType;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  proof_url?: string;
  bank_name?: string;
  transaction_ref?: string;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
}

export interface VehicleHandover {
  id: string | number;
  booking_id: string | number;
  staff_id: string | number;
  staff_name?: string;
  handover_date: string;
  start_mileage: number;
  fuel_level: number; // percentage 0 - 100
  condition_checklist: {
    body_clean: boolean;
    interior_clean: boolean;
    tires_condition: boolean;
    spare_tire: boolean;
    tools_complete: boolean;
    stnk_present: boolean;
  };
  condition_notes?: string;
  photos: string[];
}

export interface VehicleReturn {
  id: string | number;
  booking_id: string | number;
  staff_id: string | number;
  staff_name?: string;
  return_date: string;
  actual_return_date: string;
  end_mileage: number;
  fuel_level: number;
  late_hours: number;
  late_fee: number;
  damage_fee: number;
  fuel_charge: number;
  total_penalty: number;
  damage_notes?: string;
  photos: string[];
  status: 'inspected' | 'settled' | 'needs_maintenance';
}

export interface MaintenanceRecord {
  id: string | number;
  vehicle_id: string | number;
  vehicle_name?: string;
  license_plate?: string;
  service_date: string;
  service_type: 'periodic' | 'repair' | 'tire' | 'oil_change' | 'emergency';
  cost: number;
  workshop_name: string;
  description: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  odometer_at_service: number;
  next_service_mileage?: number;
}


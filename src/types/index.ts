// ─── Auth Types ─────────────────────────────────────────────────────────────
export interface User {
  id: string|number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ─── Vehicle Types ───────────────────────────────────────────────────────────
export interface Vehicle {
  id: number|string;

  brand: string;

  model: string;

  year: number;

  registration_number: string;

  created_at?: string;
}

export interface CreateVehiclePayload {
  brand: string;

  model: string;

  year: number;

  registration_number: string;
}

// ─── Booking Types ───────────────────────────────────────────────────────────
export type ServiceType =
  | 'full_service'
  | 'oil_change'
  | 'tyre_change'
  | 'tyre_rotation'
  | 'ac_repair'
  | 'battery_check'
  | 'brake_inspection'
  | 'general_checkup';

export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  vehicleId: Vehicle;
  serviceType: ServiceType;
  scheduledDate: string;
  scheduledSlot: string;
  status: BookingStatus;
  price: number;
  notes?: string;
  mechanicName?: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

export interface CreateBookingPayload {
  vehicleId: string | Number;
  serviceDate: string;
  serviceType: ServiceType;
  serviceTime: string;
  amount: number;
  notes?: string;
}



// ─── Payment Types ───────────────────────────────────────────────────────────
export interface CreateOrderPayload {
  bookingId: string;
  amount: number;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  bookingId: string;
}

export interface VerifyPaymentPayload {
  bookingId: string;
  orderId: string;
  paymentId: string;
  signature: string;
}

// ─── Admin Types ─────────────────────────────────────────────────────────────
export interface UpdateBookingStatusPayload {
  status: BookingStatus;
}

// ─── API Response Types ──────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── UI / Misc ───────────────────────────────────────────────────────────────
export interface ServiceInfo {
  key: ServiceType;
  label: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
}

export const SERVICE_CATALOG: ServiceInfo[] = [
  { key: 'full_service',     label: 'Full Car Service',   description: 'Complete bumper-to-bumper check', price: 1499, duration: '3–4 hrs', icon: '🔧' },
  { key: 'oil_change',       label: 'Oil Change',         description: 'Engine oil + filter replacement',  price:  699, duration: '1 hr',   icon: '🛢️' },
  { key: 'tyre_change',      label: 'Tyre Change',        description: 'Replace one or all tyres',        price:  799, duration: '1–2 hrs', icon: '🛞' },
  { key: 'tyre_rotation',    label: 'Tyre Rotation',      description: 'Extend tyre life & grip',         price:  399, duration: '45 min', icon: '🔄' },
  { key: 'ac_repair',        label: 'AC Repair',          description: 'Cooling system diagnostics & fix',price: 2299, duration: '2–3 hrs', icon: '❄️' },
  { key: 'battery_check',    label: 'Battery Service',    description: 'Test, replace or jump-start',     price:  999, duration: '30 min', icon: '🔋' },
  { key: 'brake_inspection', label: 'Brake Inspection',   description: 'Pads, rotors, fluid check',       price:  599, duration: '1 hr',   icon: '🛑' },
  { key: 'general_checkup',  label: 'General Checkup',    description: '20-point health inspection',      price:  499, duration: '1 hr',   icon: '🩺' },
];

export const TIME_SLOTS = [
  '08:00 AM – 09:00 AM',
  '09:00 AM – 10:00 AM',
  '10:00 AM – 11:00 AM',
  '11:00 AM – 12:00 PM',
  '01:00 PM – 02:00 PM',
  '02:00 PM – 03:00 PM',
  '03:00 PM – 04:00 PM',
  '04:00 PM – 05:00 PM',
];

export const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; dot: string }> = {
  pending:     { label: 'Pending',     color: 'bg-amber-50 text-amber-800 border-amber-200',   dot: 'bg-amber-400' },
  confirmed:   { label: 'Confirmed',   color: 'bg-blue-50 text-blue-800 border-blue-200',      dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', color: 'bg-purple-50 text-purple-800 border-purple-200',dot: 'bg-purple-500' },
  completed:   { label: 'Completed',   color: 'bg-green-50 text-green-800 border-green-200',   dot: 'bg-green-500' },
  cancelled:   { label: 'Cancelled',   color: 'bg-red-50 text-red-800 border-red-200',         dot: 'bg-red-400' },
};

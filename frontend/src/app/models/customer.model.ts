export interface Customer {
  id: string;
  customerId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  customer: Customer;
} 
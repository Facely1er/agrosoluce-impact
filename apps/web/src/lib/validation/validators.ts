/**
 * Data Validation Utilities for AgroSoluce
 * Provides validation functions for all entity types
 */

import type {
  Cooperative,
  Product,
  Order,
  UserProfile,
} from '@/types';
import type { SignUpData } from '@/lib/auth/authService';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (supports international format)
 */
export function validatePhone(phone: string): boolean {
  // Remove spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Check if it's a valid phone number (7-15 digits, optionally starting with +)
  const phoneRegex = /^\+?[1-9]\d{6,14}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationResult {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate GPS coordinates
 */
export function validateCoordinates(latitude: number, longitude: number): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  );
}

/**
 * Sanitize string input (prevent XSS)
 */
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate cooperative data
 */
export function validateCooperative(cooperative: Partial<Cooperative>): ValidationResult {
  const errors: string[] = [];

  if (!cooperative.name || cooperative.name.trim().length === 0) {
    errors.push('Cooperative name is required');
  }

  if (cooperative.name && cooperative.name.length > 255) {
    errors.push('Cooperative name must be less than 255 characters');
  }

  if (cooperative.email && !validateEmail(cooperative.email)) {
    errors.push('Invalid email format');
  }

  if (cooperative.phone && !validatePhone(cooperative.phone)) {
    errors.push('Invalid phone number format');
  }

  if (
    cooperative.latitude !== undefined &&
    cooperative.longitude !== undefined &&
    !validateCoordinates(cooperative.latitude, cooperative.longitude)
  ) {
    errors.push('Invalid GPS coordinates');
  }

  if (cooperative.region && cooperative.region.length > 100) {
    errors.push('Region must be less than 100 characters');
  }

  if (cooperative.department && cooperative.department.length > 100) {
    errors.push('Department must be less than 100 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate product data
 */
export function validateProduct(product: Partial<Product>): ValidationResult {
  const errors: string[] = [];

  if (!product.name || product.name.trim().length === 0) {
    errors.push('Product name is required');
  }

  if (product.name && product.name.length > 255) {
    errors.push('Product name must be less than 255 characters');
  }

  if (!product.cooperative_id) {
    errors.push('Cooperative ID is required');
  }

  if (product.price !== undefined && product.price < 0) {
    errors.push('Price cannot be negative');
  }

  if (product.quantity_available !== undefined && product.quantity_available < 0) {
    errors.push('Quantity available cannot be negative');
  }

  if (product.currency && product.currency.length > 10) {
    errors.push('Currency code must be less than 10 characters');
  }

  if (product.unit && product.unit.length > 50) {
    errors.push('Unit must be less than 50 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate order data
 */
export function validateOrder(order: Partial<Order>): ValidationResult {
  const errors: string[] = [];

  if (!order.buyer_id) {
    errors.push('Buyer ID is required');
  }

  if (!order.cooperative_id) {
    errors.push('Cooperative ID is required');
  }

  if (order.total_amount === undefined || order.total_amount <= 0) {
    errors.push('Total amount must be greater than 0');
  }

  if (order.currency && order.currency.length > 10) {
    errors.push('Currency code must be less than 10 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate sign up data
 */
export function validateSignUp(data: Partial<SignUpData>): ValidationResult {
  const errors: string[] = [];

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password) {
    errors.push('Password is required');
  } else {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
  }

  if (!data.fullName || data.fullName.trim().length === 0) {
    errors.push('Full name is required');
  }

  if (data.fullName && data.fullName.length > 255) {
    errors.push('Full name must be less than 255 characters');
  }

  if (!data.userType) {
    errors.push('User type is required');
  }

  if (data.userType && !['buyer', 'cooperative', 'admin'].includes(data.userType)) {
    errors.push('Invalid user type');
  }

  if (data.phoneNumber && !validatePhone(data.phoneNumber)) {
    errors.push('Invalid phone number format');
  }

  if (data.organizationName && data.organizationName.length > 255) {
    errors.push('Organization name must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate user profile data
 */
export function validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
  const errors: string[] = [];

  if (!profile.email || !validateEmail(profile.email)) {
    errors.push('Valid email is required');
  }

  if (profile.full_name && profile.full_name.length > 255) {
    errors.push('Full name must be less than 255 characters');
  }

  if (profile.phone_number && !validatePhone(profile.phone_number)) {
    errors.push('Invalid phone number format');
  }

  if (!profile.user_type) {
    errors.push('User type is required');
  }

  if (profile.user_type && !['buyer', 'cooperative', 'admin'].includes(profile.user_type)) {
    errors.push('Invalid user type');
  }

  if (profile.organization_name && profile.organization_name.length > 255) {
    errors.push('Organization name must be less than 255 characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize cooperative data
 */
export function sanitizeCooperative(cooperative: Partial<Cooperative>): Partial<Cooperative> {
  return {
    ...cooperative,
    name: cooperative.name ? sanitizeString(cooperative.name) : undefined,
    region: cooperative.region ? sanitizeString(cooperative.region) : undefined,
    department: cooperative.department ? sanitizeString(cooperative.department) : undefined,
    commune: cooperative.commune ? sanitizeString(cooperative.commune) : undefined,
    sector: cooperative.sector ? sanitizeString(cooperative.sector) : undefined,
    description: cooperative.description ? sanitizeString(cooperative.description) : undefined,
    address: cooperative.address ? sanitizeString(cooperative.address) : undefined,
  };
}

/**
 * Sanitize product data
 */
export function sanitizeProduct(product: Partial<Product>): Partial<Product> {
  return {
    ...product,
    name: product.name ? sanitizeString(product.name) : undefined,
    description: product.description ? sanitizeString(product.description) : undefined,
    unit: product.unit ? sanitizeString(product.unit) : undefined,
  };
}


/**
 * Unit tests for validation utilities
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateCoordinates,
  validateCooperative,
  validateProduct,
  validateOrder,
  validateSignUp,
  sanitizeString,
} from '@/lib/validation/validators';

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should validate correct phone numbers', () => {
      expect(validatePhone('+2251234567890')).toBe(true);
      expect(validatePhone('1234567890')).toBe(true);
      expect(validatePhone('+1-234-567-8900')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123')).toBe(false);
      expect(validatePhone('abc')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate correct coordinates', () => {
      expect(validateCoordinates(5.3599, -4.0083)).toBe(true); // Abidjan
      expect(validateCoordinates(0, 0)).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(NaN, 0)).toBe(false);
    });
  });

  describe('validateCooperative', () => {
    it('should validate correct cooperative data', () => {
      const result = validateCooperative({
        name: 'Test Cooperative',
        email: 'test@example.com',
        phone: '+2251234567890',
        latitude: 5.3599,
        longitude: -4.0083,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid cooperative data', () => {
      const result = validateCooperative({
        name: '',
        email: 'invalid-email',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('validateProduct', () => {
    it('should validate correct product data', () => {
      const result = validateProduct({
        name: 'Cocoa Beans',
        cooperative_id: '123e4567-e89b-12d3-a456-426614174000',
        price: 1000,
        quantity_available: 100,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid product data', () => {
      const result = validateProduct({
        name: '',
        price: -100,
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateOrder', () => {
    it('should validate correct order data', () => {
      const result = validateOrder({
        buyer_id: '123e4567-e89b-12d3-a456-426614174000',
        cooperative_id: '123e4567-e89b-12d3-a456-426614174001',
        total_amount: 1000,
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid order data', () => {
      const result = validateOrder({
        total_amount: -100,
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('validateSignUp', () => {
    it('should validate correct sign up data', () => {
      const result = validateSignUp({
        email: 'test@example.com',
        password: 'StrongPass123!',
        fullName: 'Test User',
        userType: 'buyer',
      });
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid sign up data', () => {
      const result = validateSignUp({
        email: 'invalid',
        password: 'weak',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should sanitize potentially dangerous strings', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).not.toContain('<script>');
      expect(sanitizeString('javascript:alert("xss")')).not.toContain('javascript:');
    });

    it('should preserve safe strings', () => {
      expect(sanitizeString('Safe String')).toBe('Safe String');
    });
  });
});


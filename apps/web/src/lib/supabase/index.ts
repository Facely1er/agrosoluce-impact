// Export Supabase client and utilities
export { 
  supabase, 
  getCurrentUser, 
  signOut, 
  schemaManager,
  isSupabaseConfigured,
  getSupabaseConfigStatus,
  getSupabaseClient
} from './client';

// Re-export types from main types file
export type {
  Cooperative,
  Product,
  ProductCategory,
  UserProfile,
  Buyer,
  Order,
  OrderItem,
  Message,
  Transaction,
  VerificationStatus,
  OrderStatus,
  UserType
} from '@/types';


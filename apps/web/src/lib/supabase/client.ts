// Supabase client configuration for AgroSoluce
// Using public schema (Supabase only supports 'public' or 'graphql_public')

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const defaultSchema = 'public'; // Supabase only allows 'public' or 'graphql_public'

// Validation function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Get configuration status for debugging
export const getSupabaseConfigStatus = () => {
  return {
    urlConfigured: !!supabaseUrl,
    keyConfigured: !!supabaseAnonKey,
    schema: defaultSchema,
    isConfigured: isSupabaseConfigured(),
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'not set',
  };
};

// Log configuration in development
if (import.meta.env.DEV) {
  const configStatus = getSupabaseConfigStatus();
  console.log('AgroSoluce Supabase initialization:', configStatus);
  
  if (!configStatus.isConfigured) {
    console.warn(
      '⚠️ Supabase environment variables are missing.\n' +
      'Please set the following environment variables:\n' +
      '  - VITE_SUPABASE_URL\n' +
      '  - VITE_SUPABASE_ANON_KEY\n' +
      '\n' +
      'The app will run but database features will not be available.'
    );
  }
}

// Create Supabase client with public schema
let supabaseInstance: SupabaseClient | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      global: {
        fetch: (...args) => {
          if (import.meta.env.DEV) {
            console.log('Supabase fetch:', args[0]);
          }
          return fetch(...args);
        }
      },
      db: {
        schema: 'public'
      }
    });
    
    if (import.meta.env.DEV) {
      console.log('✅ Supabase client initialized successfully');
    }
  } else {
    if (import.meta.env.DEV) {
      console.warn('⚠️ Supabase client not initialized - missing environment variables');
    }
  }
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  supabaseInstance = null;
}

export const supabase: SupabaseClient | null = supabaseInstance;

// Helper function to check if user is authenticated
export const getCurrentUser = async () => {
  if (!supabase) {
    return null;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  if (!supabase) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Helper function to get Supabase client or throw a helpful error
export const getSupabaseClient = (): SupabaseClient => {
  if (!supabase) {
    const configStatus = getSupabaseConfigStatus();
    throw new Error(
      `Supabase client not initialized. ` +
      `Configuration status: URL=${configStatus.urlConfigured ? 'set' : 'missing'}, ` +
      `Key=${configStatus.keyConfigured ? 'set' : 'missing'}. ` +
      `Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your environment variables.`
    );
  }
  return supabase;
};

// Export schema manager for future use
export const schemaManager = {
  default: defaultSchema,
  
  // Get the appropriate schema based on context
  getSchema(context: 'default' | 'organization' | 'user' = 'default'): string {
    return defaultSchema;
  },
  
  // Create a client with a specific schema
  // Note: Supabase only supports 'public' or 'graphql_public' schemas
  createClientWithSchema(schema: string): SupabaseClient | null {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }
    // Validate schema - Supabase only allows 'public' or 'graphql_public'
    const validSchemas = ['public', 'graphql_public'];
    if (!validSchemas.includes(schema)) {
      console.warn(`Invalid schema "${schema}". Using 'public' instead. Supabase only supports: ${validSchemas.join(', ')}`);
      schema = 'public';
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: schema
      }
    });
  }
};


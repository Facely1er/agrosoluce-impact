// Supabase client configuration for AgroSoluce
// All app tables live in the agrosoluce schema. Set default schema so .from() resolves correctly.
// In Supabase Dashboard: Project Settings → API → add "agrosoluce" to Exposed schemas.

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
/** Default schema for data API; must be exposed in Supabase Project Settings → API → Exposed schemas */
const defaultSchema = 'agrosoluce';

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

export interface SupabaseVerifyResult {
  configured: boolean;
  connected?: boolean;
  message: string;
  details?: { urlSet: boolean; keySet: boolean; error?: string };
}

/** Verify Supabase is correctly configured (env vars + optional connectivity check). */
export async function verifySupabaseConfiguration(): Promise<SupabaseVerifyResult> {
  const urlSet = !!supabaseUrl;
  const keySet = !!supabaseAnonKey;

  if (!urlSet || !keySet) {
    return {
      configured: false,
      message: 'Supabase environment variables are missing.',
      details: {
        urlSet,
        keySet,
      },
    };
  }

  if (!supabase) {
    return {
      configured: true,
      connected: false,
      message: 'Supabase client failed to initialize.',
      details: { urlSet, keySet, error: 'Client is null after createClient.' },
    };
  }

  try {
    // Minimal query to verify connectivity and schema access (agrosoluce.canonical_cooperative_directory)
    const { error } = await supabase
      .schema(defaultSchema)
      .from('canonical_cooperative_directory')
      .select('coop_id')
      .limit(1);

    if (error) {
      return {
        configured: true,
        connected: false,
        message: `Supabase connection failed: ${error.message}`,
        details: { urlSet, keySet, error: error.message },
      };
    }

    return {
      configured: true,
      connected: true,
      message: 'Supabase is correctly configured and reachable.',
      details: { urlSet, keySet },
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      configured: true,
      connected: false,
      message: `Supabase check failed: ${errorMessage}`,
      details: { urlSet, keySet, error: errorMessage },
    };
  }
}

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

// Create Supabase client with agrosoluce schema (all app tables live here)
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
        schema: defaultSchema
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

  getSchema(_context: 'default' | 'organization' | 'user' = 'default'): string {
    return defaultSchema;
  },

  /** Create a client targeting a specific schema. Schema must be in Supabase Exposed schemas. */
  createClientWithSchema(schema: string): SupabaseClient | null {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }
    const allowed = ['agrosoluce', 'public', 'graphql_public'];
    if (!allowed.includes(schema)) {
      console.warn(`Schema "${schema}" may not be exposed. Allowed: ${allowed.join(', ')}. Using default.`);
      schema = defaultSchema;
    }
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: { schema },
    });
  },
};


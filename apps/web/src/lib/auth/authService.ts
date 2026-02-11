/**
 * Authentication Service for AgroSoluce
 * Handles multi-role authentication (farmers/cooperatives, buyers, admins)
 */

import { supabase } from '@/lib/supabase/client';
import type { UserProfile, UserType } from '@/types';

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  userType: UserType;
  organizationName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  profile: UserProfile | null;
  error: Error | null;
}

/**
 * Sign up a new user with profile creation
 */
export async function signUp(data: SignUpData): Promise<AuthResponse> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          user_type: data.userType,
          organization_name: data.organizationName,
        },
      },
    });

    if (authError) {
      return { user: null, profile: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, profile: null, error: new Error('User creation failed') };
    }

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        user_type: data.userType,
        organization_name: data.organizationName,
        is_active: true,
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // User is created but profile failed - this is recoverable
      return {
        user: authData.user,
        profile: null,
        error: profileError,
      };
    }

    return {
      user: authData.user,
      profile: profile as UserProfile,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      profile: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(data: SignInData): Promise<AuthResponse> {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      return { user: null, profile: null, error: authError };
    }

    if (!authData.user) {
      return { user: null, profile: null, error: new Error('Sign in failed') };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return {
        user: authData.user,
        profile: null,
        error: profileError,
      };
    }

    // Update last login
    await supabase
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', profile.id);

    return {
      user: authData.user,
      profile: profile as UserProfile,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      profile: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    if (!supabase) {
      return { error: new Error('Supabase client not initialized') };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Get current authenticated user and profile
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    if (!supabase) {
      return { user: null, profile: null, error: new Error('Supabase client not initialized') };
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return { user: null, profile: null, error: userError || new Error('No user found') };
    }

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      return {
        user,
        profile: null,
        error: profileError,
      };
    }

    return {
      user,
      profile: profile as UserProfile,
      error: null,
    };
  } catch (error) {
    return {
      user: null,
      profile: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile(
  profileId: string,
  updates: Partial<UserProfile>
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    if (!supabase) {
      return { profile: null, error: new Error('Supabase client not initialized') };
    }

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();

    if (error) {
      return { profile: null, error };
    }

    return { profile: profile as UserProfile, error: null };
  } catch (error) {
    return {
      profile: null,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(profile: UserProfile | null, role: UserType): boolean {
  return profile?.user_type === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(profile: UserProfile | null): boolean {
  return hasRole(profile, 'admin');
}

/**
 * Check if user is cooperative
 */
export function isCooperative(profile: UserProfile | null): boolean {
  return hasRole(profile, 'cooperative');
}

/**
 * Check if user is buyer
 */
export function isBuyer(profile: UserProfile | null): boolean {
  return hasRole(profile, 'buyer');
}


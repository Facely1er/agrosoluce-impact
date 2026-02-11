// API functions for buyer requests and matching
// Connects frontend to Supabase database

import { supabase } from '@/lib/supabase/client';
import type { Cooperative } from '@/types';
import type { BuyerRequest, RequestMatch } from '@/domain/agro/types';

/**
 * Create a new buyer request
 */
export async function createBuyerRequest(
  request: Omit<BuyerRequest, 'id' | 'status' | 'createdAt'>
): Promise<{ data: BuyerRequest | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('ag_buyer_requests')
      .insert({
        buyer_org: request.buyerOrg,
        buyer_contact_email: request.buyerContactEmail,
        target_country: request.targetCountry,
        commodity: request.commodity,
        min_volume_tons: request.minVolumeTons,
        max_volume_tons: request.maxVolumeTons,
        requirements: request.requirements,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating buyer request:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformBuyerRequest(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get a buyer request by ID
 */
export async function getBuyerRequestById(
  id: string
): Promise<{ data: BuyerRequest | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('ag_buyer_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Request not found') };
    }

    const transformed = transformBuyerRequest(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create matches for a buyer request
 */
export async function createRequestMatches(
  requestId: string,
  matches: Array<{ cooperativeId: string; matchScore: number }>
): Promise<{ data: RequestMatch[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const matchRecords = matches.map(m => ({
      request_id: requestId,
      cooperative_id: m.cooperativeId,
      match_score: m.matchScore,
      status: 'suggested'
    }));

    const { data, error } = await supabase
      .from('ag_request_matches')
      .insert(matchRecords)
      .select();

    if (error) {
      console.error('Error creating matches:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformRequestMatch);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Get matches for a buyer request
 */
export async function getRequestMatches(
  requestId: string
): Promise<{ data: RequestMatch[] | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('ag_request_matches')
      .select(`
        *,
        cooperatives:cooperative_id (
          id,
          name,
          country,
          region,
          commodity,
          certifications,
          annual_volume_tons,
          compliance_flags,
          contact_email,
          contact_phone
        )
      `)
      .eq('request_id', requestId)
      .order('match_score', { ascending: false });

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(m => {
      const match = transformRequestMatch(m);
      if (m.cooperatives) {
        match.cooperative = transformCooperative(m.cooperatives);
      }
      return match;
    });

    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: RequestMatch['status']
): Promise<{ data: RequestMatch | null; error: Error | null }> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .from('ag_request_matches')
      .update({ status })
      .eq('id', matchId)
      .select()
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformRequestMatch(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper functions to transform database records to TypeScript types

function transformBuyerRequest(data: any): BuyerRequest {
  return {
    id: data.id,
    buyerOrg: data.buyer_org,
    buyerContactEmail: data.buyer_contact_email,
    targetCountry: data.target_country,
    commodity: data.commodity,
    minVolumeTons: data.min_volume_tons,
    maxVolumeTons: data.max_volume_tons,
    requirements: data.requirements || {},
    status: data.status,
    createdAt: data.created_at
  };
}

function transformRequestMatch(data: any): RequestMatch {
  return {
    id: data.id,
    requestId: data.request_id,
    cooperativeId: data.cooperative_id,
    matchScore: data.match_score,
    status: data.status,
    createdAt: data.created_at
  };
}

function transformCooperative(data: any): Cooperative {
  return {
    id: data.id,
    name: data.name,
    country: data.country || '',
    region: data.region,
    commodity: data.commodity || '',
    certifications: data.certifications || [],
    annualVolumeTons: data.annual_volume_tons,
    complianceFlags: data.compliance_flags || {},
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    // Include other fields for compatibility
    department: data.department,
    sector: data.sector,
    email: data.email,
    phone: data.phone,
  };
}


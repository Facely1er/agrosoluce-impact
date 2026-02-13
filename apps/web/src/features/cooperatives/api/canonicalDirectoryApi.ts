// API functions for Canonical Cooperative Directory
// Table lives in agrosoluce schema. We use .schema('agrosoluce') on every call so it works
// even if the deployed client default schema is not applied (e.g. cache, old build).
import { supabase } from '@/lib/supabase/client';

const SCHEMA = 'agrosoluce';
import { formatCooperativeName } from '@/lib/utils/cooperativeUtils';
import type { CanonicalCooperativeDirectory, RecordStatus, EudrCommodity } from '@/types';

/** Static fallback: load from public JSON when Supabase is not configured or returns no data */
const STATIC_DIRECTORY_URL = '/cooperatives_cote_ivoire.json';
const STATIC_FALLBACK_MAX = 2000;

function transformStaticCooperative(raw: any): CanonicalCooperativeDirectory {
  const name = formatCooperativeName(raw.name);
  const region = (raw.region || '').trim();
  return {
    coop_id: String(raw.id ?? raw.registrationNumber ?? Math.random().toString(36).slice(2)),
    name,
    country: raw.metadata?.country || "Côte d'Ivoire",
    countryCode: 'CI',
    region,
    regionName: region || undefined,
    department: raw.departement || raw.department,
    primary_crop: raw.secteur?.includes('CACAO') || raw.secteur?.includes('CACAO') ? 'cocoa' : undefined,
    commodities: ['cocoa'] as EudrCommodity[],
    source_registry: raw.metadata?.source,
    record_status: (raw.status === 'active' || raw.status === 'verified') ? 'active' : 'active',
    pilot_id: null,
    pilot_label: undefined,
    coverageBand: undefined,
    created_at: raw.metadata?.importedAt,
  };
}

async function getCanonicalDirectoryRecordsStaticFallback(): Promise<CanonicalCooperativeDirectory[]> {
  try {
    const res = await fetch(STATIC_DIRECTORY_URL);
    if (!res.ok) return [];
    const json = await res.json();
    const list = Array.isArray(json.cooperatives) ? json.cooperatives : [];
    return list.slice(0, STATIC_FALLBACK_MAX).map(transformStaticCooperative);
  } catch {
    return [];
  }
}

/**
 * Fetch all canonical cooperative directory records
 */
export async function getCanonicalDirectoryRecords(): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    const fallback = await getCanonicalDirectoryRecordsStaticFallback();
    return { data: fallback.length > 0 ? fallback : null, error: fallback.length > 0 ? null : new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch canonical directory records by status
 */
export async function getCanonicalDirectoryRecordsByStatus(
  status: RecordStatus
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('record_status', status)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by status:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch canonical directory records by country
 */
export async function getCanonicalDirectoryRecordsByCountry(
  country: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('country', country)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by country:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch canonical directory records by primary crop
 */
export async function getCanonicalDirectoryRecordsByPrimaryCrop(
  primaryCrop: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('primary_crop', primaryCrop)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by primary crop:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Fetch a single canonical directory record by ID
 */
export async function getCanonicalDirectoryRecordById(
  coopId: string
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('coop_id', coopId)
      .single();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Record not found') };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Search canonical directory records by name
 */
export async function searchCanonicalDirectoryRecords(
  query: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .ilike('name', `%${query}%`)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error searching canonical directory records:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Create a new canonical directory record
 */
export async function createCanonicalDirectoryRecord(
  record: Omit<CanonicalCooperativeDirectory, 'coop_id' | 'created_at'>
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .insert({
        name: record.name,
        country: record.country,
        region: record.region,
        department: record.department,
        primary_crop: record.primary_crop,
        source_registry: record.source_registry,
        record_status: record.record_status || 'active',
        pilot_id: record.pilot_id || null,
        pilot_label: record.pilot_label,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating canonical directory record:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Update a canonical directory record
 */
export async function updateCanonicalDirectoryRecord(
  coopId: string,
  updates: Partial<Omit<CanonicalCooperativeDirectory, 'coop_id' | 'created_at'>>
): Promise<{
  data: CanonicalCooperativeDirectory | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .update(updates)
      .eq('coop_id', coopId)
      .select()
      .single();

    if (error) {
      console.error('Error updating canonical directory record:', error);
      return { data: null, error: new Error(error.message) };
    }

    if (!data) {
      return { data: null, error: new Error('Record not found') };
    }

    const transformed = transformCanonicalRecord(data);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

/**
 * Delete a canonical directory record (admin only)
 */
export async function deleteCanonicalDirectoryRecord(
  coopId: string
): Promise<{
  error: Error | null;
}> {
  if (!supabase) {
    return { error: new Error('Supabase not configured') };
  }

  try {
    const { error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .delete()
      .eq('coop_id', coopId);

    if (error) {
      console.error('Error deleting canonical directory record:', error);
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { error };
  }
}

/**
 * Fetch canonical directory records by pilot_id
 */
export async function getCanonicalDirectoryRecordsByPilotId(
  pilotId: string
): Promise<{
  data: CanonicalCooperativeDirectory[] | null;
  error: Error | null;
}> {
  if (!supabase) {
    return { data: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase
      .schema(SCHEMA)
      .from('canonical_cooperative_directory')
      .select('*')
      .eq('pilot_id', pilotId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching canonical directory records by pilot_id:', error);
      return { data: null, error: new Error(error.message) };
    }

    const transformed = (data || []).map(transformCanonicalRecord);
    return { data: transformed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    return { data: null, error };
  }
}

// Helper function to derive commodities from primary_crop
function deriveCommoditiesFromPrimaryCrop(primaryCrop: string | null | undefined): EudrCommodity[] {
  if (!primaryCrop) return [];
  
  const cropLower = primaryCrop.toLowerCase();
  const commodityMap: Record<string, EudrCommodity> = {
    'cocoa': 'cocoa',
    'cacao': 'cocoa',
    'coffee': 'coffee',
    'café': 'coffee',
    'cafe': 'coffee',
    'palm': 'palm_oil',
    'palm oil': 'palm_oil',
    'palm_oil': 'palm_oil',
    'rubber': 'rubber',
    'soy': 'soy',
    'soja': 'soy',
    'cattle': 'cattle',
    'wood': 'wood',
    'timber': 'wood',
  };
  
  for (const [key, value] of Object.entries(commodityMap)) {
    if (cropLower.includes(key)) {
      return [value];
    }
  }
  
  return [];
}

// Helper function to transform database records to TypeScript types
function transformCanonicalRecord(data: any): CanonicalCooperativeDirectory {
  // Use display_name if available, otherwise fall back to name
  // Format the name according to workflow requirements (names should not be displayed directly)
  const rawName = data.display_name || data.name;
  const formattedName = formatCooperativeName(rawName);
  
  // Ensure commodities array is populated - use existing or derive from primary_crop
  let commodities = data.commodities;
  if (!commodities || !Array.isArray(commodities) || commodities.length === 0) {
    commodities = deriveCommoditiesFromPrimaryCrop(data.primary_crop);
  }
  
  return {
    coop_id: data.coop_id.toString(),
    name: formattedName, // Formatted name ready for display (not displayed directly)
    country: data.country,
    countryCode: data.country_code || data.countryCode,
    region: data.region,
    regionName: data.region_name || data.regionName,
    department: data.department,
    primary_crop: data.primary_crop,
    commodities: commodities.length > 0 ? commodities as any : undefined, // Ensure commodities array is populated
    source_registry: data.source_registry,
    record_status: data.record_status || 'active',
    pilot_id: data.pilot_id || null,
    pilot_label: data.pilot_label,
    coverageBand: data.coverage_band || data.coverageBand,
    created_at: data.created_at,
  };
}


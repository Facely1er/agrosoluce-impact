/**
 * HWI Service - API layer for accessing Household Welfare Index data
 * 
 * Provides functions to fetch, filter, and export HWI scores from Supabase
 */

import { supabase } from '../../lib/supabase';

const SUPABASE_NOT_CONFIGURED = 'Supabase is not configured. HWI data requires a database connection. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.';

export interface HWIScore {
  id: string;
  pharmacy_id: string;
  departement: string;
  region: string | null;
  period_label: string;
  year: number;
  hwi_score: number;
  workforce_health_score: number | null;
  child_welfare_score: number | null;
  womens_health_score: number | null;
  womens_empowerment_score: number | null;
  nutrition_score: number | null;
  chronic_illness_score: number | null;
  acute_illness_score: number | null;
  alert_level: 'green' | 'yellow' | 'red' | 'black';
  total_quantity: number;
  category_breakdown: Record<string, number> | null;
  created_at: string;
  updated_at: string;
}

export interface HWIScoreWithPharmacy extends HWIScore {
  pharmacy_name?: string;
  pharmacy_region?: string;
  location?: string;
}

export interface CategoryAggregate {
  id: string;
  pharmacy_id: string;
  period_label: string;
  year: number;
  category: string;
  quantity: number;
  share: number;
  created_at: string;
  updated_at: string;
}

export interface HWIFilters {
  year?: number;
  years?: number[];
  departement?: string;
  departements?: string[];
  alertLevel?: string;
  alertLevels?: string[];
  pharmacyId?: string;
  pharmacyIds?: string[];
}

/**
 * Get HWI scores with optional filters
 */
export async function getHWIScores(filters?: HWIFilters): Promise<HWIScore[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  let query = supabase
    .from('household_welfare_index')
    .select('*')
    .order('year', { ascending: false })
    .order('period_label', { ascending: false });

  // Apply filters
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.years && filters.years.length > 0) {
    query = query.in('year', filters.years);
  }
  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.departements && filters.departements.length > 0) {
    query = query.in('departement', filters.departements);
  }
  if (filters?.alertLevel) {
    query = query.eq('alert_level', filters.alertLevel);
  }
  if (filters?.alertLevels && filters.alertLevels.length > 0) {
    query = query.in('alert_level', filters.alertLevels);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }
  if (filters?.pharmacyIds && filters.pharmacyIds.length > 0) {
    query = query.in('pharmacy_id', filters.pharmacyIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching HWI scores:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get latest HWI scores for each pharmacy
 */
export async function getLatestHWIScores(): Promise<HWIScoreWithPharmacy[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  const { data, error } = await supabase
    .from('v_hwi_latest')
    .select('*')
    .order('hwi_score', { ascending: false });

  if (error) {
    console.error('Error fetching latest HWI scores:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get active alerts (non-green alert levels)
 */
export async function getActiveAlerts(): Promise<HWIScoreWithPharmacy[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  const { data, error } = await supabase
    .from('v_hwi_active_alerts')
    .select('*');

  if (error) {
    console.error('Error fetching active alerts:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get HWI time series data
 */
export async function getHWITimeSeries(filters?: {
  departement?: string;
  pharmacyId?: string;
}): Promise<HWIScore[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  let query = supabase
    .from('household_welfare_index')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching HWI time series:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get category aggregates
 */
export async function getCategoryAggregates(filters?: {
  year?: number;
  pharmacyId?: string;
  category?: string;
}): Promise<CategoryAggregate[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  let query = supabase
    .from('vrac_category_aggregates')
    .select('*')
    .order('year', { ascending: false })
    .order('period_label', { ascending: false });

  if (filters?.year) {
    query = query.eq('year', filters.year);
  }
  if (filters?.pharmacyId) {
    query = query.eq('pharmacy_id', filters.pharmacyId);
  }
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching category aggregates:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get HWI summary statistics
 */
export async function getHWISummary(
  departement?: string,
  year?: number
): Promise<any[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  const { data, error } = await supabase.rpc('get_hwi_summary', {
    dept_name: departement || null,
    target_year: year || null,
  });

  if (error) {
    console.error('Error fetching HWI summary:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get alert distribution
 */
export async function getAlertDistribution(year?: number): Promise<any[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  const { data, error } = await supabase.rpc('get_alert_distribution', {
    target_year: year || null,
  });

  if (error) {
    console.error('Error fetching alert distribution:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get timeseries by departement
 */
export async function getTimeSeriesByDepartement(filters?: {
  departement?: string;
  year?: number;
}): Promise<any[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  let query = supabase
    .from('v_hwi_timeseries_by_dept')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.departement) {
    query = query.eq('departement', filters.departement);
  }
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching timeseries by departement:', error);
    throw error;
  }

  return data || [];
}

/**
 * Get category trends
 */
export async function getCategoryTrends(filters?: {
  category?: string;
  year?: number;
}): Promise<any[]> {
  if (!supabase) throw new Error(SUPABASE_NOT_CONFIGURED);
  let query = supabase
    .from('v_category_trends')
    .select('*')
    .order('year', { ascending: true })
    .order('period_label', { ascending: true });

  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  if (filters?.year) {
    query = query.eq('year', filters.year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching category trends:', error);
    throw error;
  }

  return data || [];
}

/**
 * Export HWI scores to CSV format
 */
export function exportToCSV(scores: HWIScore[]): string {
  if (scores.length === 0) {
    return '';
  }

  // Define headers
  const headers = [
    'Pharmacy ID',
    'Departement',
    'Region',
    'Period',
    'Year',
    'HWI Score',
    'Alert Level',
    'Workforce Health',
    'Child Welfare',
    "Women's Health",
    "Women's Empowerment",
    'Nutrition',
    'Chronic Illness',
    'Acute Illness',
    'Total Quantity',
  ];

  // Build rows
  const rows = scores.map(score => [
    score.pharmacy_id,
    score.departement,
    score.region || '',
    score.period_label,
    score.year,
    score.hwi_score.toFixed(2),
    score.alert_level,
    (score.workforce_health_score || 0).toFixed(2),
    (score.child_welfare_score || 0).toFixed(2),
    (score.womens_health_score || 0).toFixed(2),
    (score.womens_empowerment_score || 0).toFixed(2),
    (score.nutrition_score || 0).toFixed(2),
    (score.chronic_illness_score || 0).toFixed(2),
    (score.acute_illness_score || 0).toFixed(2),
    score.total_quantity,
  ]);

  // Combine into CSV
  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');

  return csv;
}

/**
 * Export HWI scores to JSON format
 */
export function exportToJSON(scores: HWIScore[]): string {
  return JSON.stringify(scores, null, 2);
}

/**
 * Download exported data
 */
export function downloadExport(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

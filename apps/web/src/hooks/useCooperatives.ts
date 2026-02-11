import { useState, useEffect } from 'react';
import type { Cooperative } from '@/types';
import { enrichCooperatives } from '@/lib/utils/cooperativeUtils';
import { getCooperatives } from '@/features/cooperatives/api/cooperativesApi';

/**
 * Hook to fetch cooperatives from Supabase or fallback to JSON
 * Automatically enriches data with computed fields
 */
export function useCooperatives() {
  const [cooperatives, setCooperatives] = useState<Cooperative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'database' | 'json' | null>(null);

  useEffect(() => {
    async function loadCooperatives() {
      setLoading(true);
      setError(null);

      // Try Supabase first
      const { data: dbData, error: dbError } = await getCooperatives();

      if (dbData && !dbError) {
        // Successfully loaded from database
        const enriched = enrichCooperatives(dbData);
        setCooperatives(enriched);
        setSource('database');
        setLoading(false);
        return;
      }

      // Fallback to JSON if Supabase fails or is not configured
      if (dbError && dbError.message === 'Supabase not configured') {
        console.log('Supabase not configured, falling back to JSON');
      } else {
        console.warn('Failed to load from database, falling back to JSON:', dbError);
      }

      try {
        const response = await fetch('/cooperatives_cote_ivoire.json');
        if (!response.ok) {
          throw new Error('Failed to load cooperatives data from JSON');
        }
        const jsonData = await response.json();
        const enriched = enrichCooperatives(jsonData.cooperatives || []);
        setCooperatives(enriched);
        setSource('json');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setSource(null);
      } finally {
        setLoading(false);
      }
    }

    loadCooperatives();
  }, []);

  return { cooperatives, loading, error, source };
}


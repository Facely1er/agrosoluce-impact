// Hook for triggering cooperative enrichment recomputation
// Use this hook when cooperative data, farmers, plots, or documents change

import { useState } from 'react';
import { recomputeCooperativeEnrichment } from '@/services/enrichmentOrchestrationService';
import type { Cooperative } from '@/types';

/**
 * Hook to recompute and update cooperative enrichment data
 * 
 * Usage:
 * ```tsx
 * const { recomputeEnrichment, loading, error } = useCooperativeEnrichment();
 * 
 * // After updating cooperative, farmers, plots, or documents:
 * await recomputeEnrichment(cooperativeId, buyerRegions);
 * ```
 */
export function useCooperativeEnrichment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const recomputeEnrichment = async (
    cooperativeId: string,
    buyerRegions?: string[]
  ): Promise<{ data: Cooperative | null; error: Error | null }> => {
    setLoading(true);
    setError(null);

    try {
      const result = await recomputeCooperativeEnrichment(cooperativeId, buyerRegions);
      
      if (result.error) {
        setError(result.error);
      }

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    recomputeEnrichment,
    loading,
    error,
  };
}


// Coverage metrics types

export type DocumentPresence = 'present' | 'missing' | 'expired' | 'pending';

export type CoverageBand = 'limited' | 'partial' | 'substantial';

export interface CoverageMetrics {
  cooperative_id: string;
  farmers_total: number;
  farmers_with_declarations: number;
  plots_total: number;
  plots_with_geo: number;
  required_docs_total: number;
  required_docs_present: number;
  document_coverage: Record<string, DocumentPresence>;
  last_updated?: string;
  created_at?: string;
}


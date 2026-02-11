// Readiness snapshot types

export type ReadinessStatus = 'not_ready' | 'in_progress' | 'buyer_ready';

export interface ReadinessSnapshot {
  id: string;
  cooperative_id: string;
  status: ReadinessStatus;
  coverage_score: number;
  compliance_score: number;
  documentation_score: number;
  overall_score: number;
  gaps: ReadinessGap[];
  recommendations: string[];
  snapshot_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReadinessGap {
  category: 'coverage' | 'compliance' | 'documentation' | 'other';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  action_required: string;
}


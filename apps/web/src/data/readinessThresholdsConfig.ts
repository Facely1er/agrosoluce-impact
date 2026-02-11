// Readiness Thresholds Configuration
// Defines thresholds for determining readiness status based on coverage percentage
// These thresholds are easy to adjust and are used for internal readiness shorthand only

export type ReadinessStatus = 'not_ready' | 'in_progress' | 'buyer_ready';

export interface ReadinessThresholds {
  notReadyMax: number; // Maximum coverage percentage for 'not_ready' status (exclusive)
  inProgressMin: number; // Minimum coverage percentage for 'in_progress' status (inclusive)
  inProgressMax: number; // Maximum coverage percentage for 'in_progress' status (inclusive)
  buyerReadyMin: number; // Minimum coverage percentage for 'buyer_ready' status (exclusive)
}

/**
 * Default readiness thresholds
 * - coverage < 30% => 'not_ready'
 * - 30% <= coverage <= 70% => 'in_progress'
 * - coverage > 70% => 'buyer_ready'
 */
export const DEFAULT_READINESS_THRESHOLDS: ReadinessThresholds = {
  notReadyMax: 30, // < 30%
  inProgressMin: 30, // >= 30%
  inProgressMax: 70, // <= 70%
  buyerReadyMin: 70, // > 70%
};

/**
 * Get readiness status based on coverage percentage
 * 
 * @param coveragePercentage - Coverage percentage (0-100)
 * @param thresholds - Optional custom thresholds (defaults to DEFAULT_READINESS_THRESHOLDS)
 * @returns Readiness status
 */
export function getReadinessStatus(
  coveragePercentage: number,
  thresholds: ReadinessThresholds = DEFAULT_READINESS_THRESHOLDS
): ReadinessStatus {
  if (coveragePercentage < thresholds.notReadyMax) {
    return 'not_ready';
  } else if (coveragePercentage >= thresholds.inProgressMin && coveragePercentage <= thresholds.inProgressMax) {
    return 'in_progress';
  } else if (coveragePercentage > thresholds.buyerReadyMin) {
    return 'buyer_ready';
  }
  
  // Fallback (should not happen with valid thresholds)
  return 'in_progress';
}

/**
 * Get human-readable label for readiness status
 */
export function getReadinessStatusLabel(status: ReadinessStatus): string {
  const labels: Record<ReadinessStatus, string> = {
    not_ready: 'Not Ready',
    in_progress: 'In Progress',
    buyer_ready: 'Buyer Ready',
  };
  return labels[status] || status;
}


/**
 * HWI Data Utilities
 * 
 * Data manipulation and analysis functions for HWI scores
 */

import { HWIScore, HWIScoreWithPharmacy } from '../../services/hwi/hwiService';

export type TrendDirection = 'increasing' | 'decreasing' | 'stable';

/**
 * Filter HWI scores by multiple criteria
 */
export function filterHWIScores(
  scores: HWIScore[],
  filters: {
    minScore?: number;
    maxScore?: number;
    alertLevels?: string[];
    departements?: string[];
    years?: number[];
    pharmacyIds?: string[];
  }
): HWIScore[] {
  return scores.filter(score => {
    if (filters.minScore !== undefined && score.hwi_score < filters.minScore) return false;
    if (filters.maxScore !== undefined && score.hwi_score > filters.maxScore) return false;
    if (filters.alertLevels && !filters.alertLevels.includes(score.alert_level)) return false;
    if (filters.departements && !filters.departements.includes(score.departement)) return false;
    if (filters.years && !filters.years.includes(score.year)) return false;
    if (filters.pharmacyIds && !filters.pharmacyIds.includes(score.pharmacy_id)) return false;
    return true;
  });
}

/**
 * Group HWI scores by a field
 */
export function groupHWIScores<K extends keyof HWIScore>(
  scores: HWIScore[],
  groupBy: K
): Map<HWIScore[K], HWIScore[]> {
  const groups = new Map<HWIScore[K], HWIScore[]>();
  
  for (const score of scores) {
    const key = score[groupBy];
    const existing = groups.get(key) || [];
    existing.push(score);
    groups.set(key, existing);
  }
  
  return groups;
}

/**
 * Calculate average HWI score by group
 */
export function calculateAverageByGroup<K extends keyof HWIScore>(
  scores: HWIScore[],
  groupBy: K
): Map<HWIScore[K], number> {
  const groups = groupHWIScores(scores, groupBy);
  const averages = new Map<HWIScore[K], number>();
  
  for (const [key, groupScores] of groups.entries()) {
    const sum = groupScores.reduce((acc, s) => acc + s.hwi_score, 0);
    const avg = sum / groupScores.length;
    averages.set(key, Math.round(avg * 100) / 100);
  }
  
  return averages;
}

/**
 * Get alert level distribution
 */
export function getAlertDistribution(scores: HWIScore[]): Record<string, number> {
  const distribution = {
    green: 0,
    yellow: 0,
    red: 0,
    black: 0,
  };
  
  for (const score of scores) {
    if (score.alert_level in distribution) {
      distribution[score.alert_level as keyof typeof distribution]++;
    }
  }
  
  return distribution;
}

/**
 * Detect trend for a pharmacy over time
 */
export function detectTrend(scores: HWIScore[], pharmacyId: string): TrendDirection {
  const pharmacyScores = scores
    .filter(s => s.pharmacy_id === pharmacyId)
    .sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.period_label.localeCompare(b.period_label);
    });

  if (pharmacyScores.length < 2) {
    return 'stable';
  }

  // Calculate linear trend
  const n = pharmacyScores.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = pharmacyScores[i].hwi_score;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  
  // Threshold for significant change
  const threshold = 2.0;
  
  if (slope > threshold) {
    return 'increasing'; // Worsening
  } else if (slope < -threshold) {
    return 'decreasing'; // Improving
  } else {
    return 'stable';
  }
}

/**
 * Find outliers using IQR method
 */
export function findOutliers(scores: HWIScore[]): HWIScore[] {
  if (scores.length < 4) {
    return [];
  }

  const sorted = [...scores].sort((a, b) => a.hwi_score - b.hwi_score);
  const n = sorted.length;
  
  // Calculate Q1, Q3
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sorted[q1Index].hwi_score;
  const q3 = sorted[q3Index].hwi_score;
  const iqr = q3 - q1;
  
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return scores.filter(s => s.hwi_score < lowerBound || s.hwi_score > upperBound);
}

/**
 * Compare two time periods
 */
export function compareTimePeriods(
  currentScores: HWIScore[],
  previousScores: HWIScore[]
): {
  pharmacyId: string;
  currentScore: number;
  previousScore: number;
  change: number;
  percentChange: number;
  trend: TrendDirection;
}[] {
  const comparisons: any[] = [];
  
  // Get unique pharmacy IDs from current period
  const pharmacyIds = new Set(currentScores.map(s => s.pharmacy_id));
  
  for (const pharmacyId of pharmacyIds) {
    const current = currentScores.find(s => s.pharmacy_id === pharmacyId);
    const previous = previousScores.find(s => s.pharmacy_id === pharmacyId);
    
    if (current && previous) {
      const change = current.hwi_score - previous.hwi_score;
      const percentChange = previous.hwi_score > 0
        ? (change / previous.hwi_score) * 100
        : 0;
      
      let trend: TrendDirection = 'stable';
      if (change > 5) trend = 'increasing'; // Worsening
      else if (change < -5) trend = 'decreasing'; // Improving
      
      comparisons.push({
        pharmacyId,
        currentScore: current.hwi_score,
        previousScore: previous.hwi_score,
        change: Math.round(change * 100) / 100,
        percentChange: Math.round(percentChange * 100) / 100,
        trend,
      });
    }
  }
  
  return comparisons;
}

/**
 * Generate summary statistics
 */
export function generateSummaryStats(scores: HWIScore[]): {
  count: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  alertDistribution: Record<string, number>;
  componentAverages: {
    workforce_health: number;
    child_welfare: number;
    womens_health: number;
    womens_empowerment: number;
    nutrition: number;
    chronic_illness: number;
    acute_illness: number;
  };
} {
  if (scores.length === 0) {
    return {
      count: 0,
      mean: 0,
      median: 0,
      min: 0,
      max: 0,
      stdDev: 0,
      alertDistribution: { green: 0, yellow: 0, red: 0, black: 0 },
      componentAverages: {
        workforce_health: 0,
        child_welfare: 0,
        womens_health: 0,
        womens_empowerment: 0,
        nutrition: 0,
        chronic_illness: 0,
        acute_illness: 0,
      },
    };
  }

  const sorted = [...scores].sort((a, b) => a.hwi_score - b.hwi_score);
  const n = scores.length;
  
  // Basic stats
  const sum = scores.reduce((acc, s) => acc + s.hwi_score, 0);
  const mean = sum / n;
  const median = n % 2 === 0
    ? (sorted[n / 2 - 1].hwi_score + sorted[n / 2].hwi_score) / 2
    : sorted[Math.floor(n / 2)].hwi_score;
  const min = sorted[0].hwi_score;
  const max = sorted[n - 1].hwi_score;
  
  // Standard deviation
  const squaredDiffs = scores.map(s => Math.pow(s.hwi_score - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  // Alert distribution
  const alertDistribution = getAlertDistribution(scores);
  
  // Component averages
  const componentAverages = {
    workforce_health: scores.reduce((acc, s) => acc + (s.workforce_health_score || 0), 0) / n,
    child_welfare: scores.reduce((acc, s) => acc + (s.child_welfare_score || 0), 0) / n,
    womens_health: scores.reduce((acc, s) => acc + (s.womens_health_score || 0), 0) / n,
    womens_empowerment: scores.reduce((acc, s) => acc + (s.womens_empowerment_score || 0), 0) / n,
    nutrition: scores.reduce((acc, s) => acc + (s.nutrition_score || 0), 0) / n,
    chronic_illness: scores.reduce((acc, s) => acc + (s.chronic_illness_score || 0), 0) / n,
    acute_illness: scores.reduce((acc, s) => acc + (s.acute_illness_score || 0), 0) / n,
  };
  
  return {
    count: n,
    mean: Math.round(mean * 100) / 100,
    median: Math.round(median * 100) / 100,
    min: Math.round(min * 100) / 100,
    max: Math.round(max * 100) / 100,
    stdDev: Math.round(stdDev * 100) / 100,
    alertDistribution,
    componentAverages: Object.fromEntries(
      Object.entries(componentAverages).map(([k, v]) => [k, Math.round(v * 100) / 100])
    ) as any,
  };
}

/**
 * Get scores above threshold
 */
export function getScoresAboveThreshold(
  scores: HWIScore[],
  threshold: number
): HWIScore[] {
  return scores.filter(s => s.hwi_score >= threshold);
}

/**
 * Get top N scores
 */
export function getTopScores(scores: HWIScore[], n: number): HWIScore[] {
  return [...scores]
    .sort((a, b) => b.hwi_score - a.hwi_score)
    .slice(0, n);
}

/**
 * Get bottom N scores
 */
export function getBottomScores(scores: HWIScore[], n: number): HWIScore[] {
  return [...scores]
    .sort((a, b) => a.hwi_score - b.hwi_score)
    .slice(0, n);
}

/**
 * Calculate year-over-year change
 */
export function calculateYearOverYearChange(
  scores: HWIScore[]
): Map<string, { year: number; previousYear: number; change: number; percentChange: number }[]> {
  const pharmacyChanges = new Map<string, any[]>();
  
  const groupedByPharmacy = groupHWIScores(scores, 'pharmacy_id');
  
  for (const [pharmacyId, pharmacyScores] of groupedByPharmacy.entries()) {
    const sortedScores = pharmacyScores.sort((a, b) => a.year - b.year);
    const changes: any[] = [];
    
    for (let i = 1; i < sortedScores.length; i++) {
      const current = sortedScores[i];
      const previous = sortedScores[i - 1];
      
      if (current.year === previous.year + 1) {
        const change = current.hwi_score - previous.hwi_score;
        const percentChange = previous.hwi_score > 0
          ? (change / previous.hwi_score) * 100
          : 0;
        
        changes.push({
          year: current.year,
          previousYear: previous.year,
          change: Math.round(change * 100) / 100,
          percentChange: Math.round(percentChange * 100) / 100,
        });
      }
    }
    
    if (changes.length > 0) {
      pharmacyChanges.set(pharmacyId, changes);
    }
  }
  
  return pharmacyChanges;
}

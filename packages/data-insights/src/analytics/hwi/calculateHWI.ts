/**
 * Household Welfare Index (HWI) Calculation Engine
 * 
 * Calculates composite welfare scores from medication category distributions.
 * Higher scores indicate greater household distress/crisis conditions.
 */

import { MedicationCategory } from '../../classification/medicationTaxonomy';
import {
  CATEGORY_WEIGHTS,
  getCategoryWeight,
  calculateComponentScore,
} from '../../classification/categoryWeights';

export type AlertLevel = 'green' | 'yellow' | 'red' | 'black';

export interface ComponentScores {
  workforce_health: number; // Antimalarials
  child_welfare: number; // Pediatric ORS/Zinc
  womens_health: number; // Prenatal vitamins
  womens_empowerment: number; // Contraceptives
  nutrition: number; // Micronutrients
  chronic_illness: number; // ARVs
  acute_illness: number; // Antibiotics
}

export interface CategoryBreakdown {
  antimalarial: number;
  pediatric_ors_zinc: number;
  prenatal_vitamins: number;
  contraceptives: number;
  micronutrients: number;
  arv: number;
  antibiotics: number;
  other: number;
}

export interface HWIScore {
  pharmacyId: string;
  departement: string;
  region?: string;
  periodLabel: string;
  year: number;
  hwiScore: number; // 0-100, higher = worse
  components: ComponentScores;
  alertLevel: AlertLevel;
  categoryBreakdown: CategoryBreakdown;
  totalQuantity: number;
}

export interface CategoryAggregate {
  category: MedicationCategory;
  quantity: number;
  share: number; // 0-1
}

/**
 * Alert level thresholds for HWI score
 */
const ALERT_THRESHOLDS = {
  green: 25, // 0-25: Normal conditions
  yellow: 50, // 25-50: Elevated stress
  red: 75, // 50-75: Crisis conditions
  black: 100, // 75-100: Severe crisis
};

/**
 * Determine alert level based on HWI score
 */
export function getAlertLevel(hwiScore: number): AlertLevel {
  if (hwiScore >= ALERT_THRESHOLDS.red) {
    return 'black'; // Severe crisis
  } else if (hwiScore >= ALERT_THRESHOLDS.yellow) {
    return 'red'; // Crisis
  } else if (hwiScore >= ALERT_THRESHOLDS.green) {
    return 'yellow'; // Elevated
  } else {
    return 'green'; // Normal
  }
}

/**
 * Calculate component scores from category breakdown
 */
export function calculateComponentScores(breakdown: CategoryBreakdown): ComponentScores {
  return {
    workforce_health: calculateComponentScore(breakdown.antimalarial, 'antimalarial'),
    child_welfare: calculateComponentScore(breakdown.pediatric_ors_zinc, 'pediatric_ors_zinc'),
    womens_health: calculateComponentScore(breakdown.prenatal_vitamins, 'prenatal_vitamins'),
    womens_empowerment: calculateComponentScore(breakdown.contraceptives, 'contraceptives'),
    nutrition: calculateComponentScore(breakdown.micronutrients, 'micronutrients'),
    chronic_illness: calculateComponentScore(breakdown.arv, 'arv'),
    acute_illness: calculateComponentScore(breakdown.antibiotics, 'antibiotics'),
  };
}

/**
 * Calculate composite HWI score from component scores
 * Uses weighted average based on ESG priority weights
 */
export function calculateHWIScore(components: ComponentScores): number {
  const score =
    components.workforce_health * CATEGORY_WEIGHTS.antimalarial.weight +
    components.child_welfare * CATEGORY_WEIGHTS.pediatric_ors_zinc.weight +
    components.womens_health * CATEGORY_WEIGHTS.prenatal_vitamins.weight +
    components.womens_empowerment * CATEGORY_WEIGHTS.contraceptives.weight +
    components.nutrition * CATEGORY_WEIGHTS.micronutrients.weight +
    components.chronic_illness * CATEGORY_WEIGHTS.arv.weight +
    components.acute_illness * CATEGORY_WEIGHTS.antibiotics.weight;

  return Math.min(Math.round(score * 100) / 100, 100); // Round to 2 decimal places, cap at 100
}

/**
 * Calculate HWI score from category aggregates
 */
export function calculateHWI(
  pharmacyId: string,
  departement: string,
  periodLabel: string,
  year: number,
  categoryAggregates: CategoryAggregate[],
  region?: string
): HWIScore {
  // Build category breakdown
  const breakdown: CategoryBreakdown = {
    antimalarial: 0,
    pediatric_ors_zinc: 0,
    prenatal_vitamins: 0,
    contraceptives: 0,
    micronutrients: 0,
    arv: 0,
    antibiotics: 0,
    other: 0,
  };

  let totalQuantity = 0;

  for (const aggregate of categoryAggregates) {
    totalQuantity += aggregate.quantity;
    
    if (aggregate.category !== 'other') {
      breakdown[aggregate.category] = aggregate.share;
    } else {
      breakdown.other = aggregate.share;
    }
  }

  // Calculate component scores
  const components = calculateComponentScores(breakdown);

  // Calculate composite HWI score
  const hwiScore = calculateHWIScore(components);

  // Determine alert level
  const alertLevel = getAlertLevel(hwiScore);

  return {
    pharmacyId,
    departement,
    region,
    periodLabel,
    year,
    hwiScore,
    components,
    alertLevel,
    categoryBreakdown: breakdown,
    totalQuantity,
  };
}

/**
 * Get alert level description
 */
export function getAlertLevelDescription(level: AlertLevel): string {
  const descriptions: Record<AlertLevel, string> = {
    green: 'Normal conditions - routine monitoring',
    yellow: 'Elevated stress - increase surveillance',
    red: 'Crisis conditions - activate response mechanisms',
    black: 'Severe crisis - emergency intervention required',
  };
  return descriptions[level];
}

/**
 * Get recommended actions for alert level
 */
export function getRecommendedActions(level: AlertLevel): string[] {
  const actions: Record<AlertLevel, string[]> = {
    green: [
      'Continue routine health monitoring',
      'Maintain existing health programs',
      'Document baseline conditions',
    ],
    yellow: [
      'Increase monitoring frequency',
      'Activate existing health programs',
      'Engage with cooperative leadership',
      'Assess specific household needs',
    ],
    red: [
      'Emergency cost-of-living adjustments',
      'Deploy mobile health clinics',
      'Provide direct household support',
      'Coordinate with health authorities',
      'Implement targeted interventions',
    ],
    black: [
      'Supply chain intervention required',
      'Route purchases through health-infrastructure cooperatives',
      'Emergency humanitarian assistance',
      'Multi-stakeholder crisis response',
      'Consider supply chain suspension pending improvement',
    ],
  };
  return actions[level];
}

/**
 * Get alert level color for UI rendering
 */
export function getAlertLevelColor(level: AlertLevel): string {
  const colors: Record<AlertLevel, string> = {
    green: '#10b981', // emerald-500
    yellow: '#f59e0b', // amber-500
    red: '#ef4444', // red-500
    black: '#1f2937', // gray-800
  };
  return colors[level];
}

/**
 * Calculate HWI trend (comparing two periods)
 */
export function calculateTrend(
  currentScore: number,
  previousScore: number
): 'improving' | 'stable' | 'deteriorating' {
  const change = currentScore - previousScore;
  const threshold = 5; // 5 point change is significant

  if (change <= -threshold) {
    return 'improving'; // Score decreased = conditions improved
  } else if (change >= threshold) {
    return 'deteriorating'; // Score increased = conditions worsened
  } else {
    return 'stable';
  }
}

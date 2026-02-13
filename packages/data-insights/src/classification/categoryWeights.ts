/**
 * Category Weights Configuration for HWI Calculation
 * 
 * Defines the importance weights for each medication category in the composite HWI score.
 * Weights sum to 1.0 and reflect ESG priorities and child labor/living income frameworks.
 */

import { MedicationCategory } from './medicationTaxonomy';

export interface CategoryWeight {
  weight: number;
  esgFramework: string;
  description: string;
}

/**
 * Category weights for HWI composite score calculation
 * Total must sum to 1.0
 */
export const CATEGORY_WEIGHTS: Record<Exclude<MedicationCategory, 'other'>, CategoryWeight> = {
  antimalarial: {
    weight: 0.25, // 25%
    esgFramework: 'EUDR Article 3, ISSB S2, Living Income Benchmarks',
    description: 'Workforce health - Malaria impacts agricultural productivity and family income',
  },
  pediatric_ors_zinc: {
    weight: 0.20, // 20%
    esgFramework: 'CSDDD Article 8, SDG 6, ICI Child Labor Standards',
    description: 'Child welfare - Diarrheal disease indicates WASH crisis and household stress',
  },
  prenatal_vitamins: {
    weight: 0.15, // 15%
    esgFramework: 'Fairtrade 3.5, Rainforest Alliance Chapter 4, SDG 3',
    description: "Maternal health - Prenatal care access indicates women's healthcare quality",
  },
  contraceptives: {
    weight: 0.15, // 15%
    esgFramework: 'UN Women Empowerment Principles, Gender Equity, SDG 5',
    description: "Women's empowerment - Family planning access enables economic participation",
  },
  micronutrients: {
    weight: 0.10, // 10%
    esgFramework: 'SDG 2 (Zero Hunger), Living Income Gap Analysis',
    description: 'Nutrition - Micronutrient needs indicate food insecurity and malnutrition',
  },
  arv: {
    weight: 0.10, // 10%
    esgFramework: 'ILO Convention 111, SDG 3, Healthcare Access',
    description: 'Chronic illness - HIV burden reflects healthcare system capacity',
  },
  antibiotics: {
    weight: 0.05, // 5%
    esgFramework: 'WHO Antimicrobial Resistance Strategy',
    description: 'Acute illness - Bacterial infection rates indicate general health conditions',
  },
};

/**
 * Validate that weights sum to 1.0 (within floating point tolerance)
 */
export function validateWeights(): boolean {
  const sum = Object.values(CATEGORY_WEIGHTS).reduce((acc, w) => acc + w.weight, 0);
  const tolerance = 0.0001;
  return Math.abs(sum - 1.0) < tolerance;
}

/**
 * Get weight for a category (returns 0 for 'other' category)
 */
export function getCategoryWeight(category: MedicationCategory): number {
  if (category === 'other') {
    return 0;
  }
  return CATEGORY_WEIGHTS[category].weight;
}

/**
 * Get all category weights as a simple object
 */
export function getWeightsObject(): Record<string, number> {
  return Object.entries(CATEGORY_WEIGHTS).reduce(
    (acc, [category, config]) => ({
      ...acc,
      [category]: config.weight,
    }),
    {} as Record<string, number>
  );
}

/**
 * Empirical maximum thresholds for normalization
 * These represent "severe crisis" levels based on historical data
 * Component scores = (category_share / max_threshold) * 100
 */
export const CATEGORY_MAX_THRESHOLDS: Record<Exclude<MedicationCategory, 'other'>, number> = {
  antimalarial: 0.35, // 35% of sales = severe malaria epidemic
  pediatric_ors_zinc: 0.15, // 15% = severe WASH crisis
  prenatal_vitamins: 0.08, // 8% = high pregnancy without adequate care
  contraceptives: 0.05, // 5% = family planning access crisis
  micronutrients: 0.12, // 12% = severe malnutrition crisis
  arv: 0.08, // 8% = high HIV burden
  antibiotics: 0.20, // 20% = severe bacterial infection outbreak
};

/**
 * Get maximum threshold for a category
 */
export function getCategoryMaxThreshold(category: MedicationCategory): number {
  if (category === 'other') {
    return 1.0; // No meaningful threshold for 'other'
  }
  return CATEGORY_MAX_THRESHOLDS[category];
}

/**
 * Calculate normalized component score (0-100 scale)
 * Higher score = worse condition
 */
export function calculateComponentScore(categoryShare: number, category: MedicationCategory): number {
  if (category === 'other') {
    return 0;
  }
  
  const maxThreshold = CATEGORY_MAX_THRESHOLDS[category];
  const normalizedScore = (categoryShare / maxThreshold) * 100;
  
  // Cap at 100
  return Math.min(normalizedScore, 100);
}

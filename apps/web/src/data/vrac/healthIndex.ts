/**
 * Regional health index computation from pharmacy sales data
 * Antimalarial share = antimalarial quantity / total quantity (proxy for malaria burden)
 */

import { getProductCategory } from './productTaxonomy';

export interface ProcessedPeriod {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  products: Array<{ code: string; designation: string; quantitySold: number }>;
  totalQuantity: number;
}

export interface HealthIndexPoint {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  antimalarialQuantity: number;
  totalQuantity: number;
  antimalarialShare: number;
}

export function computeHealthIndex(periods: ProcessedPeriod[]): HealthIndexPoint[] {
  return periods.map((p) => {
    let antimalarialQty = 0;
    for (const prod of p.products) {
      if (getProductCategory(prod.code, prod.designation) === 'antimalarial') {
        antimalarialQty += prod.quantitySold;
      }
    }
    const total = p.totalQuantity || p.products.reduce((s, x) => s + x.quantitySold, 0);
    return {
      pharmacyId: p.pharmacyId,
      periodLabel: p.periodLabel,
      year: p.year,
      antimalarialQuantity: antimalarialQty,
      totalQuantity: total,
      antimalarialShare: total > 0 ? antimalarialQty / total : 0,
    };
  });
}

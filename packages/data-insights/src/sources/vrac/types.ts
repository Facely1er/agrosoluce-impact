/**
 * VRAC-specific period data shape
 */

export interface VracPeriodData {
  pharmacyId: string;
  periodLabel: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  products: Array<{ code: string; designation: string; quantitySold: number }>;
  totalQuantity: number;
}

/**
 * Analytics & correlation methodology
 *
 * Central definition of data sources, methods, limitations, and references
 * used to substantiate correlation and analytics reports across the app.
 */

export const ANALYTICS_DATA_RANGE = {
  health: { startYear: 2020, endYear: 2025, label: '2020–2025' },
  healthDisplay: '2020–2024', // for charts that may not yet have 2025
} as const;

/** Time-lag correlation: lag window between health surge and harvest impact (months) */
export const TIME_LAG_CORRELATION = {
  lagWindowMonths: { min: 2, max: 6 },
  surgeMonths: ['August', 'September', 'October', 'November', 'December'],
  harvestImpactMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
  lostWorkdaysPerEpisode: { min: 5, max: 10 },
  harvestEfficiencyReductionPercent: { min: 40, max: 60 },
} as const;

/** How regional correlation strength is determined (until paired harvest data available) */
export const CORRELATION_STRENGTH_METHODOLOGY = {
  description:
    'Correlation strength is assigned by region based on (1) proximity to cocoa-growing areas, ' +
    '(2) availability of pharmacy surveillance data, and (3) documented harvest impact studies in the literature. ' +
    'Quantitative correlation coefficients (e.g. Pearson) would require paired health and harvest time series per region.',
  classification: {
    Strong: 'Cocoa-dominant region (e.g. Gontougo) with pharmacy coverage; harvest impact studies apply directly.',
    Moderate: 'Mixed agriculture (e.g. La Mé); proxy relevance is moderate.',
    Weak: 'Urban control (e.g. Abidjan); antimalarial share is not a harvest proxy.',
    Unknown: 'Insufficient data or region not yet classified.',
  } as Record<string, string>,
} as const;

/** Health index computation (antimalarial share as malaria proxy) */
export const HEALTH_INDEX_METHODOLOGY = {
  metric: 'Antimalarial share = antimalarial units sold / total units sold per pharmacy per period.',
  taxonomy: 'Product codes and designations are mapped to therapeutic categories via @agrosoluce/data-insights medication taxonomy.',
  source: 'VRAC pharmacy surveillance network (État 2080 / Liste produits).',
  limitation: 'Antimalarial sales are a proxy for malaria burden; they do not replace clinical diagnosis or epidemiological surveys.',
} as const;

/** References and citations for correlation claims */
export const ANALYTICS_REFERENCES = [
  {
    id: 'who-malaria-agri',
    label: 'WHO & agricultural productivity',
    note: 'WHO reports on malaria burden and productivity in endemic regions; lost workdays and seasonal patterns align with cocoa harvest calendars.',
  },
  {
    id: 'ssa-cocoa-health',
    label: 'Sub-Saharan Africa cocoa and health',
    note: 'Peer-reviewed research (2020–2024) on malaria incidence and agricultural productivity in cocoa-growing regions; time-lag of 2–6 months between surge and measurable harvest impact.',
  },
  {
    id: 'vrac-surveillance',
    label: 'VRAC pharmacy surveillance',
    note: 'Internal data: pharmacy sales aggregated by period; antimalarial share used as proxy for malaria burden. Coverage: 4 pharmacy locations, multiple regions.',
  },
] as const;

export type ReferenceId = (typeof ANALYTICS_REFERENCES)[number]['id'];

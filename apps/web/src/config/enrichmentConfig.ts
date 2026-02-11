// Enrichment configuration for Phase 1 Data Enrichment
// Defines thresholds, required document types, and country/crop mappings

import type { DocType } from '../types';

/**
 * Required document types for buyer readiness
 * These are the document types that must be present for a cooperative to be considered buyer-ready
 */
export const REQUIRED_DOC_TYPES: DocType[] = [
  'policy', // child labor / social policy
  'certification', // Fairtrade/RA/Organic/etc.
  'land_evidence', // at least one document tied to land/plots
];

/**
 * Coverage thresholds for readiness status determination
 * These thresholds determine when a cooperative moves between readiness states
 */
export const COVERAGE_THRESHOLDS = {
  // Minimum percentage of farmers with declarations to be considered "in progress"
  farmerDeclarationsMinimum: 0.3,
  // Minimum percentage of farmers with declarations to be considered "buyer ready"
  farmerDeclarationsBuyerReady: 0.8,
  // Minimum percentage of plots with geo references to be considered "buyer ready"
  plotsGeoBuyerReady: 0.8,
  // Required percentage of required documents to be considered "buyer ready" (1.0 = 100%)
  docsCoverageBuyerReady: 1.0,
} as const;

/**
 * Countries known to be high-risk for deforestation
 * Used for contextual risk assessment
 */
export const HIGH_DEFORESTATION_RISK_COUNTRIES = [
  "Côte d'Ivoire",
  "Ghana",
  "Indonesia",
  "Malaysia",
  "Brazil",
  "Colombia",
] as const;

/**
 * Countries known to be medium-risk for deforestation
 */
export const MEDIUM_DEFORESTATION_RISK_COUNTRIES = [
  "Cameroon",
  "Ecuador",
  "Peru",
  "Vietnam",
] as const;

/**
 * EUDR-applicable countries (producer countries)
 * EUDR applies when products from these countries are imported into the EU
 */
export const EUDR_PRODUCER_COUNTRIES = [
  "Côte d'Ivoire",
  "Ghana",
  "Cameroon",
  "Nigeria",
  "Ecuador",
  "Peru",
  "Colombia",
  "Brazil",
  "Indonesia",
  "Malaysia",
  "Vietnam",
] as const;

/**
 * Crops that require child labor due diligence
 * These crops are commonly associated with child labor risks
 */
export const CHILD_LABOR_RISK_CROPS = [
  'cocoa',
  'coffee',
  'cotton',
  'sugar',
  'palm oil',
] as const;

/**
 * Buyer regions that trigger EUDR requirements
 * If a buyer is in one of these regions and the product comes from an EUDR producer country,
 * EUDR is applicable
 */
export const EUDR_BUYER_REGIONS = [
  'EU',
  'Europe',
  'European Union',
] as const;


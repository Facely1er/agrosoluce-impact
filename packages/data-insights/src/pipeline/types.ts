/**
 * Data pipeline types for modular intake and enrichment
 * Supports multiple data sources and pluggable enrichment layers
 */

export type SourceId = 'vrac' | 'weather' | 'production' | 'census' | string;

export type EnrichmentLayerId =
  | 'health-index'
  | 'region-normalization'
  | 'antibiotic-index'
  | 'analgesic-index'
  | 'time-lag-indicator'
  | 'weather-correlation'
  | 'production-forecast'
  | string;

/** Raw parsed row from a source file */
export interface ParsedRow {
  code?: string;
  designation?: string;
  quantitySold?: number;
  [key: string]: unknown;
}

/** Base period data shape - common across sources */
export interface BasePeriodData {
  sourceId: SourceId;
  periodLabel: string;
  year: number;
  periodStart: string;
  periodEnd: string;
  /** Opaque raw data - shape depends on source */
  raw: unknown;
}

/** File-to-period mapping for ingest */
export interface FileMapping {
  file: string;
  subdir?: string;
  sourceId: SourceId;
  periodLabel: string;
  year: number;
  /** Optional: override keys for this mapping */
  meta?: Record<string, unknown>;
}

/** Source definition: how to parse and produce period data */
export interface DataSource<T extends BasePeriodData = BasePeriodData> {
  id: SourceId;
  /** Parse file content into period data */
  parse(content: string, mapping: FileMapping): T | null;
  /** File mappings for this source */
  fileMappings: FileMapping[];
  /** Description for docs */
  description?: string;
}

/** Enrichment step: takes period data, returns enriched data */
export interface EnrichmentLayer<TIn = unknown, TOut = TIn> {
  id: EnrichmentLayerId;
  /** Run enrichment on period data */
  enrich(data: TIn): TOut;
  /** Optional: layer depends on another layer's output */
  dependsOn?: EnrichmentLayerId[];
  description?: string;
}

/** Pipeline run result */
export interface PipelineResult<T = unknown> {
  sourceId: SourceId;
  periods: T[];
  enrichments: EnrichmentLayerId[];
  processedAt: string;
}

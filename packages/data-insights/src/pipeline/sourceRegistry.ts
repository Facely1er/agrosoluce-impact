/**
 * Source registry: register data sources for ingest
 * Add new sources here when new file types are introduced
 */

import type { DataSource, FileMapping } from './types';

const sources = new Map<string, DataSource>();

export function registerSource<T extends { id: string }>(source: DataSource<T>): void {
  sources.set(source.id, source as DataSource);
}

export function getSource(id: string): DataSource | undefined {
  return sources.get(id);
}

export function listSources(): DataSource[] {
  return Array.from(sources.values());
}

export function getFileMappingsForSource(sourceId: string): FileMapping[] {
  const source = sources.get(sourceId);
  return source?.fileMappings ?? [];
}

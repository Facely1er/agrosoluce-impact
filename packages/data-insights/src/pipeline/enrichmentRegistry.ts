/**
 * Enrichment registry: register enrichment layers
 * Layers run in dependency order; each layer can transform period data
 */

import type { EnrichmentLayer } from './types';

const layers = new Map<string, EnrichmentLayer>();

export function registerEnrichment<TIn, TOut>(layer: EnrichmentLayer<TIn, TOut>): void {
  layers.set(layer.id, layer as EnrichmentLayer);
}

export function getEnrichment(id: string): EnrichmentLayer | undefined {
  return layers.get(id);
}

export function listEnrichments(): EnrichmentLayer[] {
  return Array.from(layers.values());
}

/** Resolve enrichment order based on dependencies */
export function getEnrichmentOrder(): string[] {
  const ordered: string[] = [];
  const visited = new Set<string>();

  function visit(id: string) {
    if (visited.has(id)) return;
    visited.add(id);
    const layer = layers.get(id);
    if (layer?.dependsOn) {
      for (const dep of layer.dependsOn) {
        visit(dep);
      }
    }
    ordered.push(id);
  }

  for (const id of layers.keys()) {
    visit(id);
  }
  return ordered;
}

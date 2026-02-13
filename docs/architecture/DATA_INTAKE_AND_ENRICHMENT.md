# Data Intake and Enrichment Architecture

Overview of the modular data pipeline for health/agriculture/environment impact analysis.

## Structure

```
packages/data-insights/
├── src/
│   ├── pipeline/           # Pipeline types and registries
│   │   ├── types.ts        # SourceId, EnrichmentLayer, FileMapping, etc.
│   │   ├── sourceRegistry.ts
│   │   ├── enrichmentRegistry.ts
│   │   └── runVracPipeline.ts
│   ├── sources/            # Data source adapters
│   │   └── vrac/
│   │       ├── parsers.ts   # parseEtat2080, parseListeProduits
│   │       ├── vracSource.ts # File mappings + parse()
│   │       └── types.ts
│   ├── enrichment/         # Enrichment layers
│   │   ├── productTaxonomy.ts
│   │   ├── healthIndexEnrichment.ts
│   │   └── regionNormalizationEnrichment.ts
│   └── catalog.ts          # PHARMACIES, PERIOD_LABELS
```

## Adding New Files for Enrichment

### 1. Register a new file mapping

Edit `packages/data-insights/src/sources/vrac/vracSource.ts`:

```ts
// Add to VRAC_FILE_MAPPINGS or VRAC_LISTE_MAPPINGS
{ file: 'ETAT_2080QTE9.csv', subdir: 'TANDA/2080', sourceId: VRAC_SOURCE_ID, periodLabel: 'Aug–Dec 2026', year: 2026 },
```

### 2. Add a new parser (for new file format)

Edit `packages/data-insights/src/sources/vrac/parsers.ts`:

```ts
export function parseNewFormat(content: string): VracParsedRow[] {
  // ... parse logic
}
```

Then wire it in `inferParserType()` and `parseVracContent()` in `vracSource.ts`.

### 3. Add a new data source (e.g. weather, production)

1. Create `packages/data-insights/src/sources/weather/` with:
   - `parsers.ts` or equivalent
   - `weatherSource.ts` implementing `DataSource<T>`
   - `types.ts`
2. Register: `registerSource(weatherDataSource)`
3. Add file mappings for the new source
4. Create `scripts/weather/processWeatherData.ts` that reads files and writes output

## Enrichment Layers

| Layer | Purpose | Depends On |
|-------|---------|------------|
| `health-index` | Antimalarial share (malaria proxy) | — |
| `region-normalization` | Map pharmacy → region, cocoa/urban flag | health-index |
| `antibiotic-index` | Antibiotic share (infection proxy) | health-index |
| `time-lag-indicator` | Flag harvest-window alignment + workforce risk | health-index |

**Running with enrichment:** `npm run vrac:process:enrich` outputs `enriched.json` in addition to `processed.json`.

**Client-side enrichment:** When the app loads `processed.json` (enriched.json not found), it runs `applyEnrichments()` in the browser. Enriched insights (antibiotic, harvest risk, category breakdown) are always available when `processed.json` exists — no need to run `vrac:process:enrich` for the UI.

### Adding a new enrichment layer

1. Create `packages/data-insights/src/enrichment/myEnrichment.ts`:

```ts
import type { EnrichmentLayer } from '../pipeline/types';

export const myEnrichment: EnrichmentLayer<InputType, OutputType> = {
  id: 'my-enrichment',
  description: '...',
  dependsOn: ['health-index'], // optional
  enrich(data) {
    return { ...data, myField: computeMyField(data) };
  },
};
```

2. Export from `enrichment/index.ts` and register: `registerEnrichment(myEnrichment)`

## Potential Additional Enrichment Layers

| Layer | Data Source | Purpose |
|-------|-------------|---------|
| **weather-correlation** | NOAA/CPC rainfall, Marcus Weather | Join rainfall with pharmacy sales; validate time-lag |
| **production-forecast** | Cocoa marketing year data | Correlate health index with production decline |
| **time-lag-indicator** | Derived | Flag periods where malaria surge aligns with harvest window |
| **antibiotic-index** | Product taxonomy | Respiratory/infection proxy (complement to antimalarial) |
| **census-overlay** | RGPH2021, FAO census | Population-normalize sales by region |
| **deforestation-risk** | Satelligence, GFW | Overlay deforestation alerts with pharmacy regions |

## External Data Sources to Consider

- **Weather**: NOAA CPC Africa rainfall, Spire Global
- **Production**: ICCO, national cocoa boards
- **Census**: RGPH2021 (Côte d'Ivoire), FAO agricultural census
- **Environment**: Global Forest Watch, Satelligence deforestation alerts

## Running the Pipeline

```bash
npm run vrac:process
```

Output: `apps/web/public/data/vrac/processed.json`

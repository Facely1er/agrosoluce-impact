# Data Management and Interpretation Methodologies

This document defines and documents the methodologies used across AgroSoluce Impact for **managing** (intake, processing, storage) and **interpreting** (enrichment, scoring, analytics) data. It is the single reference for how data is handled and how derived metrics are calculated.

**Related documentation:**
- [Data Intake and Enrichment Architecture](./DATA_INTAKE_AND_ENRICHMENT.md) — pipeline structure and how to add sources/enrichments
- [HWI Methodology](../analytics/HWI_METHODOLOGY.md) — Household Welfare Index purpose and ESG alignment
- [Health–Agriculture Correlation](../guides/Health_Agriculture_Correlation.md) — scientific basis for health–productivity analysis
- [VRAC Data Catalog](../strategic/VRAC_DATA_CATALOG.md) — pharmacy coverage and file formats
- [Dataset Enrichment Guide](../guides/DATASET_ENRICHMENT_GUIDE.md) — cooperative/database enrichment strategies

---

## 1. Data Management Methodologies

### 1.1 VRAC (Pharmacy Surveillance) Data Intake

**Purpose:** Ingest pharmacy sales CSV exports and produce normalized, period-level data for health and welfare analytics.

**Sources:** CSV files under `VRAC/` (and subdirs such as `TANDA/2080`, `PROLIFE/2080`). File mappings are defined in `packages/data-insights/src/sources/vrac/vracSource.ts`.

**Methodology:**

| Step | Description | Implementation |
|------|-------------|----------------|
| **File discovery** | Resolve paths from `VRAC_FILE_MAPPINGS` (ETAT_2080QTE) and `VRAC_LISTE_MAPPINGS` (ListeProduits). Prefer subdir when present. | `scripts/vrac/processVracData.ts` → `readFile(mapping)` |
| **Parsing** | Parse CSV with French number format (`2,561` or `2 561` → 2561). Two formats supported: ETAT_2080QTE (top 20 rows) and ListeProduits (full catalog). | `packages/data-insights/src/sources/vrac/parsers.ts`: `parseEtat2080`, `parseListeProduits`, `parseFrenchNumber`, `parseCsvLine` |
| **Normalization** | Each file yields one `VracPeriodData` per pharmacy/year: `pharmacyId`, `year`, `periodLabel`, `periodStart`, `products[]` (code, designation, quantitySold), `totalQuantity`. | `vracSource.parse()`, `parseVracContent()` |
| **Deduplication** | For each `(pharmacyId, year)`, keep the period with the **larger product set** (ListeProduits preferred over 2080 when both exist). | `packages/data-insights/src/pipeline/runVracPipeline.ts`: `deduplicatePeriods()` |
| **Output** | Write `periods[]` to `apps/web/public/data/vrac/processed.json` with `processedAt` timestamp. Optional `--enrich` writes `enriched.json`. | `scripts/vrac/processVracData.ts` |

**Commands:**
- Process only: `npm run vrac:process`
- Process and enrich: `npm run vrac:process:enrich`

**Database path (optional):** Processed data can be migrated to Supabase (`npm run vrac:migrate`). See [VRAC Data Catalog](../strategic/VRAC_DATA_CATALOG.md).

---

### 1.2 Product Taxonomy and Classification

**Purpose:** Map raw product codes and designations to therapeutic categories for health-index and HWI calculations.

**Methodology:**

- **VRAC pipeline (health/antibiotic index):** Uses a reduced taxonomy in `packages/data-insights/src/enrichment/productTaxonomy.ts`:
  - Categories: `antimalarial`, `antibiotic`, `analgesic`, `other`
  - Antimalarials: fixed code set (e.g. ARTEFAN, PLUFENTRINE) + designation substrings (artefan, plufentrine, artemether, lumefantrine, coartem, malarone, quinine)
  - Antibiotics: designation substrings (AMOXICILL, METRONIDAZ, CIPROFLOX, PENICILL, etc.)
  - Analgesics: PARACETAMOL, NOVALG, DICLO, IBUPROF, etc.

- **HWI (Household Welfare Index):** Uses full taxonomy in `packages/data-insights/src/classification/medicationTaxonomy.ts`:
  - Categories: `antimalarial`, `pediatric_ors_zinc`, `prenatal_vitamins`, `contraceptives`, `micronutrients`, `arv`, `antibiotics`, `other`
  - Classification is by regex patterns on product designation (and code where applicable). Each category maps to an ESG indicator type (workforce_health, child_welfare, womens_health, etc.).

**Interpretation rule:** Same product is never double-counted across categories; each product maps to exactly one category.

---

### 1.3 Enrichment Pipeline Order and Application

**Purpose:** Apply derived metrics (health index, region, antibiotic index, time-lag) in a consistent order so that later layers can depend on earlier outputs.

**Methodology:**

1. **Registration:** All default layers are registered in `packages/data-insights/src/enrichment/registerDefaultLayers.ts`.
2. **Dependency order:** Resolved by `getEnrichmentOrder()` in `enrichmentRegistry.ts` (topological sort on `dependsOn`). Current order:
   - `health-index` (no deps)
   - `region-normalization` (depends on health-index)
   - `antibiotic-index` (depends on health-index)
   - `analgesic-index` (depends on health-index)
   - `time-lag-indicator` (depends on health-index)
3. **Application:** For each period, layers run in order; each layer receives the output of the previous. Code: `applyEnrichments()` in `runVracPipeline.ts`.
4. **Client-side fallback:** If the app loads `processed.json` and `enriched.json` is not found, it can run `applyEnrichments()` in the browser so that antibiotic, time-lag, and region insights are still available.

---

## 2. Data Interpretation Methodologies

### 2.1 Health Index (Antimalarial Share — Malaria Proxy)

**Purpose:** Provide a proxy for malaria burden in the catchment area of each pharmacy, to support health–agriculture correlation and workforce risk interpretation.

**Formula:**
```
Antimalarial Share = Antimalarial Quantity / Total Pharmaceutical Quantity
```
- **Antimalarial Quantity:** Sum of `quantitySold` for products classified as `antimalarial` (product taxonomy above).
- **Total Quantity:** Sum of all products in the period, or `totalQuantity` when present.

**Output:** Per period: `healthIndex.antimalarialQuantity`, `healthIndex.antimalarialShare` (0–1), `healthIndex.totalQuantity`, and optional `healthIndex.categoryBreakdown`.

**Implementation:** `packages/data-insights/src/enrichment/healthIndexEnrichment.ts` — `computeHealthIndexFromPeriod()`.

**Interpretation:** Higher share indicates higher malaria-related medication demand and thus higher workforce health risk in that period/region. Used in time-lag and regional comparisons (see [Health–Agriculture Correlation](../guides/Health_Agriculture_Correlation.md)).

---

### 2.2 Region Normalization

**Purpose:** Map each pharmacy to a region label and a cocoa/urban flag for comparative analysis (cocoa zones vs urban baseline).

**Methodology:**

- **Mapping (fixed):** Pharmacy ID (lowercase) → region ID → label and cocoa flag.
  - `tanda` → `gontougo` → "Gontougo (cocoa)", cocoa
  - `prolife` → `gontougo` → "Gontougo (cocoa)", cocoa
  - `olympique` → `abidjan` → "Abidjan (urban)", not cocoa
  - `attobrou` → `la_me` → "La Mé (cocoa)", cocoa
- **Output:** `regionId`, `regionLabel`, `isCocoaRegion` (boolean).

**Implementation:** `packages/data-insights/src/enrichment/regionNormalizationEnrichment.ts`.

**Interpretation:** Enables aggregation and comparison by cocoa vs urban and by named region.

---

### 2.3 Antibiotic Index (Infection Proxy)

**Purpose:** Complement antimalarial share with a proxy for bacterial/respiratory infection burden.

**Formula:**
```
Antibiotic Share = Antibiotic Quantity / Total Pharmaceutical Quantity
```
- **Antibiotic Quantity:** Sum of `quantitySold` for products classified as `antibiotic` in product taxonomy.

**Output:** `antibioticIndex.antibioticQuantity`, `antibioticIndex.antibioticShare` (0–1).

**Implementation:** `packages/data-insights/src/enrichment/antibioticIndexEnrichment.ts`.

**Interpretation:** Higher share suggests higher acute infection-related demand; used alongside antimalarial for broader health burden context.

---

### 2.4 Analgesic Index (Pain/Comfort Proxy)

**Purpose:** Complement antimalarial and antibiotic with a proxy for pain/comfort medication demand (analgesics, anti-inflammatories).

**Formula:**
```
Analgesic Share = Analgesic Quantity / Total Pharmaceutical Quantity
```
- **Analgesic Quantity:** Sum of `quantitySold` for products classified as `analgesic` in product taxonomy (e.g. PARACETAMOL, NOVALG, DICLO, IBUPROF).

**Output:** `analgesicIndex.analgesicQuantity`, `analgesicIndex.analgesicShare` (0–1).

**Implementation:** `packages/data-insights/src/enrichment/analgesicIndexEnrichment.ts`.

**Interpretation:** Contributes to broader health burden context; category breakdown (health index) also exposes analgesic quantities.

---

### 2.5 Time-Lag Indicator (Harvest-Window Workforce Risk)

**Purpose:** Flag periods that fall within the cocoa harvest window and classify workforce risk based on antimalarial share (malaria surge overlapping with harvest).

**Methodology:**

- **Harvest window:** Months **8, 9, 10, 11, 12, 1, 2, 3** (Aug–Mar). Period is considered “in harvest window” if the period start month (from `periodStart`) is in this set.
- **Harvest-aligned risk (from antimalarial share only):**
  - **High:** antimalarial share ≥ 15%
  - **Medium:** antimalarial share ≥ 8% and &lt; 15%
  - **Low:** antimalarial share &lt; 8%

**Output:** `timeLagIndicator.inHarvestWindow` (boolean), `timeLagIndicator.harvestAlignedRisk` (`'low' | 'medium' | 'high'`).

**Implementation:** `packages/data-insights/src/enrichment/timeLagIndicatorEnrichment.ts`.

**Interpretation:** High antimalarial share during harvest months indicates elevated workforce risk and potential productivity impact (see [Health–Agriculture Correlation](../guides/Health_Agriculture_Correlation.md)).

---

### 2.6 Household Welfare Index (HWI)

**Purpose:** Composite indicator of household distress from pharmaceutical purchasing patterns (0–100, higher = worse conditions). Used as an early-warning signal for living income, child labor risk, gender equity, and health access (ESG alignment in [HWI Methodology](../analytics/HWI_METHODOLOGY.md)).

**Methodology:**

1. **Category breakdown:** From VRAC product sales, aggregate quantities by HWI medication category (antimalarial, pediatric_ors_zinc, prenatal_vitamins, contraceptives, micronutrients, arv, antibiotics, other). Shares are category quantity / total quantity (0–1).
2. **Component scores (per category):**  
   For each category (except `other`):
   ```
   Component Score = min(100, (Category Share / Empirical Maximum) × 100)
   ```
   Empirical maximums (crisis thresholds) are defined in `packages/data-insights/src/classification/categoryWeights.ts` (`CATEGORY_MAX_THRESHOLDS`):

   | Category            | Empirical max (share) | Meaning                      |
   |---------------------|------------------------|------------------------------|
   | Antimalarial        | 0.35                   | Severe malaria epidemic      |
   | Pediatric ORS/Zinc  | 0.15                   | Severe WASH crisis           |
   | Prenatal vitamins   | 0.08                   | High pregnancy, low care     |
   | Contraceptives      | 0.05                   | Family planning crisis       |
   | Micronutrients      | 0.12                   | Severe malnutrition          |
   | ARV                 | 0.08                   | High HIV burden              |
   | Antibiotics         | 0.20                   | Severe infection outbreak    |

3. **Composite HWI score:**
   ```
   HWI Score = Σ (Component Score × Category Weight)
   ```
   Weights (sum to 1.0): antimalarial 25%, pediatric_ors_zinc 20%, prenatal_vitamins 15%, contraceptives 15%, micronutrients 10%, arv 10%, antibiotics 5%. Result rounded to 2 decimals and capped at 100.

4. **Alert level:** Derived from HWI score:
   - **Green:** 0–25 (normal)
   - **Yellow:** 25–50 (elevated stress)
   - **Red:** 50–75 (crisis)
   - **Black:** 75–100 (severe crisis)

**Implementation:**  
- Calculation: `packages/data-insights/src/analytics/hwi/calculateHWI.ts` (e.g. `calculateHWI`, `calculateHWIScore`, `calculateComponentScores`).  
- Weights and thresholds: `packages/data-insights/src/classification/categoryWeights.ts`.  
- Medication taxonomy: `packages/data-insights/src/classification/medicationTaxonomy.ts`.  
- Script: `scripts/hwi/calculateHWI.ts`; migration can populate `household_welfare_index` (e.g. `scripts/vrac/migrateVracToSupabase.ts`).

**Interpretation:** Used on `/hwi` for scores by pharmacy/period, alert distribution, component breakdowns, and time series; response protocols by alert level are described in [HWI Methodology](../analytics/HWI_METHODOLOGY.md).

---

### 2.6 Child Labor Assessment and Readiness Score

**Purpose:** Support monitoring and readiness for child labor prevention (ILO Convention 182, ICI standards). The **readiness score** reflects documentation and self-reported assessment data, not a legal compliance determination.

**Methodology:**

- **School enrollment rate (calculated):**  
  When `total_children_in_community > 0`:  
  `school_enrollment_rate = (children_enrolled_school / total_children_in_community) × 100`; else 0.  
  Stored as a generated column in DB.

- **Readiness score:**  
  Integer 0–100, stored in `readiness_score`. It is intended to reflect completeness and consistency of assessment data and self-reported indicators. Exact formula may be configurable (e.g. self-assessment checklist). Legacy `compliance_score` is deprecated in favor of `readiness_score`.

- **Violation tracking:** Counts for `child_labor_violations`, `hazardous_work_violations`, `worst_forms_violations` and `violation_severity` are stored for interpretation and reporting; they are not automatically rolled into a single score in the current schema (see migration `020_rename_compliance_to_readiness.sql` and types in `apps/web/src/types/child-labor-monitoring-types.ts`).

**Implementation:**  
- Schema: `packages/database/migrations/020_rename_compliance_to_readiness.sql`, `023_*` as applicable.  
- Types: `apps/web/src/types/child-labor-monitoring-types.ts`.  
- Context and system design: [AgroSoluce Child Labor Prevention System](../guides/AgroSoluce_Child_Labor_Prevention_System.md).

**Interpretation:** Readiness score supports prioritization and improvement of assessment quality; violation fields support compliance reporting and response protocols.

---

### 2.7 Cooperative and Dataset Enrichment (Database)

**Purpose:** Improve matching, analytics, and compliance use cases by adding fields, lookup tables, computed views, and enrichment functions to the cooperative/dataset schema.

**Methodology:** Documented in [Dataset Enrichment Guide](../guides/DATASET_ENRICHMENT_GUIDE.md). Summary:

- **Strategies:** Add columns to existing tables; create lookup tables (e.g. market_prices, geographic_data); create enriched views; add enrichment functions (e.g. `calculate_cooperative_enrichment_score`, `auto_enrich_cooperative`); triggers; seed reference data; enrichment metadata/logging.
- **Data quality score:** Used to prioritize and track enrichment (e.g. 0–100 completeness).
- **Source tracking:** Enrichment source and timing should be logged for audit and reproducibility.

**Implementation:** Migration `009_dataset_enrichment_guide.sql` and app services (e.g. `enrichmentService.ts`, `enrichmentOrchestrationService.ts`). Interpretation of enriched fields is context-dependent (matching, reporting, compliance).

---

## 3. Summary Table

| Area | Methodology | Key formula / rule | Code reference |
|------|-------------|--------------------|----------------|
| VRAC intake | Parse CSV → normalize → dedupe by (pharmacy, year), keep larger product set | Prefer ListeProduits over 2080 when both exist | `processVracData.ts`, `runVracPipeline.ts`, `parsers.ts` |
| Health index | Antimalarial share | `antimalarialQty / totalQty` | `healthIndexEnrichment.ts` |
| Region | Pharmacy → region + cocoa flag | Fixed mapping (tanda/prolife→gontougo, olympique→abidjan, attobrou→la_me) | `regionNormalizationEnrichment.ts` |
| Antibiotic index | Antibiotic share | `antibioticQty / totalQty` | `antibioticIndexEnrichment.ts` |
| Time-lag | Harvest window + risk band | Harvest months 8,9,10,11,12,1,2,3; risk high ≥15%, medium ≥8% | `timeLagIndicatorEnrichment.ts` |
| HWI | Weighted composite from category shares | Component = (share/max)×100; HWI = Σ(component×weight); alert by score band | `calculateHWI.ts`, `categoryWeights.ts`, `medicationTaxonomy.ts` |
| Child labor readiness | Enrollment rate + readiness score | enrollment_rate = enrolled/total×100; readiness 0–100 (self-assessment) | Migrations 020, types child-labor-monitoring-types |
| Dataset enrichment | Views, functions, lookups, triggers | Varies by field; see DATASET_ENRICHMENT_GUIDE | `009_dataset_enrichment_guide.sql`, enrichmentService |

---

**Document status:** Living document  
**Last updated:** February 2026  
**Maintainer:** Align with code in `packages/data-insights` and `packages/database` when changing formulas or thresholds.

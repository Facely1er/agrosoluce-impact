# AgroSoluce – Phase 1 Data Enrichment Implementation Plan

Goal: 
Use existing cooperative + document + farmer/plot data to:
- Attach contextual risk tags (geo & regulatory)
- Extract document metadata
- Compute coverage ratios
- Generate a dynamic readiness checklist

This phase does NOT do:
- Any AI "decision-making"
- Hard compliance scoring ("compliant"/"non-compliant")
- Farmer-level judgments

---

## 0. Repo & Context Sanity Check

- [ ] Find core domain files for cooperatives, documents, and farmers/plots:
      - [ ] Types/interfaces (e.g. `src/types`, `src/lib/types`, etc.)
      - [ ] Data access/services (e.g. `src/services`, `src/lib/db`, `src/lib/supabase`)
      - [ ] Coop dashboard components/pages (e.g. `src/pages/cooperative/*`, `src/features/cooperative/*`, `src/features/dashboard/*`)

- [ ] Document in this file (for human later):
      - [ ] The exact paths of:
            - Cooperative type definition
            - Cooperative dashboard component
            - Document upload logic
            - Farmer/plot data access (if already present)

---

## 1. Database Schema – Add Enrichment Fields

### 1.1 Cooperative Context & Coverage Columns

**Objective:** Extend `cooperatives` table with enrichment JSON + coverage indicators.

- [ ] Add the following columns to the `cooperatives` table (via Supabase migration or SQL file):
      - [ ] `contextual_risks` (JSON or JSONB, nullable)
            - Shape suggestion:
              ```json
              {
                "deforestation_zone": "low" | "medium" | "high" | "unknown",
                "protected_area_overlap": "yes" | "no" | "unknown",
                "climate_risk": "low" | "medium" | "high" | "unknown"
              }
              ```
      - [ ] `regulatory_context` (JSON or JSONB, nullable)
            - Example:
              ```json
              {
                "eudr_applicable": true,
                "child_labor_due_diligence_required": true,
                "other_requirements": ["company_internal", "importer_specific"]
              }
              ```
      - [ ] `coverage_metrics` (JSON or JSONB, nullable)
            - Example:
              ```json
              {
                "farmers_total": 120,
                "farmers_with_declarations": 80,
                "plots_total": 200,
                "plots_with_geo": 150,
                "required_docs_total": 5,
                "required_docs_present": 3
              }
              ```
      - [ ] `readiness_status` (TEXT, default `'not_ready'`)
            - Enum values (enforced by application logic at this stage):
              - `not_ready`
              - `in_progress`
              - `buyer_ready`

### 1.2 Document Metadata

**Objective:** Make documents actually useful without manual inspection every time.

- [ ] Ensure there is a `cooperative_documents` (or equivalent) table.
- [ ] Add/confirm the following columns:
      - [ ] `doc_type` (TEXT)
            - e.g. `'certification' | 'policy' | 'land_evidence' | 'other'`
      - [ ] `issuer` (TEXT, nullable)
      - [ ] `issued_at` (TIMESTAMP, nullable)
      - [ ] `expires_at` (TIMESTAMP, nullable)
      - [ ] `is_required_type` (BOOLEAN, default false)
      - [ ] `metadata` (JSON/JSONB, optional, for future expansion)

---

## 2. Type Definitions – Keep Frontend Honest

**Objective:** Reflect new DB fields in TypeScript, to avoid “stringly typed” hacks.

- [ ] Locate cooperative type(s), e.g.:
      - `src/types/cooperative.ts` or similar.
- [ ] Extend cooperative types:
      - [ ] Add `contextual_risks`, `regulatory_context`, `coverage_metrics`, `readiness_status`.
- [ ] Locate document type(s), e.g.:
      - `src/types/document.ts` or similar.
- [ ] Extend document types:
      - [ ] `doc_type`, `issuer`, `issued_at`, `expires_at`, `is_required_type`, `metadata`.

- [ ] Ensure all relevant services/hooks/components importing these types are updated compilation-safe (TS errors fixed).

---

## 3. Enrichment Service Layer

Create a dedicated enrichment module – **no UI logic here**.

### 3.1 Create Enrichment Service Skeleton

- [ ] Create a file (or confirm existence and extend) such as:
      - `src/services/enrichmentService.ts`
- [ ] Implement the following pure functions (no React imports, no UI):

```ts
// Pseudo-signatures; Cursor to fill concrete imports/types.

export function computeContextualRisks(
  cooperative: Cooperative
): Cooperative['contextual_risks'] {
  // Use cooperative.country, region, etc.
  // For Phase 1, use simple rules:
  // - If country in ["Côte d'Ivoire", "Ghana"] → deforestation_zone = "high" (example)
  // - protected_area_overlap = "unknown"
  // - climate_risk = "unknown"
}

export function computeRegulatoryContext(
  cooperative: Cooperative,
  buyerRegions?: string[]
): Cooperative['regulatory_context'] {
  // Phase 1:
  // - eudr_applicable = cooperative.country in known producer list AND buyerRegions include EU
  // - child_labor_due_diligence_required = true if crop is cocoa/coffee, etc.
}

export function computeCoverageMetrics(
  farmersTotal: number,
  farmersWithDeclarations: number,
  plotsTotal: number,
  plotsWithGeo: number,
  requiredDocsTotal: number,
  requiredDocsPresent: number
): Cooperative['coverage_metrics'] {
  // Straightforward math; no scoring.
}

export function deriveReadinessStatus(
  coverage: Cooperative['coverage_metrics']
): 'not_ready' | 'in_progress' | 'buyer_ready' {
  // Phase 1 simple rule example:
  // - not_ready: farmers_with_declarations / farmers_total < 0.3
  // - in_progress: between 0.3 and 0.8, or missing required documents
  // - buyer_ready: high coverage on all fronts (e.g. >=0.8) AND required_docs_present == required_docs_total
}
3.2 Document Metadata Helper
 In src/services/documentMetadataService.ts (or similar), create:

ts
Copy code
export function inferDocumentTypeFromFilenameOrPath(path: string): DocType {
  // Cheap heuristic:
  // - if name contains "policy" → "policy"
  // - if name contains "certificate", "cert" → "certification"
  // - if name contains "map", "gps", "plot" → "land_evidence"
  // Else: "other"
}

export function extractDocumentDatesFromNameOrManualInput(
  filename: string,
  manualIssuedAt?: string,
  manualExpiresAt?: string
): { issued_at?: string; expires_at?: string } {
  // Phase 1: just pass through manual inputs; no heavy parsing.
  // Future: add regex parsing if needed.
}
4. Trigger Points – When to Recompute Enrichment
4.1 On Cooperative Data Change
Objective: When coop profile changes, recompute contextual & regulatory context.

 Locate cooperative update logic:
- Example: src/services/cooperativeService.ts, src/hooks/useCooperative, or mutation handlers.

 After successful profile update:
- [ ] Fetch latest cooperative record
- [ ] Compute:
- contextual_risks
- regulatory_context
- [ ] Persist updated fields back to cooperatives table.

4.2 On Farmer/Plot or Document Change
Objective: Coverage metrics + readiness status must reflect reality.

 Locate:
- Farmers/plots save logic
- Document upload logic

 After:
- a new farmer/plot is added/updated
- a new document is added/updated
Do:
- [ ] Query:
- farmers_total
- farmers_with_declarations
- plots_total
- plots_with_geo
- required_docs_total (based on your required types config)
- required_docs_present
- [ ] Compute coverage_metrics via computeCoverageMetrics()
- [ ] Compute readiness_status via deriveReadinessStatus()
- [ ] Update the cooperatives row.

4.3 Admin “Recalculate Now” Button (Optional but Useful)
 In coop admin tools (if exist), add a button:
- “Recalculate readiness”
- Calls an endpoint or function that:
- recomputes all metrics and readiness for that coop
- returns updated cooperative object

5. UI Wiring – Show Enrichment without Overcomplicating
5.1 Coop Dashboard Home
 Locate the main coop dashboard page/component.

 Add:
- Readiness status badge:
- Values: Not Ready, In Progress, Buyer-Ready
- Coverage widget:
- Farmers documented: coverage_metrics.farmers_with_declarations / farmers_total
- Plots with geo: coverage_metrics.plots_with_geo / plots_total
- Docs coverage: required_docs_present / required_docs_total
- Contextual risks widget:
- Show deforestation_zone, climate_risk, protected_area_overlap as tags (with unknown allowed).

5.2 Document List UI
 On the coop’s document center page:
- Show doc_type, issuer, issued_at, expires_at.
- Add icon/label for:
- Required doc types
- Expiring soon (e.g. within 90 days)

 On document upload:
- Pre-fill doc_type using inferDocumentTypeFromFilenameOrPath()
- Allow manual override
- Optionally allow manual input of issued_at / expires_at

5.3 Readiness Checklist Component
Objective: Convert enrichment into action, not a mystery.

 Create a component, e.g.:
- src/components/CoopReadinessChecklist.tsx

 Input:
- coverage_metrics
- contextual_risks
- regulatory_context

 Output (UI):
- List of items with status icons:
- e.g.:
- “Add declarations for at least 70% of farmers” (complete/partial/missing)
- “Add plot geo references for at least 70% of plots”
- “Upload child labor policy”
- “Upload at least one land/plot evidence document”

This checklist is derived from the data, not manually written for each coop.

6. Config & Constants – Avoid Hardcoding Everywhere
 Create a config file, e.g.:
- src/config/enrichmentConfig.ts

 Define:
- Required document types:
ts export const REQUIRED_DOC_TYPES: DocType[] = [ 'policy', // child labor / social policy 'certification', // Fairtrade/RA/Organic/etc. 'land_evidence' // at least one document tied to land/plots ];
- Thresholds:
ts export const COVERAGE_THRESHOLDS = { farmerDeclarationsBuyerReady: 0.8, farmerDeclarationsMinimum: 0.3, plotsGeoBuyerReady: 0.8, docsCoverageBuyerReady: 1.0 };
- Country/crop/regulation mappings (very simple Phase 1, can be refined later).

Ensure enrichment functions import these constants, not magic numbers.

7. Testing & Sanity Checks
 Add basic unit tests for:
- computeCoverageMetrics
- deriveReadinessStatus
- computeRegulatoryContext (simple path)
- inferDocumentTypeFromFilenameOrPath

 Add at least one integration test (if test infra exists) that:
- Creates a fake coop + farmers + plots + docs
- Runs enrichment pipeline
- Asserts:
- coverage metrics correct
- readiness_status consistent with config

8. Non-Functional Guardrails (VERY IMPORTANT)
 Ensure NO function:
- marks a coop as “compliant/non-compliant”
- asserts “no child labor” or “fully EUDR compliant”

 All wording in UI must reflect:
- “Readiness” / “Evidence coverage” / “Due diligence support”
- NOT “certification” or “guarantee”

 Add comments in enrichment service:
- Clarify that:
- functions provide context and metrics only
- they are not legal/compliance guarantees.
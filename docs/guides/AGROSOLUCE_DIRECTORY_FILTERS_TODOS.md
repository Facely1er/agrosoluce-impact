# AgroSoluce – Directory Filters & Context-First Listing (Cursor TODOs)

Goal:
- Make the directory entrypoint **product-first, region-aware, coverage-aware**.
- Do NOT land directly on coop names.
- Keep cocoa focus, but support all EUDR products.

---

## 0. Locate the directory page & types

- [ ] In Cursor, GLOBAL SEARCH:

      "DirectoryPage"
      "CooperativeDirectory"
      "/directory"
      "cooperative list"

- [ ] Identify the main directory component file, e.g.:

      src/pages/directory/DirectoryPage.tsx
      src/pages/DirectoryPage.tsx
      or similar

- [ ] Identify the cooperative type, e.g.:

      interface Cooperative { ... }
      type Cooperative = { ... }

  (likely under `src/types/` or `src/features/cooperatives/`)

Keep these files open. You’ll need them in later steps.

---

## 1. Ensure EUDR commodities & coverage types exist

If you already created `EudrCommodity` from earlier crop work, reuse it.  
If not, create it now.

### 1.1 Add/verify commodity type

- [ ] Create or update `src/types/commodity.ts`:

```ts
// TODO[directory-filters]: central EUDR commodity type & labels

export type EudrCommodity =
  | 'cocoa'
  | 'coffee'
  | 'palm_oil'
  | 'rubber'
  | 'soy'
  | 'cattle'
  | 'wood';

export const EUDR_COMMODITIES_IN_SCOPE: { id: EudrCommodity; label: string }[] = [
  { id: 'cocoa', label: 'Cocoa' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'palm_oil', label: 'Palm oil' },
  { id: 'rubber', label: 'Natural rubber' },
  { id: 'soy', label: 'Soy' },
  { id: 'cattle', label: 'Cattle (beef/leather)' },
  { id: 'wood', label: 'Wood / timber' }
];
1.2 Cooperative data must know its commodities, country, region
 In the Cooperative type, add or verify:

ts
Copy code
// TODO[directory-filters]: ensure cooperative is geo- & crop-aware

import type { EudrCommodity } from '@/types/commodity';

export interface Cooperative {
  id: string;
  name: string;

  countryCode: string;      // e.g. "CI"
  regionName?: string;      // e.g. "Nawa", "Haut-Sassandra"

  commodities?: EudrCommodity[]; // ['cocoa', 'coffee']

  // existing fields...
}
Adjust field names to match your current schema if needed (but keep the idea).

1.3 Coverage band type (if not already)
 If you don’t have a shared type, add:

ts
Copy code
export type CoverageBand = 'limited' | 'partial' | 'substantial';
Use this instead of magic string literals wherever possible.

2. Decide what coverage you show in the directory
In v1, directory cards should show:

The selected commodity’s band for that coop (if available),

Or “No documentation” if none.

Assume you have per-commodity coverage somewhere (or at least a cooperative-level band to start with).

 Locate coverage data used on coop detail or workspace:

arduino
Copy code
"coverageBand"
"coveragePercent"
"coverage metrics"
 Identify how to get, for a given cooperative + commodity, a band/percent.
If you don’t have full per-commodity metrics yet, use current cooperative-level coverage as a fallback for cocoa only, and show “Not available” for others.

You can refine this later; the filters don’t depend on perfect metrics.

3. Implement filters on the DirectoryPage
In your directory page component (e.g. DirectoryPage.tsx):

3.1 Add state for filters
 At the top of the component, import types:

ts
Copy code
import { useState, useMemo } from 'react';
import {
  EUDR_COMMODITIES_IN_SCOPE,
  type EudrCommodity
} from '@/types/commodity';
import type { Cooperative } from '@/types/cooperative'; // adjust path
import type { CoverageBand } from '@/types/coverage'; // or inline if needed
 Add filter state:

ts
Copy code
// TODO[directory-filters]: directory filter controls
const [selectedCommodity, setSelectedCommodity] = useState<EudrCommodity | 'all'>('cocoa');
const [selectedCountry, setSelectedCountry] = useState<string>('CI'); // Côte d'Ivoire as v1 default
const [selectedRegion, setSelectedRegion] = useState<string>('all');
const [selectedCoverage, setSelectedCoverage] = useState<CoverageBand | 'all'>('all');
If your data includes other countries, that’s fine; CI as default is consistent with your strategy.

3.2 Derive filter options from data
 Build unique lists for regions & countries from cooperatives:

ts
Copy code
// cooperatives: Cooperative[] (make sure this is the prop / state you use for data)

const countries = useMemo(
  () =>
    Array.from(
      new Set(
        cooperatives
          .map((c) => c.countryCode)
          .filter(Boolean)
      )
    ),
  [cooperatives]
);

const regions = useMemo(
  () =>
    Array.from(
      new Set(
        cooperatives
          .filter((c) =>
            selectedCountry === 'all' ? true : c.countryCode === selectedCountry
          )
          .map((c) => c.regionName || 'Unspecified')
      )
    ),
  [cooperatives, selectedCountry]
);
3.3 Build the filtered list
 Add a helper to get coverage band for a coop + commodity (you can refine later):

ts
Copy code
function getCoverageBandForCommodity(
  coop: Cooperative,
  commodity: EudrCommodity
): CoverageBand | null {
  // TODO[directory-filters]: replace this placeholder with real per-commodity lookup
  // For now, if the coop has that commodity at all, fall back to its main coverageBand.
  // If you already have per-commodity metrics, plug them in instead.
  if (!coop.commodities?.includes(commodity)) return null;

  // Assuming coop.coverageBand exists; adjust if needed
  return (coop as any).coverageBand ?? null;
}
 Build the filtered list:

ts
Copy code
// TODO[directory-filters]: apply commodity, geography, coverage filters

const filteredCooperatives = useMemo(() => {
  return cooperatives.filter((coop) => {
    // 1) commodity filter
    if (selectedCommodity !== 'all') {
      if (!coop.commodities?.includes(selectedCommodity)) return false;
    }

    // 2) country filter
    if (selectedCountry !== 'all' && coop.countryCode !== selectedCountry) {
      return false;
    }

    // 3) region filter
    if (selectedRegion !== 'all') {
      const region = coop.regionName || 'Unspecified';
      if (region !== selectedRegion) return false;
    }

    // 4) coverage filter (per selected commodity if any)
    if (selectedCoverage !== 'all') {
      if (selectedCommodity === 'all') {
        // If all commodities are selected, fall back to coop-level coverage if present
        const band = (coop as any).coverageBand as CoverageBand | undefined;
        if (!band || band !== selectedCoverage) return false;
      } else {
        const band = getCoverageBandForCommodity(coop, selectedCommodity);
        if (!band || band !== selectedCoverage) return false;
      }
    }

    return true;
  });
}, [cooperatives, selectedCommodity, selectedCountry, selectedRegion, selectedCoverage]);
4. Render the filter bar (context-first UI)
Above the list, render filter controls in this order:

4.1 Filter bar JSX
 In the directory page JSX, add something like:

tsx
Copy code
// TODO[directory-filters]: context-first filters bar

<section className="mb-4 space-y-2">
  <p className="text-xs text-gray-600">
    Filter cooperatives by EUDR commodity, geography, and documentation coverage to support sourcing and due-diligence planning.
  </p>

  <div className="flex flex-wrap gap-3 items-center text-xs">
    {/* Commodity */}
    <label className="flex items-center gap-1">
      <span className="font-medium">Commodity</span>
      <select
        value={selectedCommodity}
        onChange={(e) =>
          setSelectedCommodity(e.target.value as EudrCommodity | 'all')
        }
        className="border rounded px-2 py-1 text-xs"
      >
        <option value="all">All EUDR commodities</option>
        {EUDR_COMMODITIES_IN_SCOPE.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </select>
    </label>

    {/* Country */}
    <label className="flex items-center gap-1">
      <span className="font-medium">Country</span>
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="border rounded px-2 py-1 text-xs"
      >
        <option value="all">All</option>
        {countries.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
    </label>

    {/* Region */}
    <label className="flex items-center gap-1">
      <span className="font-medium">Region</span>
      <select
        value={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
        className="border rounded px-2 py-1 text-xs"
      >
        <option value="all">All</option>
        {regions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </label>

    {/* Coverage */}
    <label className="flex items-center gap-1">
      <span className="font-medium">Coverage</span>
      <select
        value={selectedCoverage}
        onChange={(e) =>
          setSelectedCoverage(
            e.target.value === 'all'
              ? 'all'
              : (e.target.value as CoverageBand)
          )
        }
        className="border rounded px-2 py-1 text-xs"
      >
        <option value="all">All levels</option>
        <option value="substantial">Substantial</option>
        <option value="partial">Partial</option>
        <option value="limited">Limited</option>
      </select>
    </label>
  </div>
</section>
5. Change result cards to show context first
Find where you map over cooperatives (or similar):

tsx
Copy code
{cooperatives.map((coop) => (
  ...
))}
Replace with filteredCooperatives and adjust card content:

tsx
Copy code
// TODO[directory-filters]: show context (product / region / coverage) first

{filteredCooperatives.length === 0 && (
  <p className="text-xs text-gray-500 mt-4">
    No cooperatives match the current filters. Try broadening commodity, region, or coverage level.
  </p>
)}

<ul className="space-y-3">
  {filteredCooperatives.map((coop) => {
    const regionLabel = coop.regionName || 'Unspecified region';

    const primaryCommodity =
      selectedCommodity === 'all'
        ? coop.commodities?.[0] ?? null
        : selectedCommodity;

    return (
      <li key={coop.id} className="border rounded-lg p-3 bg-white">
        {/* Context line */}
        <div className="text-xs text-gray-600 mb-1">
          <span className="font-semibold">
            {primaryCommodity
              ? EUDR_COMMODITIES_IN_SCOPE.find((c) => c.id === primaryCommodity)?.label ??
                'Multi-commodity'
              : 'Multi-commodity'}
          </span>{' '}
          • {coop.countryCode}{' '}
          • {regionLabel}
        </div>

        {/* Coop name */}
        <h2 className="text-sm font-semibold mb-1">{coop.name}</h2>

        {/* Coverage snippet (commodity-aware if possible) */}
        <div className="text-xs text-gray-600">
          {/* Replace with real band/percent lookup if you have it */}
          <span>
            Documentation coverage:{' '}
            {/* placeholder – wire to real function once ready */}
            {(coop as any).coverageBand
              ? ((coop as any).coverageBand as string).charAt(0).toUpperCase() +
                ((coop as any).coverageBand as string).slice(1)
              : 'Not available'}
          </span>
        </div>

        {/* CTA / link */}
        <div className="mt-2">
          <a
            href={`/directory/${coop.id}`}
            className="text-xs font-medium underline"
          >
            View cooperative profile →
          </a>
        </div>
      </li>
    );
  })}
</ul>
You can refine coverage lookups later; goal here is context before name + filters.

6. Copy & disclaimer check
 Add/verify a small explanatory text at top of directory page:

tsx
Copy code
<p className="text-xs text-gray-600 mb-2">
  This directory helps you explore cooperatives by EUDR commodity, geography, and documentation
  coverage. Information may include cooperative self-reported data and does not constitute
  certification, verification, or regulatory approval.
</p>
 Ensure no wording in directory says:

“compliant”

“EUDR certified”

“risk-free”

7. Quick sanity checks
 Default view: Commodity = Cocoa, Country = CI, Coverage = All → list shows cocoa coops in CI.

 Changing commodity to Coffee updates list accordingly.

 Changing coverage to Substantial reduces list to high-coverage coops.

 Deep link /directory/:coop_id still works and is unaffected by filters.

 No runtime errors in dev and build:
- npm run dev
- npm run build

yaml
Copy code

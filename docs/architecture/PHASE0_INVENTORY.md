# Phase 0: Inventory & Route Mapping

**Status:** ✅ Complete  
**Date:** Generated during monorepo migration

---

## 0.1 Entry Points & React Roots

### Found Entry Points

| File | Type | Status | Notes |
|------|------|--------|-------|
| `src/main.tsx` | React root | ✅ **PRIMARY** | Single entry point - this is the shipping app |
| `index.html` | HTML entry | ✅ **PRIMARY** | Root-level HTML file |

### Decision

✅ **Single React root found** - No untangling needed. This is a clean single-page application.

**Action:** This will become `apps/web/src/main.tsx`

---

## 0.2 Route Mapping → Conceptual Apps

### Routes Found in `src/App.tsx`

| Route | Component | Conceptual App | Notes |
|-------|-----------|----------------|-------|
| `/` | `MarketplaceHome` | **MARKET** | Public landing page |
| `/cooperatives` | `CooperativeDirectory` | **MARKET** | Public directory listing |
| `/cooperatives/:id` | `CooperativeProfile` | **MARKET** | Public cooperative profile |
| `/directory` | `DirectoryPage` | **MARKET** | Public directory (canonical) |
| `/directory/:coop_id` | `DirectoryDetailPage` | **MARKET** | Public cooperative detail |
| `/workspace/:coop_id` | `CooperativeWorkspace` | **WORKSPACE** | Cooperative cockpit |
| `/pilot/:pilot_id` | `PilotDashboardPage` | **WORKSPACE** | Pilot dashboard |
| `/assessment` | `AssessmentPage` | **WORKSPACE** | Assessment flow |
| `/cooperative/:id/farmers-first` | `FarmersFirstDashboard` | **WORKSPACE** | Farmers First toolkit |
| `/buyer` | `BuyerPortal` | **MARKET** | Buyer-facing portal |
| `/buyer/request` | `BuyerRequestForm` | **MARKET** | Buyer request form |
| `/buyer/requests/:requestId/matches` | `BuyerMatches` | **MARKET** | Buyer matches |
| `/principles/farmer-protection` | `FarmerProtectionPage` | **MARKET** | Public principles page |
| `/regulatory-references` | `RegulatoryReferencesPage` | **MARKET** | Public regulatory info |
| `/references/ngo` | `NGORegistryPage` | **MARKET** | Public NGO registry |
| `/governance/due-care` | `DueCarePrinciplesPage` | **MARKET** | Public governance info |
| `/compliance/child-labor` | `ChildLaborDashboard` | **MARKET** | Public compliance dashboard |
| `/compliance/assessments/new` | `AssessmentForm` | **WORKSPACE** | Legacy assessment form |
| `/compliance/assessments/:id/edit` | `AssessmentForm` | **WORKSPACE** | Legacy assessment form |

### Route Classification

#### MARKET (Public-facing)
- `/` - Landing
- `/cooperatives/*` - Directory
- `/directory/*` - Canonical directory
- `/buyer/*` - Buyer portal
- `/principles/*` - Principles pages
- `/regulatory-references` - Regulatory info
- `/references/*` - Reference pages
- `/governance/*` - Governance pages
- `/compliance/child-labor` - Public compliance dashboard

#### WORKSPACE (Cooperative cockpit)
- `/workspace/:coop_id` - Main workspace
- `/pilot/:pilot_id` - Pilot dashboard
- `/assessment` - Assessment flow
- `/cooperative/:id/farmers-first` - Farmers First
- `/compliance/assessments/*` - Legacy assessment forms

### Decision

✅ **Single app with mixed routes** - All routes are in one SPA. For v1 launch, this stays as `apps/web`.

**Future consideration:** Could split into `apps/market` and `apps/workspace` later, but not needed for v1.

---

## 0.3 Config Files Inventory

### Found Config Files

| File | Type | Status | Notes |
|------|------|--------|-------|
| `vite.config.ts` | Vite config | ✅ **PRIMARY** | Single Vite config - canonical |
| `tsconfig.json` | TypeScript | ✅ **PRIMARY** | Root TS config |
| `tsconfig.app.json` | TypeScript | ✅ **PRIMARY** | App-specific TS config |
| `tsconfig.node.json` | TypeScript | ✅ **PRIMARY** | Node-specific TS config |
| `tailwind.config.js` | Tailwind | ✅ **PRIMARY** | Tailwind config |
| `postcss.config.js` | PostCSS | ✅ **PRIMARY** | PostCSS config |
| `eslint.config.js` | ESLint | ✅ **PRIMARY** | ESLint config |
| `vitest.config.ts` | Vitest | ✅ **PRIMARY** | Test config |
| `package.json` | Dependencies | ✅ **PRIMARY** | Root package.json |
| `netlify.toml` | Deployment | ✅ **PRIMARY** | Netlify config |
| `vercel.json` | Deployment | ✅ **PRIMARY** | Vercel config |

### Decision

✅ **Single set of configs** - No conflicts. All configs are canonical and will move to `apps/web/`.

---

## 0.4 Legacy / Dead Code Identification

### Potential Legacy Areas

| Path | Status | Action |
|------|--------|--------|
| `src/pages/admin/` | ⚠️ **CHECK** | Review if used |
| `src/pages/auth/` | ⚠️ **CHECK** | Review if used |
| `src/pages/compliance/` | ⚠️ **CHECK** | May have legacy assessment forms |
| Root-level `.md` files (many) | 📝 **DOCS** | Keep for reference, not code |
| `ChildLaborDashboard.tsx` (root) | ⚠️ **CHECK** | May be duplicate |
| `child-labor-monitoring-schema.sql` (root) | ⚠️ **CHECK** | Should be in `database/` |
| `child-labor-monitoring-types.ts` (root) | ⚠️ **CHECK** | Should be in `src/types/` |

### Action Items

- [x] Check if `src/pages/admin/` is used anywhere → **Empty folder, can be ignored**
- [x] Check if `src/pages/auth/` is used anywhere → **Empty folder, can be ignored**
- [x] Verify `ChildLaborDashboard.tsx` in root vs `src/components/compliance/` → **Root file is duplicate, real one is in `src/components/compliance/`**
- [ ] Move SQL files from root to `database/migrations/` if needed
- [ ] Move type files from root to `src/types/` if needed

---

## 0.5 Package.json Analysis

### Current package.json

- **Name:** `agrosoluce-marketplace`
- **Type:** Single app (not monorepo)
- **Scripts:** Standard Vite scripts + migration scripts
- **Dependencies:** React, Vite, Supabase, routing, etc.

### Decision

✅ **Single package.json** - Will become `apps/web/package.json` with updated name: `@agrosoluce/web`

---

## 0.6 Directory Structure Analysis

### Current Structure

```
15-AgroSoluce/
├── src/                    # Source code
│   ├── main.tsx           # Entry point
│   ├── App.tsx            # Router
│   ├── pages/             # Page components
│   ├── components/        # Shared components
│   ├── features/          # Feature modules
│   ├── hooks/             # React hooks
│   ├── lib/               # Utilities
│   ├── services/          # Business logic
│   └── types/             # TypeScript types
├── database/              # Database migrations
├── public/                # Static assets
├── scripts/               # Build/deploy scripts
├── package.json           # Dependencies
├── vite.config.ts         # Vite config
└── [many .md files]       # Documentation
```

### Target Structure (Monorepo)

```
agrosoluce/
├── apps/
│   └── web/              # ← Current src/ + configs
├── packages/
│   └── database/         # ← Current database/
└── package.json          # ← Root workspaces config
```

---

## Summary & Next Steps

### ✅ Clean Single App

**Good news:** This is a clean single-page application with:
- One React root
- One router
- One set of configs
- Clear route structure

**No untangling needed!** We can proceed directly to Phase 1 (Structure).

### Migration Path

1. ✅ **Phase 0 Complete** - Inventory done, no untangling needed
2. ⏭️ **Phase 1** - Create monorepo structure and move files
3. ⏭️ **Phase 2** - Configure workspaces and shared configs
4. ⏭️ **Phase 3** - Test and verify

### Action Items Before Phase 1

- [ ] Review `src/pages/admin/` and `src/pages/auth/` - are they used?
- [ ] Check for duplicate files (e.g., `ChildLaborDashboard.tsx` in root)
- [ ] Move any stray SQL/type files to proper locations
- [ ] Create backup branch: `backup-before-monorepo`
- [ ] Create migration branch: `feat/monorepo-migration`

---

## Ready for Phase 1

✅ **All Phase 0 tasks complete**  
✅ **No blocking issues found**  
✅ **Ready to proceed with structure migration**

Proceed to `MONOREPO_MIGRATION.md` Phase 1.


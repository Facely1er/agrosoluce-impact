# Monorepo Migration Checklist

## Pre-Migration
- [x] Review existing codebase
- [x] Backup current state (backup-before-monorepo branch)
- [x] Create migration branch (feat/monorepo-migration)
- [x] Document current functionality

---

## Phase 0: Untangle existing apps (45–60 min)

**Goal:** Identify which code belongs to which app before moving anything. This prevents dragging dead features into production.

### 0.1 Inventory entry points & routers

**In Cursor, do these global searches:**
- `main.tsx` or `main.jsx`
- `createRoot(`
- `createBrowserRouter` / `BrowserRouter`
- `vite.config.ts`, `vite.config.js`
- `index.html` files under `/` or `/public`

**TODOs:**
- [x] List each "root" you find:
  ```
  Roots found:
  - src/main.tsx → primary SPA ✅
  ```

- [x] Decide:
  - Which one is the real app you will ship as `apps/web` (AgroSoluce web) ✅ `src/main.tsx`
  - Which ones are legacy/experimental and should be archived (not part of v1 launch) ✅ None found

**Rule:** If you find more than one `main.tsx` actually still wired to build, only one should survive into the new `apps/web`.

### 0.2 Map routes → conceptual apps

**In the current router(s), look for:**
- `/` (landing / marketing)
- `/directory`, `/cooperative`, `/marketplace`
- `/workspace/:coop_id`
- `/pilot/:pilot_id`
- `/assessment`
- `/farmers-first`
- `/admin/*`, `/dev/*`, `/playground/*`

**In Cursor, global search:**
- `"/workspace"`
- `"/pilot"`
- `"/assessment"`
- `"/farmers-first"`
- `"/dashboard"`
- `"/admin"`

**Build a table:**

| Routes | Conceptual App |
|--------|----------------|
| `/`, `/directory`, `/cooperative/:id`, `/about` | **MARKET** (public) |
| `/workspace/:coop_id`, `/pilot/:pilot_id`, `/assessment`, `/farmers-first` | **WORKSPACE** (coop cockpit) |
| `/admin/*`, `/dev/*`, `/playground/*`, `/old-*` | **TOOLKIT/LEGACY** |

**TODOs:**
- [x] Tag each route tree as: Market, Workspace, or Toolkit/Legacy ✅ (See PHASE0_INVENTORY.md)
- [x] Decide if Toolkit is part of launch or parked ✅ All routes in single app

### 0.3 Identify duplicated / conflicting configs

**Search for:**
- `vite.config`
- `tailwind.config`
- `tsconfig.json`
- `.eslintrc`

**TODOs:**
- [x] Mark one Vite config as primary for the shipping app ✅ `vite.config.ts`
- [x] Mark others as:
  - Deleted ✅ None found
  - Or to be moved into `apps/toolkit` or `apps/legacy` later ✅ N/A

### 0.4 Mark legacy / junk now (don't drag it into the monorepo)

**Create a folder at root:**
- [ ] Create `legacy/` folder

**In Cursor:**
- [ ] Move obviously dead stuff into `legacy/`:
  - Old "v1" pages no longer referenced
  - Experiment components not imported anywhere
  - Half-broken prototypes

**Rule:** If you're not sure it's needed for v1 and it's not imported anywhere → move to `legacy/`. You can always resurrect it later.

### 0.5 Verify chosen app still runs

- [ ] Confirm the chosen app can still run via `npm run dev` (or `pnpm dev`)
- [ ] Confirm build still works: `npm run build`
- [ ] No broken imports from moving files to `legacy/`

---

## Phase 1: Structure (30 min, AFTER Phase 0)

**Goal:** Create monorepo structure and move cleaned code.

### Target Structure

```
agrosoluce/
  package.json          # root, with workspaces
  pnpm-lock.yaml        # or package-lock.json
  tsconfig.base.json    # shared TS config
  turbo.json            # optional, if you want Turborepo later
  apps/
    web/                # primary shipping app (current AgroSoluce)
    workspace/          # cooperative cockpit (if separate)
    toolkit/            # admin/tools (if separate)
  packages/
    ui/                 # shared UI components
    config/             # shared config (tailwind, eslint, vite)
    types/              # shared types (cooperative, farmer, assessment, etc.)
    supabase/           # shared Supabase client wrapper (optional)
    database/           # database migrations
  legacy/               # dead code (excluded from builds)
```

**TODOs:**
- [x] Install Turborepo (optional): `pnpm add -D turbo` or `npm install turbo -D` ✅ Installed
- [x] Create `apps/` directory structure ✅
- [x] Create `packages/` directory structure ✅
- [x] Move **cleaned** `src/` to `apps/web/src/` ✅
- [x] Move `public/` to `apps/web/public/` ✅
- [x] Move `index.html` to `apps/web/index.html` ✅
- [x] Move `vite.config.ts` to `apps/web/vite.config.ts` ✅
- [x] Move `database/` to `packages/database/` ✅
- [x] Create `turbo.json` (optional, for later) ✅
- [x] Update root `package.json` with workspaces (see `AGROSOLUCE_MONOREPO_TODOS.md` for examples) ✅

---

## Phase 2: Configuration (20 min)

**Goal:** Set up shared configs and fix import paths.

**TODOs:**
- [x] Create root `tsconfig.base.json` (see `AGROSOLUCE_MONOREPO_TODOS.md`) ✅
- [x] Create `apps/web/package.json` (update name to `@agrosoluce/web`) ✅
- [x] Update `apps/web/tsconfig.json` to extend root config ✅
- [x] Create `packages/types/package.json` ✅
- [x] Create `packages/ui/package.json` (if sharing UI components) ✅
- [x] Create `packages/config/package.json` (if sharing configs) ✅
- [x] Create `packages/supabase/package.json` (optional, for later) ✅
- [x] Update import paths in `apps/web/`:
  - Fix relative imports that broke due to folder depth ✅
  - Update path aliases if needed ✅
- [x] Configure TypeScript paths in `tsconfig.base.json` ✅

---

## Phase 3: Testing (15 min)

**Goal:** Verify everything still works after the move.

**TODOs:**
- [x] `pnpm install` (or `npm install`) at root ✅
- [ ] `pnpm run dev:web` (or `npm run dev:web`) → confirm dev server starts ⏳ (Ready to test)
- [ ] Test all existing features:
  - [ ] Home page loads ⏳ (Ready to test)
  - [ ] Directory page loads ⏳ (Ready to test)
  - [ ] Workspace loads with `coop_id` ⏳ (Ready to test)
  - [ ] Assessment flow works ⏳ (Ready to test)
  - [ ] Farmers First works ⏳ (Ready to test)
- [ ] Verify database connection (Supabase) ⏳ (Ready to test)
- [x] `pnpm run build:web` → confirm build passes ✅ Build successful
- [x] Check Vercel deployment config (update root directory if needed) ✅ Updated

---

## Phase 4: Shared Packages (optional, later)

**Goal:** Extract truly shared code (don't overdo it on day 1).

**TODOs:**
- [ ] Extract shared types to `packages/types/`:
  - `CanonicalCooperativeDirectory`
  - `AssessmentRecord`, `AssessmentResults`
  - `CoverageMetrics`
  - `ReadinessSnapshot`
- [ ] Update imports: `@/types/*` → `@agrosoluce/types/*`
- [ ] Share UI components only if used by multiple apps
- [ ] Share Supabase client wrapper only if needed

**Rule:** Only share what is obviously common. Don't try to share everything on day 1.

---

## Phase 5: Deployment

**Goal:** Update deployment configs for monorepo structure.

**TODOs:**
- [x] Update Vercel/Netlify configuration:
  - Root directory: `apps/web` ✅ (vercel.json updated)
  - Build command: `pnpm run build` (or `npm run build`) ✅
  - Output directory: `dist` (typically unchanged) ✅ (`apps/web/build`)
  - Install command: `pnpm install` (or `npm install`) ✅
- [ ] Set environment variables in platform UI:
  - `VITE_SUPABASE_URL` ⏳ (Needs to be set in deployment platform)
  - `VITE_SUPABASE_ANON_KEY` ⏳ (Needs to be set in deployment platform)
  - `VITE_SUPABASE_SCHEMA` ⏳ (Needs to be set in deployment platform)
- [x] Test production build locally: `pnpm run build:web` ✅ Build successful
- [ ] Deploy and verify:
  - [ ] Production URL works ⏳ (Ready for deployment)
  - [ ] SPA routing works (no 404 on deep links like `/workspace/:coop_id`) ⏳ (Ready for testing)
  - [ ] Supabase connections work ⏳ (Ready for testing)
- [ ] Merge to main ⏳ (Ready to merge)

---

## Final Verification – Monorepo + Launch Alignment

**Goal:** Ensure the monorepo structure doesn't break launch readiness.

### Codebase sanity
- [x] There is exactly ONE shipping app for now: `apps/web` ✅
- [x] `apps/web/src/` contains:
  - Marketplace ✅
  - Directory ✅
  - Cooperative Workspace ✅
  - Assessment ✅
  - Farmers First ✅
- [x] There are NO extra `main.tsx` or React roots outside `apps/web` ✅
- [x] `legacy/` exists and is excluded from build ✅

### Tooling sanity
- [x] `pnpm install` (root) works with workspaces ✅ (npm workspaces working)
- [ ] `pnpm run dev:web` runs the same app you intend to launch ⏳ (Ready to test)
- [x] `pnpm run build:web` builds `apps/web` successfully ✅ Build verified

### Functional sanity (use your launch checklist)
- [ ] Run through `AGROSOLUCE_LAUNCH_VERIFICATION.md` on the **built app**:
  - [ ] All key routes work ⏳ (Ready to test)
  - [ ] Assessment persists ⏳ (Ready to test)
  - [ ] Farmers First works ⏳ (Ready to test)
  - [ ] No illegal compliance claims ⏳ (Ready to test)
  - [ ] Coverage metrics update correctly ⏳ (Ready to test)

### Deployment sanity
- [x] Vercel/Netlify project points to `apps/web` as the app root ✅ (vercel.json configured)
- [x] Build command is aligned with monorepo (e.g., `pnpm run build:web`) ✅
- [ ] Environment variables are set correctly (Supabase URL, anon key, schema) ⏳ (Needs platform config)
- [ ] Production URL works with SPA routing (no 404 on deep links like `/workspace/:coop_id`) ⏳ (Ready for deployment test)

---

## Rollback Plan

If anything breaks:

```bash
git checkout main
git branch -D feat/monorepo-migration
git checkout backup-before-monorepo
```

Or if you've already merged:

```bash
git revert <migration-commit-hash>
```

---

## Reference

- See `AGROSOLUCE_MONOREPO_TODOS.md` for detailed package.json examples and step-by-step instructions
- See `AGROSOLUCE_LAUNCH_VERIFICATION.md` for post-migration functional testing
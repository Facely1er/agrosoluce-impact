# AgroSoluce Monorepo – Cursor TODOs

## 0. Prep – Decide names & mapping

- [ ] List current separate projects and map them:

      Repo / Folder                      → Monorepo App
      --------------------------------------------------------
      (Current single repo)              → apps/web (primary shipping app)
      (If separate repos exist)          → apps/workspace
      (If separate repos exist)          → apps/toolkit

- [ ] Confirm all apps are using:
      - React + Vite + TS (or similar)
      - npm / pnpm / yarn (pick ONE for the monorepo - recommend pnpm)

---

## 1. Create monorepo skeleton

### 1.1 Root folder

- [ ] Create root folder `agrosoluce` (or rename existing main repo)

Inside it, create structure:

```txt
agrosoluce/
  package.json
  tsconfig.base.json
  pnpm-lock.yaml (or package-lock.json)
  turbo.json (optional, for later)
  apps/
  packages/
  legacy/
```

- [ ] Move current project's code into apps/web/:
  - Current: `src/` → `apps/web/src/`
  - Current: `public/` → `apps/web/public/`
  - Current: `index.html` → `apps/web/index.html`
  - Current: `vite.config.ts` → `apps/web/vite.config.ts`
  - Current: `package.json` → `apps/web/package.json` (will update)

- [ ] Do not delete anything yet; just move.

### 1.2 Configure root package.json (workspaces)

#### 1.2.1 Pick one: npm, pnpm, or yarn

**Recommendation: Use pnpm (faster, better for monorepos).**

Root package.json example:

```json
{
  "name": "agrosoluce-monorepo",
  "private": true,
  "version": "0.1.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "pnpm --filter @agrosoluce/web dev",
    "dev:workspace": "pnpm --filter @agrosoluce/workspace dev",
    "dev:toolkit": "pnpm --filter @agrosoluce/toolkit dev",
    "build:web": "pnpm --filter @agrosoluce/web build",
    "build:workspace": "pnpm --filter @agrosoluce/workspace build",
    "build:toolkit": "pnpm --filter @agrosoluce/toolkit build",
    "build": "pnpm run build:web && pnpm run build:workspace && pnpm run build:toolkit",
    "lint": "pnpm --filter @agrosoluce/web lint",
    "type-check": "pnpm --filter @agrosoluce/web type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

**If using npm instead:**

```json
{
  "name": "agrosoluce-monorepo",
  "private": true,
  "version": "0.1.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev:web": "npm run dev --workspace apps/web",
    "dev:workspace": "npm run dev --workspace apps/workspace",
    "dev:toolkit": "npm run dev --workspace apps/toolkit",
    "build:web": "npm run build --workspace apps/web",
    "build:workspace": "npm run build --workspace apps/workspace",
    "build:toolkit": "npm run build --workspace apps/toolkit",
    "build": "npm run build:web && npm run build:workspace && npm run build:toolkit"
  }
}
```

**TODOs:**

- [ ] Create root package.json with `private: true` and workspaces as above
- [ ] In each app (apps/web/package.json etc.):
  - Update name to be unique per app (e.g., `"name": "@agrosoluce/web"`)
  - Remove their own lockfiles if present (package-lock.json, pnpm-lock.yaml) after install
  - Keep app-specific scripts (dev, build, etc.)

---

## 2. Shared config & types (minimal but useful)

### 2.1 Shared TS config

File: `tsconfig.base.json` at root:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@agrosoluce/types/*": ["packages/types/src/*"],
      "@agrosoluce/ui/*": ["packages/ui/src/*"],
      "@agrosoluce/config/*": ["packages/config/src/*"],
      "@agrosoluce/supabase/*": ["packages/supabase/src/*"]
    }
  },
  "exclude": ["node_modules", "dist", "build", "legacy"]
}
```

**TODOs:**

- [ ] Create `tsconfig.base.json` at root
- [ ] Update each app `tsconfig.json` to extend it:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/types" },
    { "path": "../../packages/ui" }
  ]
}
```

**Note:** Paths adjust depending on how many `../` you need (from `apps/<app>` up to root).

---

## 3. Minimal shared packages (don't overdo it)

Create:

```
packages/
  types/
    package.json
    src/
      index.ts
  ui/
    package.json
    src/
      index.tsx
  config/
    package.json
    src/
      tailwind.config.ts
      vite.config.base.ts
  supabase/
    package.json
    src/
      client.ts
```

### 3.1 packages/types/package.json

```json
{
  "name": "@agrosoluce/types",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  }
}
```

### 3.2 packages/ui/package.json

```json
{
  "name": "@agrosoluce/ui",
  "version": "0.1.0",
  "main": "src/index.tsx",
  "types": "src/index.tsx",
  "exports": {
    ".": "./src/index.tsx"
  },
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

### 3.3 packages/config/package.json

```json
{
  "name": "@agrosoluce/config",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

### 3.4 packages/supabase/package.json

```json
{
  "name": "@agrosoluce/supabase",
  "version": "0.1.0",
  "main": "src/client.ts",
  "types": "src/client.ts",
  "peerDependencies": {
    "@supabase/supabase-js": "^2.0.0"
  }
}
```

**TODOs:**

- [ ] Extract truly shared types:
  - Cooperative (`CanonicalCooperativeDirectory`)
  - Farmer (`Farmer`, `FarmerDeclaration`)
  - Assessment (`AssessmentRecord`, `AssessmentResults`)
  - Coverage (`CoverageMetrics`, `DocumentPresence`)
  - Readiness (`ReadinessSnapshot`)

- [ ] Move them into `packages/types/src/`
- [ ] Update imports across apps from:
  - `@/types/assessment.types` → `@agrosoluce/types/assessment`
  - OR keep local and only share where it makes sense

**Rule:** Do not try to share everything on day 1. Only share what is obviously common (cooperative, farmer, assessment).

---

## 4. Check & fix per-app build inside monorepo

For each app (web/workspace/toolkit):

### 4.1 Install deps at root

- [ ] From root: `pnpm install` (or `npm install` / `yarn install`)

### 4.2 Web app (primary shipping app)

- [ ] From root: `pnpm run dev:web` → confirm dev server starts
- [ ] From root: `pnpm run build:web` → confirm build passes

**Fix:**
- [ ] Import paths that broke because of folder depth change
- [ ] TS path issues due to new extends structure
- [ ] Vite config paths (public assets, etc.)
- [ ] Router paths (SPA fallback)

### 4.3 Workspace app (if separate)

- [ ] `pnpm run dev:workspace`
- [ ] `pnpm run build:workspace`

### 4.4 Toolkit app (if separate)

- [ ] `pnpm run dev:toolkit`
- [ ] `pnpm run build:toolkit`

**Rule:** No app is considered "migrated" until both dev and build run cleanly from the root.

---

## 5. Env & Supabase in a monorepo world

### 5.1 Env handling

**Recommended: per-app env:**

- `apps/web/.env.local`
- `apps/workspace/.env.local` (if separate)
- `apps/toolkit/.env.local` (if separate)

Each should define:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SCHEMA=agrosoluce
```

**TODOs:**

- [ ] If all apps use the same Supabase project, copy-paste env vars
- [ ] If not, keep them separate
- [ ] Verify env vars are still read correctly after path changes
- [ ] Add `.env.local` to `.gitignore` (if not already)

### 5.2 Supabase client reuse (optional)

Later, you can centralize Supabase logic:

- [ ] Create `packages/supabase` with one client factory
- [ ] Import it in each app

**For now:** Don't move Supabase if you're under time pressure. Just ensure env vars are still read correctly after path changes.

---

## 6. CI / Deploy alignment (Vercel / Netlify)

For each app:

**In Vercel/Netlify, set:**
- Root directory: `apps/web` (or `apps/workspace`, etc.)
- Build command: `pnpm run build` (or `npm run build`)
- Output directory: `dist` (typically unchanged)
- Install command: `pnpm install` (or `npm install`)

**TODOs:**

- [ ] Each app uses the correct env vars in its platform UI
- [ ] Build logs show the right paths (no references to old repo paths)
- [ ] SPA routing works (fallback to index.html for deep links)

---

## 7. Re-run launch verification after monorepo migration

After everything builds:

- [ ] Run through `AGROSOLUCE_LAUNCH_VERIFICATION.md` (core checklist):
  - Marketplace flows
  - Directory flows
  - Workspace flows
  - Assessment
  - Farmers First
  - Pilot dashboard

- [ ] Confirm no path changes broke routing (e.g., Vercel config, SPA fallback)
- [ ] Confirm no new TS errors introduced by shared `tsconfig.base.json`
- [ ] Confirm Supabase connections still work
- [ ] Confirm all migrations are still accessible

---

## 8. Nice-to-have monorepo improvements (later)

- [ ] Add Turborepo for caching (`turbo.json`, pipeline config)
- [ ] Add a root lint that runs across all apps
- [ ] Add a root format (Prettier) for consistent formatting
- [ ] Add shared ESLint config in `packages/config`
- [ ] Add shared Tailwind config in `packages/config`

---

## 9. Rollback Plan

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

## Summary

For **launch**, you don't need a fancy Nx/Turbo cathedral.

You need:

1. **All apps sitting under one monorepo root** (`apps/*`).
2. **Root `package.json` with workspaces and build scripts that work.**
3. **Each app still passes its `dev` and `build` from the root.**
4. **Your Supabase access and routing still behave the same.**

Do that, then re-run the **launch verification** you already have.

If both checklists are green, you have:
- A sane monorepo you can scale
- A single place to reason about AgroSoluce
- And a realistic v1 you can put in front of real people


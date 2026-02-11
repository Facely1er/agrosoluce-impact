# AgroSoluce Monorepo Target Structure

## Overview

**Keep it boring and predictable.** This structure is designed for clarity and maintainability, not complexity.

---

## Root Structure

```
agrosoluce/
├── package.json              # Root package.json with workspaces
├── pnpm-lock.yaml            # Lockfile (or package-lock.json / yarn.lock)
├── tsconfig.base.json        # Shared TypeScript configuration
├── turbo.json                # Optional: Turborepo config (for later)
├── .gitignore
├── README.md
│
├── apps/                     # Applications (runnable apps)
│   ├── web/                  # Primary shipping app (AgroSoluce web)
│   ├── workspace/            # Cooperative cockpit (if separate)
│   └── toolkit/              # Admin/tools (if separate, optional)
│
├── packages/                 # Shared packages (not runnable)
│   ├── types/                # Shared TypeScript types
│   ├── ui/                   # Shared UI components
│   ├── config/               # Shared configs (Tailwind, ESLint, Vite)
│   ├── supabase/             # Shared Supabase client wrapper (optional)
│   └── database/             # Database migrations
│
└── legacy/                   # Dead code (excluded from builds)
    └── [old experiments, unused code]
```

---

## apps/web/ (Primary Shipping App)

This is your main AgroSoluce application that will be deployed.

```
apps/web/
├── package.json              # App-specific dependencies
├── tsconfig.json             # Extends root tsconfig.base.json
├── vite.config.ts            # Vite configuration
├── index.html                # Entry HTML
├── .env.local                # Environment variables (gitignored)
│
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component
│   │
│   ├── pages/                # Page components
│   │   ├── marketplace/
│   │   ├── directory/
│   │   ├── workspace/
│   │   ├── pilot/
│   │   └── ...
│   │
│   ├── components/           # App-specific components
│   ├── features/             # Feature modules
│   ├── hooks/                # React hooks
│   ├── lib/                  # Utilities
│   ├── services/             # Business logic
│   └── types/                # App-specific types (if not shared)
│
└── public/                   # Static assets
    └── ...
```

**Key files:**
- `package.json`: Name should be `@agrosoluce/web`
- `tsconfig.json`: Extends `../../tsconfig.base.json`
- `vite.config.ts`: May reference shared config from `@agrosoluce/config`

---

## apps/workspace/ (If Separate)

If you decide to split the workspace into a separate app later:

```
apps/workspace/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env.local
└── src/
    └── [workspace-specific code]
```

**Note:** For v1 launch, this is likely part of `apps/web`. Only split if you have a clear reason.

---

## packages/types/ (Shared Types)

Shared TypeScript types used across apps.

```
packages/types/
├── package.json              # name: "@agrosoluce/types"
├── src/
│   ├── index.ts              # Main export
│   ├── cooperative.ts        # Cooperative types
│   ├── farmer.ts             # Farmer types
│   ├── assessment.ts         # Assessment types
│   ├── coverage.ts           # Coverage types
│   └── readiness.ts          # Readiness types
```

**Example package.json:**
```json
{
  "name": "@agrosoluce/types",
  "version": "0.1.0",
  "main": "src/index.ts",
  "types": "src/index.ts"
}
```

**Usage in apps:**
```typescript
import type { CanonicalCooperativeDirectory } from '@agrosoluce/types';
```

---

## packages/ui/ (Shared UI Components)

Shared React components used across apps.

```
packages/ui/
├── package.json              # name: "@agrosoluce/ui"
├── src/
│   ├── index.tsx             # Main export
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   └── ...
```

**Example package.json:**
```json
{
  "name": "@agrosoluce/ui",
  "version": "0.1.0",
  "main": "src/index.tsx",
  "types": "src/index.tsx",
  "peerDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**Note:** Only create this if you have components truly shared across apps. For v1, you might not need this.

---

## packages/config/ (Shared Configs)

Shared configuration files (Tailwind, ESLint, Vite base config).

```
packages/config/
├── package.json              # name: "@agrosoluce/config"
├── src/
│   ├── tailwind.config.ts
│   ├── vite.config.base.ts
│   └── eslint.config.js
```

**Note:** Only create this if you want to share configs. For v1, you might keep configs local to each app.

---

## packages/supabase/ (Shared Supabase Client)

Optional: Shared Supabase client wrapper.

```
packages/supabase/
├── package.json              # name: "@agrosoluce/supabase"
├── src/
│   ├── client.ts             # Supabase client factory
│   └── types.ts              # Database types (if using Supabase CLI)
```

**Note:** Only create this if you want to centralize Supabase logic. For v1, you can keep it in `apps/web/src/lib/supabase/`.

---

## packages/database/ (Database Migrations)

Database migrations and SQL files.

```
packages/database/
├── package.json              # name: "@agrosoluce/database"
├── migrations/
│   ├── 001_initial_schema_setup.sql
│   ├── 012_canonical_cooperative_directory.sql
│   ├── 019_add_assessment_tables.sql
│   └── ...
└── README.md                 # Migration instructions
```

**Example package.json:**
```json
{
  "name": "@agrosoluce/database",
  "version": "0.1.0",
  "scripts": {
    "migrate": "node scripts/migrate.js"
  }
}
```

---

## Root package.json Example

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
    "build:web": "pnpm --filter @agrosoluce/web build",
    "build": "pnpm run build:web",
    "lint": "pnpm --filter @agrosoluce/web lint",
    "type-check": "pnpm --filter @agrosoluce/web type-check"
  },
  "devDependencies": {
    "turbo": "^1.10.0"
  }
}
```

---

## Root tsconfig.base.json Example

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

---

## Migration Path

### Current State (Single Repo)
```
15-AgroSoluce/
├── src/
├── database/
├── package.json
└── ...
```

### Target State (Monorepo)
```
agrosoluce/
├── apps/
│   └── web/              # ← Current src/ goes here
├── packages/
│   └── database/         # ← Current database/ goes here
└── package.json          # ← Root workspaces config
```

---

## Key Principles

1. **Keep it simple:** Only create shared packages if you actually need them
2. **Start minimal:** For v1, you might only need `apps/web` and `packages/database`
3. **Grow organically:** Add `packages/types` when you have multiple apps sharing types
4. **Don't over-engineer:** You don't need Turborepo on day 1, but the structure supports it later

---

## Next Steps

1. Review `AGROSOLUCE_MONOREPO_TODOS.md` for detailed migration steps
2. Follow `MONOREPO_MIGRATION.md` Phase 0 to untangle existing code
3. Move code into this structure
4. Verify everything still works
5. Deploy and celebrate 🎉


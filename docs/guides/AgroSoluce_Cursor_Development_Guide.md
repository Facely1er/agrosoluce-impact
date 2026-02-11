# 🚀 AgroSoluce Development Guide
## Cursor AI Setup + Monorepo vs Separate Repos Analysis

**Date:** December 7, 2024  
**Purpose:** Technical implementation guide for building AgroSoluce using Cursor AI  
**Developer:** Facely Camara (CEO/CTO, ERMITS Corporation)  

---

## ✅ YES, YOU CAN USE CURSOR FOR THIS!

**Cursor is PERFECT for this project because:**

### 1. **AI-Assisted Full-Stack Development**
- ✅ React/Next.js (your websites)
- ✅ TypeScript (type safety)
- ✅ Tailwind CSS (styling)
- ✅ Supabase integration (database)
- ✅ React Native (mobile app)

### 2. **Rapid Prototyping**
- Generate components from descriptions
- Fix bugs instantly with AI suggestions
- Refactor code intelligently
- Generate TypeScript types automatically

### 3. **Documentation Integration**
- Reference your 3 specification files
- Generate code from requirements
- Maintain consistency across projects

### 4. **Cost-Effective Solo Development**
- You can build this alone (initially)
- AI pair programming reduces need for team
- Faster iteration = faster market validation

---

## 🏗️ MONOREPO VS. SEPARATE REPOS - ANALYSIS

### **Option A: Monorepo (Turborepo/Nx)** ⭐ RECOMMENDED

**Structure:**
```
agrosoluce/
├── apps/
│   ├── web/                 # Public website (Next.js)
│   ├── dashboard/           # Cooperative dashboard (Next.js)
│   └── mobile/              # Mobile app (React Native)
├── packages/
│   ├── ui/                  # Shared UI components
│   ├── database/            # Supabase types & queries
│   ├── auth/                # Authentication logic
│   └── utils/               # Shared utilities
├── turbo.json
├── package.json
└── README.md
```

**PROS:**
- ✅ **Shared code**: UI components, types, utilities
- ✅ **Single `npm install`**: Manage dependencies once
- ✅ **Consistent tooling**: ESLint, Prettier, TypeScript configs
- ✅ **Easy refactoring**: Change once, update everywhere
- ✅ **Turborepo caching**: Build/test only what changed
- ✅ **Better for solo dev**: One repo to manage

**CONS:**
- ❌ Larger initial setup
- ❌ Steeper learning curve (Turborepo)
- ❌ All-or-nothing Git operations

**WHEN TO USE:**
- ✅ You're the only developer (initially)
- ✅ Significant code sharing (database types, auth, UI)
- ✅ Want to move fast and refactor easily
- ✅ Plan to keep tight integration

---

### **Option B: Separate Repos (Polyrepo)**

**Structure:**
```
agrosoluce-web/              # Separate GitHub repo
├── app/
├── components/
└── package.json

agrosoluce-dashboard/        # Separate GitHub repo
├── app/
├── components/
└── package.json

agrosoluce-mobile/           # Separate GitHub repo
├── src/
├── android/
└── package.json
```

**PROS:**
- ✅ **Simpler setup**: Standard Next.js/React Native
- ✅ **Independent deployment**: Deploy web without touching dashboard
- ✅ **Easier CI/CD**: Separate GitHub Actions per repo
- ✅ **Team scaling**: Different teams own different repos (future)
- ✅ **Faster cloning**: Smaller repos

**CONS:**
- ❌ **Code duplication**: Copy/paste shared components
- ❌ **Dependency hell**: Version mismatches across repos
- ❌ **Refactoring pain**: Update 3 places for one change
- ❌ **Type sync issues**: Database types can drift

**WHEN TO USE:**
- ✅ Minimal code sharing
- ✅ Different deployment schedules
- ✅ Planning to hire separate teams soon
- ✅ Very different tech stacks (rare)

---

## 🎯 RECOMMENDATION: MONOREPO (TURBOREPO)

**Why Monorepo Wins for AgroSoluce:**

### 1. **Massive Code Sharing**
```typescript
// packages/database/types.ts
export interface Cooperative {
  id: string;
  name: string;
  memberCount: number;
  // ... shared across all 3 apps
}

// packages/ui/components/CooperativeCard.tsx
// Used in web (directory) AND dashboard
```

### 2. **Shared Authentication**
```typescript
// packages/auth/supabase.ts
// Same auth logic for website AND dashboard
```

### 3. **Database Schema Sync**
```typescript
// packages/database/schema.sql
// Generate TypeScript types for all apps
// Update once, TypeScript enforces everywhere
```

### 4. **Component Reuse**
```typescript
// packages/ui/
├── Button.tsx              // Used everywhere
├── CooperativeCard.tsx     // Web + Dashboard
├── FormInput.tsx           // All forms
└── MapView.tsx             // Web + Dashboard + Mobile
```

---

## 🛠️ TURBOREPO MONOREPO SETUP

### Step 1: Initialize Monorepo

```bash
# Install Cursor AI (if not already)
# Download from: https://cursor.sh

# Create monorepo
npx create-turbo@latest agrosoluce
cd agrosoluce

# Choose options:
# - Package manager: npm
# - Include example apps: Yes
```

### Step 2: Project Structure

```
agrosoluce/
├── .github/
│   └── workflows/
│       ├── web.yml          # Deploy public website
│       ├── dashboard.yml    # Deploy dashboard
│       └── mobile.yml       # Build mobile app
│
├── apps/
│   ├── web/                 # Public website
│   │   ├── app/
│   │   │   ├── page.tsx     # Homepage
│   │   │   ├── directory/
│   │   │   ├── toolkit/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── public/
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   ├── dashboard/           # Cooperative dashboard
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   └── login/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── members/
│   │   │   │   ├── farms/
│   │   │   │   ├── compliance/
│   │   │   │   └── financial/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   ├── next.config.js
│   │   └── package.json
│   │
│   └── mobile/              # React Native mobile app
│       ├── src/
│       │   ├── screens/
│       │   ├── components/
│       │   ├── navigation/
│       │   └── services/
│       ├── android/
│       ├── ios/
│       ├── app.json
│       └── package.json
│
├── packages/
│   ├── ui/                  # Shared UI components
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── CooperativeCard.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── database/            # Supabase integration
│   │   ├── types/
│   │   │   ├── cooperative.ts
│   │   │   ├── member.ts
│   │   │   ├── farm.ts
│   │   │   └── index.ts
│   │   ├── queries/
│   │   │   ├── cooperatives.ts
│   │   │   ├── members.ts
│   │   │   └── farms.ts
│   │   ├── supabase.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── auth/                # Authentication
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useUser.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── utils/               # Shared utilities
│       ├── format.ts
│       ├── validation.ts
│       ├── constants.ts
│       ├── package.json
│       └── tsconfig.json
│
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
├── tsconfig.json            # Root TypeScript config
└── .env.example             # Environment variables template
```

### Step 3: Configure Turborepo

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^test"],
      "outputs": ["coverage/**"]
    },
    "type-check": {
      "dependsOn": ["^type-check"]
    }
  }
}
```

### Step 4: Root package.json Scripts

```json
{
  "name": "agrosoluce-monorepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:dashboard": "turbo run dev --filter=dashboard",
    "dev:mobile": "turbo run dev --filter=mobile",
    
    "build": "turbo run build",
    "build:web": "turbo run build --filter=web",
    "build:dashboard": "turbo run build --filter=dashboard",
    
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check",
    
    "clean": "turbo run clean && rm -rf node_modules"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.3.0",
    "prettier": "^3.1.0",
    "eslint": "^8.55.0"
  }
}
```

---

## 📱 CURSOR AI WORKFLOW

### Setting Up Cursor

**1. Install Cursor:**
```bash
# Download from: https://cursor.sh
# Or: brew install --cask cursor
```

**2. Open Monorepo:**
```bash
cursor agrosoluce/
```

**3. Configure Cursor:**
- **Settings → Features → Enable Composer**: ✅
- **Settings → AI → Model**: GPT-4 or Claude 3.5 Sonnet
- **Settings → Editor → Format on Save**: ✅

### Using Cursor for Development

#### 1. **Generate Components with AI**

**Prompt in Cursor:**
```
Create a CooperativeCard component in packages/ui/components/
that displays:
- Cooperative name
- Member count
- Region
- Certifications (EUDR, Organic, Fair Trade badges)
- "View Profile" button

Use Tailwind CSS for styling.
Match the design from /docs/public-website-spec.md section "Directory Page"
```

**Cursor generates:**
```typescript
// packages/ui/components/CooperativeCard.tsx
import React from 'react';

interface CooperativeCardProps {
  name: string;
  memberCount: number;
  region: string;
  certifications: {
    eudr: boolean;
    organic: boolean;
    fairTrade: boolean;
  };
  onViewProfile: () => void;
}

export function CooperativeCard({ 
  name, 
  memberCount, 
  region, 
  certifications,
  onViewProfile 
}: CooperativeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="text-gray-600 space-y-1">
        <p>📍 {region}</p>
        <p>👥 {memberCount.toLocaleString()} members</p>
      </div>
      
      <div className="flex gap-2 mt-4">
        {certifications.eudr && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
            EUDR ✓
          </span>
        )}
        {certifications.organic && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            Organic ✓
          </span>
        )}
        {certifications.fairTrade && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
            Fair Trade ✓
          </span>
        )}
      </div>
      
      <button
        onClick={onViewProfile}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        View Profile
      </button>
    </div>
  );
}
```

#### 2. **Fix Bugs with AI**

**Highlight broken code, then:**
```
CMD+K (Mac) or CTRL+K (Windows)
Type: "Fix TypeScript error - memberCount can be undefined"
```

**Cursor fixes:**
```typescript
export function CooperativeCard({ 
  name, 
  memberCount = 0,  // ← AI adds default value
  region, 
  certifications,
  onViewProfile 
}: CooperativeCardProps) {
  // ...
}
```

#### 3. **Refactor with AI**

**Select component, CMD+K:**
```
Extract the certification badges into a separate 
CertificationBadges component in the same file
```

#### 4. **Generate Database Queries**

**Prompt:**
```
In packages/database/queries/cooperatives.ts, 
create a function to fetch cooperatives with filters:
- region (optional)
- certifications (optional array)
- search term (optional)

Use Supabase client from ../supabase.ts
Return type should use Cooperative type from ../types/cooperative.ts
```

**Cursor generates:**
```typescript
// packages/database/queries/cooperatives.ts
import { supabase } from '../supabase';
import type { Cooperative } from '../types/cooperative';

interface FetchCooperativesOptions {
  region?: string;
  certifications?: string[];
  searchTerm?: string;
}

export async function fetchCooperatives(
  options: FetchCooperativesOptions = {}
): Promise<Cooperative[]> {
  let query = supabase
    .from('cooperatives')
    .select('*')
    .eq('verification_status', 'verified');

  if (options.region) {
    query = query.eq('region', options.region);
  }

  if (options.searchTerm) {
    query = query.ilike('name', `%${options.searchTerm}%`);
  }

  // Note: Certification filtering requires JSONB query
  if (options.certifications?.length) {
    // Cursor will generate the correct JSONB syntax
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}
```

---

## 🔧 SETUP STEPS IN CURSOR

### Week 1: Monorepo Foundation

**Day 1: Initialize**
```bash
# In Cursor terminal
npx create-turbo@latest agrosoluce
cd agrosoluce

# Install dependencies
npm install

# Add Supabase
npm install @supabase/supabase-js --workspace=packages/database

# Add UI dependencies
npm install tailwindcss @tailwindcss/forms --workspace=packages/ui
```

**Day 2: Shared Packages Setup**

**Use Cursor AI:**
```
Create packages/database/supabase.ts with:
- Supabase client initialization
- Environment variables for SUPABASE_URL and SUPABASE_ANON_KEY
- Export typed client
```

**Day 3: UI Components Library**

**Cursor prompt:**
```
Set up packages/ui with:
- Tailwind CSS configuration
- Base components: Button, Input, Card
- CooperativeCard component from spec
- Export all components in index.ts
```

**Day 4: Type Definitions**

**Cursor prompt:**
```
In packages/database/types/, create TypeScript interfaces for:
- Cooperative (from database schema in spec)
- Member (from database schema)
- Farm (from database schema)

Match the Supabase PostgreSQL schema exactly.
```

**Day 5: Testing & Documentation**
```
Add README.md to each package explaining:
- What it does
- How to use it
- Example code
```

---

### Week 2: Website Development

**In Cursor:**
```bash
# Terminal
cd apps/web
npm run dev
```

**Cursor prompts for homepage:**
```
1. "Create app/page.tsx with hero section from 
   /docs/public-website-spec.md - Homepage Design"

2. "Add problem statement section below hero"

3. "Add solution features section with icons"

4. "Create components/Hero.tsx for the hero section"
```

**For Directory Page:**
```
1. "Create app/directory/page.tsx with:
   - Search bar
   - Filter dropdowns (region, certifications)
   - Grid of CooperativeCard components
   - Use fetchCooperatives from @agrosoluce/database"

2. "Create app/directory/[id]/page.tsx for 
   cooperative profile pages"
```

---

### Week 3-4: Dashboard Development

**Cursor prompts:**
```
1. "Create apps/dashboard with Next.js 14 App Router
   - (auth) route group for login
   - (dashboard) route group for protected pages
   - Use @agrosoluce/auth for authentication"

2. "Create dashboard layout with sidebar navigation:
   - Dashboard
   - Members
   - Farms
   - Compliance
   - Financial
   - Reports"

3. "Create app/(dashboard)/members/page.tsx with:
   - Member list table
   - Search & filter
   - Pagination
   - Use @agrosoluce/database for queries"
```

---

## 🗂️ GITHUB SETUP

### Repository Structure

**Monorepo: Single GitHub Repo**
```
Repository: facely-camara/agrosoluce
├── main (production)
├── develop (development)
└── feature/* (feature branches)
```

### GitHub Setup Steps

**1. Create Repository:**
```bash
# In Cursor terminal
git init
git add .
git commit -m "Initial commit: AgroSoluce monorepo"

# Create repo on GitHub
# Then:
git remote add origin https://github.com/facely-camara/agrosoluce.git
git push -u origin main
```

**2. Branch Strategy:**
```bash
# Development branch
git checkout -b develop
git push -u origin develop

# Feature branches
git checkout -b feature/web-homepage
git checkout -b feature/dashboard-members
git checkout -b feature/mobile-gps
```

**3. Protect Branches:**
```
GitHub → Settings → Branches → Branch protection rules
- Protect main: require pull request reviews
- Protect develop: require status checks to pass
```

### CI/CD with GitHub Actions

**.github/workflows/web.yml:**
```yaml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'apps/web/**'
      - 'packages/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build:web
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
```

---

## 📋 DATA INTEGRITY RULES

### CRITICAL: No False Claims

**In Cursor, create this checklist file:**

**.github/CONTENT_CHECKLIST.md:**
```markdown
# Content Verification Checklist

Before committing ANY content with data claims:

## ✅ Verified Data Only
- [ ] Cooperative names used WITH written permission
- [ ] Testimonials have signed approval documents
- [ ] Revenue figures are from audited sources
- [ ] Member counts are verified from records
- [ ] Certification statuses are from actual certificates

## ❌ Never Claim Without Proof
- [ ] NO revenue increases without documentation
- [ ] NO productivity gains without measurement
- [ ] NO testimonials without written consent
- [ ] NO cooperative data without permission
- [ ] NO "X children in school" without verification

## 📊 Use Market Data Instead
- [ ] EUDR market value: cite EU regulation documents
- [ ] Premium pricing: cite industry reports
- [ ] Cooperative count: cite official directories
- [ ] Market size: cite government statistics

## 🎯 Acceptable Claims
✅ "3,797 cooperatives in directory" (verified public data)
✅ "EUDR requires GPS verification" (regulatory fact)
✅ "Platform development complete" (when true)
✅ "Year 1 FREE program" (your actual offer)

❌ "Cooperative X earned €2.78M" (unless you have proof)
❌ "98% EUDR compliance" (unless measured)
❌ "4 days → 4 hours" (unless timed)
```

### Implementation in Code

**packages/utils/content-guard.ts:**
```typescript
/**
 * Content verification utility
 * Use this to flag any unverified claims before deployment
 */

export interface ContentClaim {
  type: 'revenue' | 'testimonial' | 'metric' | 'case-study';
  claim: string;
  verified: boolean;
  source?: string;
  approvalDate?: Date;
}

export function verifyContent(claim: ContentClaim): boolean {
  if (!claim.verified) {
    console.error(`
      ⚠️  UNVERIFIED CLAIM DETECTED
      Type: ${claim.type}
      Claim: ${claim.claim}
      
      This content cannot be published without verification.
      Add source documentation or remove the claim.
    `);
    return false;
  }
  
  if (claim.type === 'testimonial' && !claim.approvalDate) {
    console.error('Testimonials require written approval with date');
    return false;
  }
  
  return true;
}

// Example usage in components
export const VERIFIED_STATS = {
  cooperativesInDirectory: {
    value: 3797,
    verified: true,
    source: 'Official Côte d\'Ivoire cooperative registry',
    lastUpdated: new Date('2024-11-28')
  },
  eudrDeadline: {
    value: 'December 2024',
    verified: true,
    source: 'EU Regulation 2023/1115'
  }
} as const;
```

---

## 🚀 DEVELOPMENT TIMELINE WITH CURSOR

### Phase 1: Monorepo Setup (Week 1)
- **Day 1:** Initialize Turborepo
- **Day 2:** Shared packages setup
- **Day 3:** UI components library
- **Day 4:** Database types & queries
- **Day 5:** Testing & documentation

### Phase 2: Public Website (Weeks 2-3)
- **Week 2:** Homepage, directory, toolkit pages
- **Week 3:** Polish, SEO, deployment

### Phase 3: Dashboard MVP (Weeks 4-7)
- **Week 4:** Auth & layout
- **Week 5:** Member management
- **Week 6:** Financial module
- **Week 7:** Testing & deployment

### Phase 4: Mobile App (Weeks 8-10)
- **Week 8:** Setup & navigation
- **Week 9:** GPS mapping
- **Week 10:** Offline sync

---

## ✅ FINAL RECOMMENDATION

**USE MONOREPO (TURBOREPO) BECAUSE:**

1. ✅ You're solo (initially) - easier to manage one repo
2. ✅ Massive code sharing - database types, UI components
3. ✅ Cursor AI works great with monorepos
4. ✅ Faster development - change once, update everywhere
5. ✅ Consistent tooling - one ESLint, one Prettier config
6. ✅ Easy refactoring - AI can update multiple packages
7. ✅ Professional setup - scalable as team grows

**AVOID FALSE CLAIMS BY:**

1. ✅ Use content verification checklist
2. ✅ Only cite verified public data
3. ✅ Mark all unverified content as "Projected" or "Estimated"
4. ✅ Get written permission before using cooperative names
5. ✅ Use "Coming Soon" for success stories until real
6. ✅ Focus on regulatory facts (EUDR requirements) not results

---

## 🎯 START HERE

**Your First Commands:**
```bash
# 1. Install Cursor
# Download from: https://cursor.sh

# 2. Create monorepo
npx create-turbo@latest agrosoluce

# 3. Open in Cursor
cursor agrosoluce/

# 4. Start building!
npm run dev
```

**First Cursor Prompt:**
```
Set up a Turborepo monorepo for AgroSoluce with:
- apps/web (Next.js public website)
- apps/dashboard (Next.js cooperative dashboard)
- apps/mobile (React Native mobile app)
- packages/ui (shared components)
- packages/database (Supabase integration)
- packages/auth (authentication)

Use TypeScript and Tailwind CSS.
```

**You're ready to build! 🚀**

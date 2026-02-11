# AgroSoluce Assessment Module - Directory Structure & Positioning

## 🏗️ **RECOMMENDED DIRECTORY STRUCTURE**

Based on ERMITS project patterns and integrated architecture strategy:

### **Option 1: Integrated Module Structure (BEST)**

```
agrosoluce-platform/
├── src/
│   ├── modules/
│   │   ├── assessment/              👈 NEW ASSESSMENT MODULE
│   │   │   ├── components/
│   │   │   │   ├── AssessmentFlow.tsx
│   │   │   │   ├── ProgressTracker.tsx
│   │   │   │   ├── QuestionCard.tsx
│   │   │   │   ├── ResultsDashboard.tsx
│   │   │   │   └── ScoreCircle.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useAssessment.ts
│   │   │   │   ├── useScoring.ts
│   │   │   │   └── useRecommendations.ts
│   │   │   ├── types/
│   │   │   │   ├── assessment.types.ts
│   │   │   │   ├── scoring.types.ts
│   │   │   │   └── recommendations.types.ts
│   │   │   ├── data/
│   │   │   │   ├── assessmentSections.ts
│   │   │   │   ├── scoringWeights.ts
│   │   │   │   └── recommendationEngine.ts
│   │   │   ├── services/
│   │   │   │   ├── assessmentApi.ts
│   │   │   │   ├── scoreCalculation.ts
│   │   │   │   └── resultsService.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── marketplace/             (existing)
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   ├── compliance/              (planned)
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── types/
│   │   │
│   │   └── child-protection/        (planned)
│   │       ├── components/
│   │       ├── services/
│   │       └── types/
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/                  (shared UI components)
│   │   │   ├── layout/
│   │   │   └── forms/
│   │   ├── hooks/
│   │   │   ├── useSupabase.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useStorage.ts
│   │   ├── types/
│   │   │   ├── database.types.ts
│   │   │   ├── common.types.ts
│   │   │   └── api.types.ts
│   │   ├── utils/
│   │   │   ├── storage.ts
│   │   │   ├── validation.ts
│   │   │   └── constants.ts
│   │   └── services/
│   │       ├── supabase.ts
│   │       ├── auth.ts
│   │       └── api.ts
│   │
│   ├── pages/
│   │   ├── assessment/
│   │   │   ├── index.tsx
│   │   │   ├── results.tsx
│   │   │   └── history.tsx
│   │   ├── marketplace/
│   │   ├── dashboard/
│   │   └── profile/
│   │
│   ├── layouts/
│   │   ├── AppLayout.tsx
│   │   ├── AssessmentLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── assessment.css
│   │   └── components.css
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── voices/                  (for voice guidance)
│   │
│   ├── config/
│   │   ├── database.ts
│   │   ├── constants.ts
│   │   └── environment.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── icons/
│
├── tests/
│   ├── assessment/
│   │   ├── scoring.test.ts
│   │   ├── recommendations.test.ts
│   │   └── components.test.tsx
│   └── setup.ts
│
├── docs/
│   ├── assessment-api.md
│   ├── scoring-algorithm.md
│   └── deployment.md
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── supabase.config.ts
└── README.md
```

---

## 📍 **KEY POSITIONING DECISIONS**

### **1. Assessment as Core Module**
```typescript
// src/modules/assessment/index.ts
export { default as AssessmentFlow } from './components/AssessmentFlow';
export { default as ResultsDashboard } from './components/ResultsDashboard';
export { useAssessment } from './hooks/useAssessment';
export { assessmentSections } from './data/assessmentSections';
export type { AssessmentResponse, AssessmentResults } from './types';
```

**Why This Position:**
- ✅ **Foundational placement** - assessment is the entry point to AgroSoluce
- ✅ **Clear module boundaries** - easy to find and maintain
- ✅ **Shared infrastructure** - uses common auth, database, and UI
- ✅ **Integration ready** - can easily import into other modules

### **2. Shared Infrastructure Strategy**
```typescript
// Assessment uses shared services
import { supabaseClient } from '@/shared/services/supabase';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button, Card } from '@/shared/components/ui';

// Other modules can import assessment types
import type { AssessmentResults } from '@/modules/assessment/types';
```

### **3. Page-Level Integration**
```typescript
// src/pages/assessment/index.tsx
import { AssessmentFlow } from '@/modules/assessment';
import { AppLayout } from '@/layouts/AppLayout';

export default function AssessmentPage() {
  return (
    <AppLayout>
      <AssessmentFlow />
    </AppLayout>
  );
}
```

---

## 🔄 **ROUTING & NAVIGATION STRUCTURE**

### **URL Structure**
```markdown
agrosoluce.com/
├── /                          # Landing page
├── /assessment                # Assessment entry point
├── /assessment/results        # Results display
├── /assessment/history        # Past assessments
├── /dashboard                 # Main cooperative dashboard
├── /marketplace               # Product listings
├── /compliance                # Certification management
└── /profile                   # User profile
```

### **Navigation Component Integration**
```typescript
// src/shared/components/layout/Navigation.tsx
const navigationItems = [
  { href: '/assessment', label: 'Farm Assessment', icon: CheckSquare },
  { href: '/marketplace', label: 'Marketplace', icon: Store },
  { href: '/compliance', label: 'Compliance', icon: Shield },
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 }
];
```

---

## 📁 **ALTERNATIVE STRUCTURES (LESS RECOMMENDED)**

### **Option 2: Feature-First Structure**
```
agrosoluce-platform/
├── src/
│   ├── features/
│   │   ├── assessment/          # Same structure as modules
│   │   ├── marketplace/
│   │   └── compliance/
```
**Use Case:** If you prefer "features" terminology over "modules"

### **Option 3: Page-Centric Structure**
```
agrosoluce-platform/
├── src/
│   ├── pages/
│   │   ├── assessment/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── services/
```
**Use Case:** Simple projects with tight coupling between pages and logic

---

## 🎯 **IMPLEMENTATION STRATEGY**

### **Phase 1: Foundation Setup**
```bash
# Create assessment module structure
mkdir -p src/modules/assessment/{components,hooks,types,data,services}

# Create shared infrastructure  
mkdir -p src/shared/{components/ui,hooks,types,services,utils}

# Create page integration
mkdir -p src/pages/assessment
```

### **Phase 2: Component Migration**
```typescript
// Convert HTML assessment to React components in:
// src/modules/assessment/components/

// AssessmentFlow.tsx - Main component
// ProgressTracker.tsx - Progress bar
// QuestionCard.tsx - Individual questions
// ResultsDashboard.tsx - Results display
```

### **Phase 3: Integration Points**
```typescript
// Marketplace integration
import type { AssessmentResults } from '@/modules/assessment/types';

// Toolkit recommendations
import { generateToolkitRecommendations } from '@/modules/assessment/services';

// Child protection integration
import { getChildProtectionScore } from '@/modules/assessment/data';
```

---

## 📊 **DATABASE INTEGRATION POSITIONING**

### **Supabase Schema Location**
```sql
-- migrations/001_assessment_tables.sql
CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cooperative_id uuid REFERENCES cooperatives(id),
  assessment_data jsonb NOT NULL,
  scores jsonb NOT NULL,
  recommendations jsonb NOT NULL,
  completed_at timestamp DEFAULT now(),
  created_at timestamp DEFAULT now()
);

CREATE TABLE assessment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id),
  question_id text NOT NULL,
  response_data jsonb NOT NULL,
  score integer NOT NULL,
  created_at timestamp DEFAULT now()
);
```

### **Types Generation**
```typescript
// src/shared/types/database.types.ts - Generated from Supabase
export interface Assessment {
  id: string;
  cooperative_id: string;
  assessment_data: AssessmentData;
  scores: AssessmentScores;
  recommendations: Recommendation[];
  completed_at: string;
  created_at: string;
}
```

---

## 🚀 **DEPLOYMENT CONSIDERATIONS**

### **Build Configuration**
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assessment': path.resolve(__dirname, './src/modules/assessment'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'assessment': ['./src/modules/assessment/index.ts'],
          'shared': ['./src/shared/index.ts'],
        },
      },
    },
  },
});
```

### **Environment Setup**
```typescript
// src/config/environment.ts
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  assessment: {
    maxSections: 5,
    passingScore: 60,
    saveInterval: 30000, // 30 seconds
  },
};
```

---

## ✅ **RECOMMENDED ACTION PLAN**

### **Step 1: Setup Directory Structure**
```bash
# Use Option 1 structure (modules-based)
# Create assessment module with proper separation
# Setup shared infrastructure for reuse
```

### **Step 2: Convert HTML to React**
```bash
# Take working HTML assessment
# Split into React components following the structure
# Add TypeScript types and proper state management
```

### **Step 3: Database Integration**
```bash
# Create Supabase tables for assessment data
# Add authentication and Row Level Security
# Connect assessment flow to database persistence
```

### **Step 4: Module Integration**
```bash
# Connect assessment to marketplace module
# Add navigation between assessment and other features  
# Create shared component library
```

This directory structure gives you the best foundation for the integrated AgroSoluce platform while maintaining clear separation of concerns and enabling future expansion.

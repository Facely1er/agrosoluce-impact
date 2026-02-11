# 🎯 CURSOR AI - Child Labor Monitoring Implementation Checklist
## Step-by-Step Prompts for Cursor Composer

**Repository:** AgroSoluceMarket-by-ERMITS  
**Total Time:** 2-4 hours  
**Difficulty:** Easy (copy/paste prompts)

---

## 📋 PHASE 1: DATABASE SETUP (30 minutes)

### ✅ TODO 1.1: Deploy Database Schema

**Where:** Supabase Dashboard > SQL Editor

**Manual Step (Not in Cursor):**
1. Open https://app.supabase.com
2. Select your AgroSoluce project
3. Go to "SQL Editor"
4. Click "New Query"
5. Copy entire contents of `child-labor-monitoring-schema.sql`
6. Paste into SQL Editor
7. Click "Run" (or press Ctrl/Cmd + Enter)
8. Wait for success message: "Success. No rows returned"

**Verify:**
```sql
-- Run this to verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'child_labor%'
ORDER BY table_name;
```

**Expected Result:** Should see 5 tables:
- child_labor_assessments
- child_labor_incidents
- labor_certifications
- remediation_actions
- social_impact_metrics

---

### ✅ TODO 1.2: Add Sample Data (Optional for Testing)

**Where:** Supabase Dashboard > SQL Editor

**Cursor Prompt:**
```
Generate sample data INSERT statements for the child_labor_assessments table 
for 10 cooperatives. Use these cooperative IDs from our existing cooperatives 
table. Make the data realistic for Côte d'Ivoire cocoa cooperatives:

- 5 cooperatives with excellent compliance (90-100 score, 0 violations)
- 3 cooperatives with good compliance (75-89 score, 1-2 minor violations)
- 2 cooperatives with fair compliance (60-74 score, 3-5 violations)

Include:
- Realistic school enrollment data (total children: 100-200, enrollment: 85-98%)
- Assessment dates in last 6 months
- Assessor names (mix of ILO inspectors, Fair Trade auditors, NGO workers)
- Next assessment dates 6 months from assessment date

Also generate corresponding social_impact_metrics for the same cooperatives 
showing positive trends.
```

**Then:** Run the generated SQL in Supabase SQL Editor

---

## 📋 PHASE 2: ADD TYPES & INTERFACES (10 minutes)

### ✅ TODO 2.1: Add TypeScript Types to Project

**Where:** Cursor Editor

**Cursor Prompt:**
```
Copy the file child-labor-monitoring-types.ts to src/types/ in my project.

If src/types/ doesn't exist, create it first.

Then update src/types/index.ts (or create it) to export all types from 
child-labor-monitoring-types.ts so they can be imported easily throughout 
the project like:

import { ChildLaborAssessment, ComplianceRating } from '@/types';
```

**Verify:**
```bash
# Should see the file
ls -la src/types/child-labor-monitoring-types.ts
```

---

### ✅ TODO 2.2: Update tsconfig.json Path Aliases

**Where:** Cursor Editor - `tsconfig.json`

**Cursor Prompt:**
```
Update my tsconfig.json to include proper path aliases so I can import types 
cleanly. Add:

"paths": {
  "@/*": ["./src/*"],
  "@/types": ["./src/types"],
  "@/components": ["./src/components"],
  "@/services": ["./src/services"]
}

Make sure this is in the compilerOptions section.
```

---

## 📋 PHASE 3: CREATE SUPABASE SERVICE (20 minutes)

### ✅ TODO 3.1: Create Service Directory

**Where:** Cursor Terminal

**Cursor Prompt:**
```
Create the following directory structure if it doesn't exist:

src/
  services/
    childLaborService.ts

Use mkdir -p to create the directories.
```

---

### ✅ TODO 3.2: Create Child Labor Service

**Where:** Cursor Editor - Create new file

**Cursor Prompt:**
```
Create a new file: src/services/childLaborService.ts

Copy the complete ChildLaborService class from the 
CHILD_LABOR_MONITORING_COMPLETE_PACKAGE.md file (section "File 1: Supabase Service").

Make sure to:
1. Import the Supabase client from '@/lib/supabaseClient'
2. Import all necessary types from '@/types/child-labor-monitoring-types'
3. Include all methods:
   - Assessment CRUD (create, get, update, search)
   - Remediation actions
   - Certifications
   - Social impact metrics
   - Compliance status views
   - Analytics functions

This should be approximately 400 lines of code.
```

---

### ✅ TODO 3.3: Verify Supabase Client Exists

**Where:** Cursor Editor

**Cursor Prompt:**
```
Check if src/lib/supabaseClient.ts exists and exports a configured Supabase 
client. If not, create it with:

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

Also verify that .env.local has these variables set.
```

---

## 📋 PHASE 4: ADD DASHBOARD COMPONENT (30 minutes)

### ✅ TODO 4.1: Create Component Directory

**Where:** Cursor Terminal

**Cursor Prompt:**
```
Create the directory structure:

src/
  components/
    compliance/
      ChildLaborDashboard.tsx
      index.ts

Use mkdir -p to create directories.
```

---

### ✅ TODO 4.2: Copy Dashboard Component

**Where:** Cursor Editor

**Cursor Prompt:**
```
Copy the complete ChildLaborDashboard.tsx component to 
src/components/compliance/ChildLaborDashboard.tsx

Ensure all imports are correct:
- React imports
- Type imports from '@/types/child-labor-monitoring-types'
- Supabase client from '@/lib/supabaseClient'
- Recharts components (BarChart, PieChart, etc.)

If recharts is not installed, add it to package.json dependencies.
```

---

### ✅ TODO 4.3: Install Required Dependencies

**Where:** Cursor Terminal

**Cursor Prompt:**
```
Check if these packages are in package.json, if not, install them:

npm install recharts
npm install @supabase/supabase-js

Also verify we have:
- react-router-dom (for navigation)
- tailwindcss (for styling)

Run npm install to ensure everything is installed.
```

---

### ✅ TODO 4.4: Create Component Index File

**Where:** Cursor Editor - `src/components/compliance/index.ts`

**Cursor Prompt:**
```
Create src/components/compliance/index.ts with:

export { default as ChildLaborDashboard } from './ChildLaborDashboard';

This allows cleaner imports like:
import { ChildLaborDashboard } from '@/components/compliance';
```

---

## 📋 PHASE 5: ADD ROUTING (15 minutes)

### ✅ TODO 5.1: Update App Router

**Where:** Cursor Editor - `src/App.tsx`

**Cursor Prompt:**
```
Update my App.tsx to add a new route for the Child Labor Compliance Dashboard.

Add this route:
- Path: /compliance/child-labor
- Component: ChildLaborDashboard
- Should be a protected route (requires authentication)

Import the component from '@/components/compliance'.

If using React Router v6, the route should look like:
<Route path="/compliance/child-labor" element={<ChildLaborDashboard />} />

Place it logically with other dashboard/admin routes.
```

---

### ✅ TODO 5.2: Add Navigation Link

**Where:** Cursor Editor - Your main navigation component

**Cursor Prompt:**
```
Add a navigation link to the Child Labor Compliance Dashboard in my main 
navigation menu.

The link should:
- Text: "Child Labor Compliance" or "Compliance Dashboard"
- Icon: 👨‍👩‍👧‍👦 (family emoji) or use a child/family icon from your icon library
- Path: /compliance/child-labor
- Be accessible to authenticated users only
- Highlight when active (using NavLink activeClassName or similar)

Add it in a logical place, perhaps under "Cooperatives" or create a new 
"Compliance" section in the nav.
```

---

### ✅ TODO 5.3: Add Dashboard Link to Cooperative Pages

**Where:** Cursor Editor - Cooperative detail/card components

**Cursor Prompt:**
```
Find my cooperative card or cooperative detail page component and add a 
"View Compliance" button or link that navigates to:
/compliance/child-labor?cooperativeId={cooperative.id}

This allows users to view compliance details for a specific cooperative.

The button should be styled consistently with other action buttons in the UI.
```

---

## 📋 PHASE 6: ADD COMPLIANCE BADGE TO COOPERATIVES (20 minutes)

### ✅ TODO 6.1: Create Compliance Badge Component

**Where:** Cursor Editor - Create new file

**Cursor Prompt:**
```
Create a new component: src/components/cooperatives/ComplianceBadge.tsx

This component should:
1. Accept a cooperativeId prop
2. Fetch the latest compliance status using ChildLaborService.getComplianceStatus()
3. Display a badge showing:
   - "✓ Child Labor-Free" (green) if compliance score >= 90
   - "Good Compliance" (blue) if score 75-89
   - "Fair Compliance" (yellow) if score 60-74
   - "Needs Improvement" (red) if score < 60
   - Loading state while fetching
   - Error state if fetch fails

Use Tailwind CSS for styling.
Include the compliance score as a tooltip.

Example:
<ComplianceBadge cooperativeId="abc-123" />
```

---

### ✅ TODO 6.2: Add Badge to Cooperative Cards

**Where:** Cursor Editor - Your cooperative card component

**Cursor Prompt:**
```
Update my CooperativeCard component to include the ComplianceBadge.

Add the badge:
- Below the cooperative name
- Or in a badges section with other certifications
- Make it prominent but not overwhelming

Import ComplianceBadge from '@/components/cooperatives/ComplianceBadge'

The card should show:
- Cooperative name
- Region/Department
- Product type
- ComplianceBadge ← NEW
- Other existing content
```

---

### ✅ TODO 6.3: Add to Marketplace Filters

**Where:** Cursor Editor - Marketplace filter component

**Cursor Prompt:**
```
Update my marketplace search/filter component to add a filter for 
"Child Labor-Free Cooperatives".

Add a checkbox filter:
- Label: "Show only child labor-free cooperatives"
- When checked, filter cooperatives where compliance score >= 90
- This requires fetching compliance data and filtering the results

Update the filter state and the query logic to support this filter.
```

---

## 📋 PHASE 7: CREATE ASSESSMENT FORM (45 minutes)

### ✅ TODO 7.1: Create Form Component

**Where:** Cursor Editor - Create new file

**Cursor Prompt:**
```
Create a new component: src/components/compliance/AssessmentForm.tsx

This should be a comprehensive form for creating a child labor assessment with 
these sections:

1. Basic Information
   - Cooperative (dropdown/select)
   - Assessment Period (start and end dates)
   - Assessor Name (text input)
   - Assessor Organization (text input)

2. School Enrollment Data
   - Total Children in Community (number input)
   - Children Enrolled in School (number input)
   - Auto-calculated enrollment rate (display only)

3. Labor Verification
   - Minimum Working Age (number, default 16)
   - Total Workers Assessed (number)
   - Underage Workers Found (number)
   - Age Verification Method (select dropdown)

4. Violations
   - Child Labor Violations (number)
   - Hazardous Work Violations (number)
   - Worst Forms Violations (number)
   - Violation Details (textarea)

5. Evidence
   - File upload for documents
   - Photo upload
   - Witness statements (repeatable fields)

6. Actions
   - Save Draft button
   - Submit Assessment button
   - Cancel button

Include:
- Form validation using react-hook-form or similar
- Real-time compliance score calculation
- Loading states
- Error handling
- Success toast/notification

Use Tailwind CSS for styling.
```

---

### ✅ TODO 7.2: Add Form Route

**Where:** Cursor Editor - `src/App.tsx`

**Cursor Prompt:**
```
Add routes for the assessment form:

1. Create new assessment:
   Path: /compliance/assessments/new
   Component: AssessmentForm
   
2. Edit existing assessment:
   Path: /compliance/assessments/:id/edit
   Component: AssessmentForm (with id param to load existing data)

Import AssessmentForm from '@/components/compliance'.
```

---

### ✅ TODO 7.3: Add "New Assessment" Button

**Where:** Cursor Editor - ChildLaborDashboard.tsx

**Cursor Prompt:**
```
Update the ChildLaborDashboard component to add a "Create New Assessment" 
button in the header.

The button should:
- Be styled as a primary action button
- Icon: ➕ or similar
- Text: "New Assessment"
- Navigate to: /compliance/assessments/new
- Be positioned in the top-right of the dashboard header

Use react-router-dom's useNavigate for navigation.
```

---

## 📋 PHASE 8: ADD FILE UPLOAD (30 minutes)

### ✅ TODO 8.1: Configure Supabase Storage

**Where:** Supabase Dashboard > Storage

**Manual Step:**
1. Go to Supabase Dashboard > Storage
2. Create new bucket: "child-labor-evidence"
3. Set policies:
   - Authenticated users can upload
   - Authenticated users can read
   - Files are private by default

**Then in Cursor:**

**Cursor Prompt:**
```
Create a utility service: src/services/fileUploadService.ts

This service should handle file uploads to Supabase Storage with:

1. uploadEvidence(file: File, assessmentId: string): Promise<string>
   - Upload file to 'child-labor-evidence' bucket
   - Store in path: assessments/{assessmentId}/{filename}
   - Return public URL

2. uploadPhoto(file: File, assessmentId: string): Promise<string>
   - Upload image file
   - Store in path: assessments/{assessmentId}/photos/{filename}
   - Return public URL

3. deleteFile(url: string): Promise<void>
   - Delete file from storage

Include:
- File size validation (max 10MB)
- File type validation (documents: pdf, docx; photos: jpg, png)
- Error handling
- Progress tracking (optional)

Use the Supabase client from '@/lib/supabaseClient'.
```

---

### ✅ TODO 8.2: Create File Upload Component

**Where:** Cursor Editor - Create new file

**Cursor Prompt:**
```
Create a reusable file upload component: 
src/components/common/FileUpload.tsx

Props:
- acceptedFileTypes: string[] (e.g., ['.pdf', '.docx', '.jpg'])
- maxSizeMB: number
- multiple: boolean
- onUploadComplete: (urls: string[]) => void
- label: string

Features:
- Drag & drop zone
- File validation
- Upload progress indicator
- Preview for images
- Remove uploaded file option
- Error messages

Use Tailwind CSS for styling.
Integrate with fileUploadService.
```

---

## 📋 PHASE 9: TESTING & POLISH (30 minutes)

### ✅ TODO 9.1: Test Dashboard Loading

**Where:** Browser

**Manual Steps:**
1. Run `npm run dev`
2. Navigate to http://localhost:5173/compliance/child-labor
3. Verify dashboard loads without errors
4. Check browser console for errors
5. Verify sample data displays correctly

**If errors appear, use Cursor:**

**Cursor Prompt:**
```
I'm getting this error when loading the Child Labor Dashboard:
[paste error message]

Help me debug and fix it. Check:
1. Import statements
2. Supabase client configuration
3. TypeScript type mismatches
4. Missing dependencies
```

---

### ✅ TODO 9.2: Test Creating Assessment

**Where:** Browser

**Manual Steps:**
1. Click "New Assessment" button
2. Fill out form with test data
3. Submit form
4. Verify assessment appears in dashboard
5. Check data in Supabase Table Editor

**If errors:**

**Cursor Prompt:**
```
My assessment form is not submitting correctly. Error: [paste error]

Check:
1. Form validation
2. API call to ChildLaborService
3. Data transformation
4. Error handling
5. Success feedback
```

---

### ✅ TODO 9.3: Add Loading Skeletons

**Where:** Cursor Editor

**Cursor Prompt:**
```
Improve the ChildLaborDashboard loading state by adding skeleton loaders 
instead of just a spinner.

Create skeleton components for:
- Metric cards (4 cards)
- Charts (2 chart areas)
- Table rows (5-10 rows)

Use Tailwind CSS animate-pulse class.

Replace the current loading div with these skeletons.
```

---

### ✅ TODO 9.4: Add Error Boundaries

**Where:** Cursor Editor

**Cursor Prompt:**
```
Create an error boundary component: src/components/common/ErrorBoundary.tsx

This should:
1. Catch React errors in child components
2. Display a friendly error message
3. Provide a "Try Again" button
4. Log errors to console (or error tracking service)

Then wrap the ChildLaborDashboard route with this ErrorBoundary.
```

---

### ✅ TODO 9.5: Mobile Responsive Check

**Where:** Browser Dev Tools

**Manual Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl/Cmd + Shift + M)
3. Test on different screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)

**If layout issues:**

**Cursor Prompt:**
```
The Child Labor Dashboard is not responsive on mobile devices. 

Issues:
- [describe layout problems]

Fix the responsive design using Tailwind's responsive prefixes (sm:, md:, lg:).

Ensure:
- Metrics cards stack on mobile
- Charts scale properly
- Table is scrollable horizontally on mobile
- Navigation works on small screens
```

---

## 📋 PHASE 10: DOCUMENTATION & HANDOFF (20 minutes)

### ✅ TODO 10.1: Update README

**Where:** Cursor Editor - `README.md`

**Cursor Prompt:**
```
Update the project README.md to include a new section about the Child Labor 
Compliance Module.

Add:

## 👨‍👩‍👧‍👦 Child Labor Compliance Module

AgroSoluce includes comprehensive child labor monitoring and compliance tracking.

### Features
- Real-time compliance scoring
- Assessment creation and management
- Remediation action tracking
- Fair Trade & Rainforest Alliance certification management
- Social impact metrics dashboard

### Routes
- `/compliance/child-labor` - Main dashboard
- `/compliance/assessments/new` - Create assessment
- `/compliance/assessments/:id/edit` - Edit assessment

### Key Components
- `ChildLaborDashboard` - Main compliance dashboard
- `AssessmentForm` - Create/edit assessments
- `ComplianceBadge` - Display cooperative compliance status

### Database Tables
- `child_labor_assessments`
- `remediation_actions`
- `labor_certifications`
- `social_impact_metrics`
- `child_labor_incidents`

For more details, see `/docs/child-labor-compliance.md`
```

---

### ✅ TODO 10.2: Create Technical Documentation

**Where:** Cursor Editor - Create new file

**Cursor Prompt:**
```
Create comprehensive technical documentation: 
docs/child-labor-compliance.md

Include:
1. Architecture overview
2. Database schema explanation
3. API/Service layer documentation
4. Component hierarchy
5. State management approach
6. File upload workflow
7. Common tasks (how to...)
8. Troubleshooting guide
9. Future enhancements roadmap

Use the information from the implementation to write this guide.
```

---

### ✅ TODO 10.3: Add TypeScript Docs

**Where:** Cursor Editor - Throughout service and components

**Cursor Prompt:**
```
Add JSDoc comments to all public methods in ChildLaborService and all props 
in React components.

Example:
/**
 * Creates a new child labor assessment
 * @param data - Assessment data including cooperative info and violations
 * @returns Promise resolving to the created assessment
 * @throws Error if validation fails or database operation fails
 */

This helps with IDE autocomplete and makes the code more maintainable.
```

---

## 📋 PHASE 11: DEPLOYMENT (30 minutes)

### ✅ TODO 11.1: Environment Variables

**Where:** Vercel Dashboard or `.env.production`

**Cursor Prompt:**
```
Verify that my production environment variables are set correctly.

Required variables:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

Create a `.env.example` file showing all required environment variables 
(without actual values) for documentation.
```

---

### ✅ TODO 11.2: Build Test

**Where:** Cursor Terminal

**Cursor Prompt:**
```
Run a production build to test for any build errors:

npm run build

If there are TypeScript errors or build failures, help me fix them.

After successful build, test the production build locally:
npm run preview

Navigate to http://localhost:4173/compliance/child-labor and verify everything 
works.
```

---

### ✅ TODO 11.3: Deploy to Vercel

**Where:** Cursor Terminal

**Manual Steps:**
1. Commit all changes to git
2. Push to GitHub: `git push origin main`
3. Vercel will auto-deploy (if connected)
4. Or manually deploy: `vercel --prod`

**Cursor Prompt:**
```
Help me prepare for deployment:

1. Create a git commit with all the child labor compliance changes
2. Write a descriptive commit message
3. Check that no sensitive files are being committed (.env, etc.)
4. Push to the main branch

Git commands to review before running.
```

---

### ✅ TODO 11.4: Post-Deployment Verification

**Where:** Production URL

**Manual Checklist:**
- [ ] Dashboard loads at https://agro-soluce-market-by-ermits.vercel.app/compliance/child-labor
- [ ] Sample data displays correctly
- [ ] Charts render properly
- [ ] Can create new assessment
- [ ] File uploads work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Navigation works
- [ ] Authentication required
- [ ] Data persists correctly

---

## 📋 PHASE 12: ADVANCED FEATURES (Optional - Next Sessions)

### ✅ TODO 12.1: Add PDF Export

**Cursor Prompt:**
```
Add PDF export functionality to the Child Labor Dashboard.

Create a button that generates a PDF report including:
- Compliance overview
- Individual cooperative details
- Charts and visualizations
- Social impact metrics

Use a library like react-pdf or jspdf.

The button should be in the dashboard header.
```

---

### ✅ TODO 12.2: Add Email Notifications

**Cursor Prompt:**
```
Create an email notification system for:
1. Assessment due dates (30 days before due)
2. Low compliance alerts (score < 60)
3. New violations reported
4. Remediation action completion

Use Supabase Edge Functions and Resend or SendGrid for email delivery.

Create the edge function and webhook integration.
```

---

### ✅ TODO 12.3: Add Bulk Import

**Cursor Prompt:**
```
Create a bulk assessment import feature.

Allow users to:
1. Download CSV template
2. Fill in multiple assessments
3. Upload CSV file
4. Validate data
5. Import all assessments

Create component: src/components/compliance/BulkImport.tsx

Include data validation and error reporting for failed imports.
```

---

## ✅ COMPLETION CHECKLIST

### Core Features
- [ ] Database schema deployed
- [ ] TypeScript types added
- [ ] Supabase service created
- [ ] Dashboard component working
- [ ] Navigation integrated
- [ ] Compliance badges showing
- [ ] Assessment form functional
- [ ] File uploads working

### Quality & Testing
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Error handling
- [ ] Success notifications

### Documentation
- [ ] README updated
- [ ] Technical docs created
- [ ] JSDoc comments added
- [ ] Environment variables documented

### Deployment
- [ ] Production build successful
- [ ] Deployed to Vercel
- [ ] Production URL working
- [ ] Sample data visible

---

## 🎯 PRIORITY ORDER

If you have limited time, implement in this order:

**Must Have (Phase 1-6):** Database + Dashboard + Navigation = **90 minutes**
**Should Have (Phase 7-8):** Forms + File Upload = **75 minutes**
**Nice to Have (Phase 9-11):** Testing + Docs + Deploy = **80 minutes**
**Future (Phase 12):** Advanced features = **As needed**

---

## 💡 CURSOR TIPS

### Use Cursor Composer (Cmd/Ctrl + I) for:
- Creating new files
- Large code generation
- Multi-file changes

### Use Cursor Chat (Cmd/Ctrl + L) for:
- Quick questions
- Debugging errors
- Code explanations

### Use Cursor Inline Edit (Cmd/Ctrl + K) for:
- Small edits to existing code
- Refactoring
- Adding comments

---

## 🆘 TROUBLESHOOTING

### "Module not found" errors
```
Check package.json and run:
npm install
```

### "Supabase client not configured"
```
Verify .env.local has:
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

### "Type errors" in TypeScript
```
Run: npm run type-check
Fix each error one by one
```

### "Charts not rendering"
```
Verify recharts is installed:
npm list recharts
If not: npm install recharts
```

---

**🚀 Ready to start? Begin with Phase 1, TODO 1.1!**

Copy each "Cursor Prompt" into Cursor Composer and watch the magic happen! ✨

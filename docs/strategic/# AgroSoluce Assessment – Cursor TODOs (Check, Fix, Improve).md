# AgroSoluce Assessment – Cursor TODOs (Check, Fix, Improve)

## 0. Sanity Check – Module Exists as Designed

### 0.1. Files & structure

- [ ] GLOBAL SEARCH: `AssessmentFlow`  
      Confirm these files exist and compile:
      - `src/types/assessment.types.ts`
      - `src/data/assessment/sections.ts`
      - `src/data/assessment/scoring.ts`
      - `src/hooks/assessment/useAssessment.ts`
      - `src/components/assessment/AssessmentFlow.tsx`
      - `src/components/assessment/QuestionCard.tsx`
      - `src/components/assessment/ProgressTracker.tsx`
      - `src/components/assessment/NavigationControls.tsx`
      - `src/components/assessment/ResultsDashboard.tsx`
      - `src/components/assessment/ScoreCircle.tsx`
      - `src/components/assessment/RecommendationCard.tsx`
      - `src/components/assessment/index.ts`
      - `src/pages/assessment/index.tsx`

- [ ] Confirm `npm run dev` boots with **no TS/JS errors** related to assessment.

---

## A. Supabase Integration – Make Assessment Real (MUST-HAVE)

### A.1. Create Assessment API service

**File:** `src/services/assessment/api.ts` (if missing, create it)

- [ ] GLOBAL SEARCH: `"@/services/assessment/api"`  
      If not imported anywhere yet, still implement the service.

Add functions (Cursor TODO inside the file):

```ts
// TODO[assessment-api]: wire assessment persistence to Supabase
import { supabase } from '@/lib/supabase/client';
import { AssessmentResults } from '@/types/assessment.types';

const TABLE_ASSESSMENTS = 'assessments';
const TABLE_ASSESSMENT_RESPONSES = 'assessment_responses';

export async function createAssessmentRecord(
  cooperativeId: string,
  results: AssessmentResults
) {
  // TODO[assessment-api]: insert into assessments table
}

export async function createAssessmentResponses(
  assessmentId: string,
  results: AssessmentResults
) {
  // TODO[assessment-api]: bulk insert into assessment_responses
}

export async function getAssessmentsByCoop(cooperativeId: string) {
  // TODO[assessment-api]: select * from assessments where cooperative_id = ...
}

export async function getLatestAssessmentForCoop(cooperativeId: string) {
  // TODO[assessment-api]: select latest assessment by completed_at
}
Checks:

 Confirm table names match the migration SQL (assessments, assessment_responses).

 Use cooperative_id FK as defined in the migration.

 Handle Supabase errors with console + user-safe error messages.

A.2. Connect useAssessment to Supabase
File: src/hooks/assessment/useAssessment.ts

Right now:

Uses localStorage only.

cooperativeId in AssessmentResults is left empty.

TODOs:

 Add cooperativeId parameter to the hook:

ts
Copy code
// TODO[assessment-hook]: carry cooperativeId through the hook
export function useAssessment(cooperativeId: string) {
  ...
}
 In calculateResults(), set the real cooperativeId:

ts
Copy code
cooperativeId, // instead of ''
 After isComplete flips to true, call the API:

ts
Copy code
// TODO[assessment-hook]: on completion, persist to Supabase
// 1. calculateResults()
// 2. createAssessmentRecord(cooperativeId, results)
// 3. createAssessmentResponses(newAssessmentId, results)
 Keep localStorage as a temporary draft, but treat Supabase as source of truth after completion.

B. Coop Context – Bind Assessment to Cooperative (MUST-HAVE)
B.1. Accept cooperativeId in AssessmentFlow
File: src/components/assessment/AssessmentFlow.tsx

Current signature:

ts
Copy code
export function AssessmentFlow() { ... }
Change to:

ts
Copy code
// TODO[assessment-flow]: make AssessmentFlow coop-scoped
export function AssessmentFlow({ cooperativeId }: { cooperativeId: string }) {
  const {
    state,
    assessmentSections,
    handleAnswer,
    canProceed,
    nextSection,
    prevSection,
    calculateResults
  } = useAssessment(cooperativeId);
}
 Remove any hardcoded placeholders for cooperativeId.

 Ensure no assessment can run without a valid cooperativeId.

B.2. Integrate into Cooperative Workspace
File: Likely src/pages/workspace/CooperativeWorkspace.tsx (or equivalent)

TODOs:

 GLOBAL SEARCH: CooperativeWorkspace and its tabs.

Add an Assessment tab:

tsx
Copy code
// TODO[workspace-tabs]: add Assessment tab
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'coverage', label: 'Coverage' },
  { id: 'gaps', label: 'Gaps' },
  { id: 'readiness', label: 'Readiness' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'farmers-first', label: 'Farmers First' },
];
Render AssessmentFlow under that tab:

tsx
Copy code
// TODO[workspace-tabs]: render AssessmentFlow for assessment tab
{activeTab === 'assessment' && (
  <AssessmentFlow cooperativeId={coopId} />
)}
Make sure coopId is derived from route params:

ts
Copy code
const { coopId } = useParams<{ coopId: string }>();
C. Overview Integration & Safe Language (MUST-HAVE)
C.1. Overview card for latest assessment
File: CooperativeWorkspace Overview section

 Add a small card like:

tsx
Copy code
// TODO[overview]: show latest self-assessment summary
<LatestAssessmentSummary cooperativeId={coopId} />
Implement LatestAssessmentSummary:

 Fetch getLatestAssessmentForCoop(coopId)

 Show:

Score / band

Completed date

Label: “Self-assessment (non-certifying)”

C.2. Fix risky wording in ResultsDashboard
File: src/components/assessment/ResultsDashboard.tsx

Currently:

ts
Copy code
if (score >= 80) return 'Premium market ready!';
if (score >= 60) return 'Good - toolkit recommended';
return 'Foundational improvements needed';
TODO: make this regulator-safe

ts
Copy code
// TODO[results-copy]: soften language to self-assessment, non-certifying
if (score >= 80) return 'High readiness based on self-assessment';
if (score >= 60) return 'Good readiness with areas to strengthen';
return 'Foundational improvements needed before engaging buyers';
Add disclaimer block:

tsx
Copy code
// TODO[results-copy]: add explicit self-assessment disclaimer
<p className="text-xs text-gray-500 mt-4">
  This is a cooperative self-assessment. It does not constitute certification,
  regulatory approval, or EUDR compliance. Use it to guide improvement and plan
  further verification (audits, field visits, independent reviews).
</p>
 Search and remove any phrasing like:

“certified”

“compliant”

“approved”

“market ready” (without “self-assessment” qualifier)

D. Verification – Use Cursor as Test Harness (MUST-HAVE)
Create: AGROSOLUCE_ASSESSMENT_VERIFICATION.md

 Include these manual checks:

md
Copy code
### D.1. Functional tests

- [ ] Run `npm run dev`
- [ ] Go to a real coop workspace: `/workspace/:coop_id`
- [ ] Open Assessment tab
- [ ] Complete assessment
- [ ] Refresh page:
      - Latest assessment still shows in Assessment tab
      - Overview card shows latest score + date

### D.2. Database checks (Supabase)

- [ ] In Supabase SQL / Table editor:
      - Confirm new row in `assessments` with correct `cooperative_id`
      - Confirm rows in `assessment_responses` linked to `assessment_id`

### D.3. Empty/edge states

- [ ] Coop with no assessments → Assessment tab renders clean empty state
- [ ] Partially completed assessment (user abandons) → no broken UI
- [ ] Error from Supabase (simulate bad key) → user sees clean error toast/message, no crash
E. NICE-TO-HAVE (Implement After Core Is Stable)
These are worth doing, but only once A–D are green.

E.1. Buyer / read-only view
 Create a read-only component:

BuyerAssessmentView that:

Takes cooperativeId

Shows latest assessment + section scores

Hides buttons like “Access Toolkit” / “Speak with Expert”

 Use it in any buyer-specific routes (if you have them).

E.2. Radar / visual breakdown
 Add a simple radar/spider chart for section scores in ResultsDashboard
(e.g., using Recharts or similar, if already in stack).

 Make sure no new heavy dependency conflicts with Vite build.

E.3. Link recommendations to Farmers First & toolkits
 For child-protection / security / economic recommendations:
- Add CTAs that deep link to:
- Farmers First dashboard
- Relevant toolkit sections/pages

 Example:
- “Start Farmers First onboarding” button if child-protection score is low.

E.4. Export & share
 Add “Export to PDF” or “Download as JSON”:
- Basic JSON export first (no pdf engine headache).

 Make sure exported data includes:
- Cooperative ID
- Timestamp
- Scores
- Recommendations
- Explicit note: “Self-assessment – non-certifying”

E.5. Event logging / analytics
 Emit custom events when:
- Assessment started
- Assessment completed

 Use your existing analytics/logging pattern (if any) to track adoption.

yaml
Copy code

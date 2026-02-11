# AgroSoluce Assessment – Verification Checklist

**Purpose**: Manual verification checklist for the Assessment module before production deployment.

**Last Updated**: Current  
**Verification Status**: ⏸️ Pending

---

## D.1. Functional Tests

### Setup
- [ ] Run `npm run dev` - application boots without TypeScript/JavaScript errors
- [ ] Verify no console errors related to assessment module on initial load
- [ ] Confirm Supabase connection is working (check browser console for connection status)

### Navigation & Access
- [ ] Navigate to a cooperative workspace: `/workspace/:coop_id` (use a real cooperative ID)
- [ ] Confirm "Assessment" tab appears in the tab navigation
- [ ] Click on "Assessment" tab - AssessmentFlow component loads
- [ ] Verify assessment header displays: "AgroSoluce® Farm Assessment"
- [ ] Confirm "Farmers First - 100% Free Assessment" badge is visible

### Assessment Flow
- [ ] Start a new assessment (if no previous assessment exists)
- [ ] Verify progress tracker shows correct section (Section 1 of 4)
- [ ] Answer all questions in Section 1 (Farm Profile)
- [ ] Confirm "Next" button becomes enabled after all questions answered
- [ ] Click "Next" - navigates to Section 2
- [ ] Verify progress updates correctly
- [ ] Complete Section 2 (Security & Data Protection)
- [ ] Complete Section 3 (Child Protection & Social Responsibility)
- [ ] Complete Section 4 (Economic Performance & Market Access)
- [ ] On final section, verify "Next" button says "Complete Assessment" or similar
- [ ] Click to complete - ResultsDashboard should appear

### Results Display
- [ ] Verify overall score displays (0-100%)
- [ ] Confirm ScoreCircle component renders correctly
- [ ] Check that section scores display for all 4 sections:
  - Farm Profile
  - Security
  - Child Protection
  - Economic
- [ ] Verify recommendations section appears (if applicable)
- [ ] Confirm disclaimer text is visible: "This is a self-assessment tool..."
- [ ] Verify "Access Toolkit" and "Speak with Expert" buttons appear
- [ ] Check that score labels are appropriate (no "certified", "compliant", "approved" language)

### Persistence & Reload
- [ ] After completing assessment, refresh the page (F5)
- [ ] Verify latest assessment still shows in Assessment tab
- [ ] Confirm results are displayed (not blank)
- [ ] Navigate away from Assessment tab and return
- [ ] Verify assessment results persist

### Overview Integration
- [ ] Go to "Overview" tab in CooperativeWorkspace
- [ ] Scroll to "Self-Assessment" card
- [ ] Verify latest assessment score displays
- [ ] Confirm completed date shows correctly
- [ ] Check "Self-assessment (not certified)" disclaimer is visible
- [ ] Click "View Assessment →" link
- [ ] Verify it navigates to Assessment tab and shows results

### Edge Cases
- [ ] Start assessment, answer some questions, then refresh page
  - Expected: In-progress assessment should restore from localStorage
- [ ] Start assessment, answer some questions, navigate away, then return
  - Expected: Progress should be preserved
- [ ] Complete assessment, then try to start a new one
  - Expected: Should allow starting new assessment (or show clear message if only one allowed)
- [ ] Test with cooperative that has no assessments
  - Expected: Assessment tab shows empty state or "Start Assessment" message
  - Expected: Overview card shows "No assessment completed yet"

---

## D.2. Database Checks (Supabase)

### Prerequisites
- [ ] Access to Supabase dashboard or SQL editor
- [ ] Confirm migration `019_add_assessment_tables.sql` has been run
- [ ] Verify tables exist: `agrosoluce.assessments` and `agrosoluce.assessment_responses`

### After Completing an Assessment

#### Assessments Table
- [ ] Open Supabase Table Editor → `agrosoluce.assessments`
- [ ] Find the newly created assessment row
- [ ] Verify `cooperative_id` matches the cooperative you tested with
- [ ] Check `overall_score` is a number between 0-100
- [ ] Verify `section_scores` is a JSONB object with 4 section keys
- [ ] Confirm `recommendations` is a JSONB array (may be empty)
- [ ] Check `toolkit_ready` is boolean (true/false)
- [ ] Verify `completed_at` timestamp is recent and correct
- [ ] Confirm `created_at` and `updated_at` are set

#### Assessment Responses Table
- [ ] Open Supabase Table Editor → `agrosoluce.assessment_responses`
- [ ] Filter by the `assessment_id` from the assessment you just created
- [ ] Verify multiple rows exist (one per question answered)
- [ ] Check `question_id` values match question IDs from sections
- [ ] Verify `response_value` contains the selected option value
- [ ] Confirm `score` values are between 0-3 (matching option scores)
- [ ] Check `created_at` timestamps are recent

#### Data Integrity
- [ ] Count total responses: should match total questions in all sections
- [ ] Verify no orphaned responses (all have valid `assessment_id`)
- [ ] Check that `cooperative_id` in assessments table references valid cooperative

### Query Verification (Optional - SQL Editor)
```sql
-- Verify assessment was created correctly
SELECT 
  id,
  cooperative_id,
  overall_score,
  section_scores,
  completed_at
FROM agrosoluce.assessments
WHERE cooperative_id = '<your-test-coop-id>'
ORDER BY completed_at DESC
LIMIT 1;

-- Verify responses were created
SELECT 
  COUNT(*) as response_count,
  assessment_id
FROM agrosoluce.assessment_responses
WHERE assessment_id = '<assessment-id-from-above>'
GROUP BY assessment_id;

-- Should return count matching total questions (check sections.ts for exact count)
```

---

## D.3. Empty/Edge States

### Empty States
- [ ] **Coop with no assessments**:
  - Navigate to cooperative workspace with no previous assessments
  - Open Assessment tab
  - Expected: Clean empty state or "Start Assessment" message
  - Expected: No errors, no broken UI elements
  - Expected: Overview card shows "No assessment completed yet"

### Partial Completion
- [ ] **Partially completed assessment (user abandons)**:
  - Start assessment, answer 2-3 questions
  - Close browser tab/window
  - Reopen and navigate back to same cooperative
  - Expected: Assessment should restore from localStorage
  - Expected: Progress should be preserved
  - Expected: Can continue from where left off
  - Expected: No broken state, no errors

### Error Handling
- [ ] **Supabase connection error** (simulate by disconnecting network or using bad key):
  - Start assessment
  - Complete all questions
  - Disconnect network or block Supabase requests
  - Try to complete assessment
  - Expected: User sees error message (not crash)
  - Expected: Error message is user-friendly
  - Expected: Assessment state is preserved (can retry)
  - Expected: localStorage backup still works

- [ ] **Invalid cooperative ID**:
  - Navigate to `/workspace/invalid-id`
  - Try to access Assessment tab
  - Expected: Graceful error handling or redirect
  - Expected: No console errors that break the app

### Loading States
- [ ] **Loading latest assessment**:
  - Navigate to cooperative with existing assessment
  - Open Overview tab
  - Expected: Shows "Loading assessment..." while fetching
  - Expected: Transitions smoothly to showing results
  - Expected: No flickering or layout shifts

### Data Validation
- [ ] **Invalid assessment data** (if possible to simulate):
  - Expected: Application handles malformed data gracefully
  - Expected: Shows appropriate error message
  - Expected: Doesn't crash or break UI

---

## D.4. Language & Compliance Safety

### Regulatory Language Check
- [ ] Search entire assessment module for these terms (should NOT appear without qualifiers):
  - [ ] "certified" (without "not certified" or "self-assessment")
  - [ ] "compliant" (without "not a compliance determination")
  - [ ] "approved" (without disclaimer context)
  - [ ] "market ready" (without "self-assessment" qualifier)

### Required Disclaimers
- [ ] **ResultsDashboard**:
  - [ ] Yellow disclaimer box is visible
  - [ ] Text includes: "self-assessment tool"
  - [ ] Text includes: "not a certification, compliance determination, or approval"
  - [ ] Text includes: "responsibility of buyers and operators"

- [ ] **Overview Card**:
  - [ ] "Self-assessment (not certified)" label is visible
  - [ ] Description includes: "not a certification or compliance determination"

- [ ] **Score Labels**:
  - [ ] Score labels don't imply certification
  - [ ] Language is appropriately cautious
  - [ ] No absolute claims about readiness

---

## D.5. Performance & UX

### Performance
- [ ] Assessment loads quickly (< 2 seconds on good connection)
- [ ] Navigation between sections is smooth (no lag)
- [ ] Saving to Supabase doesn't block UI (shows loading indicator)
- [ ] No unnecessary re-renders or flickering

### User Experience
- [ ] Progress tracker accurately reflects completion
- [ ] Questions are clear and easy to understand
- [ ] Answer options are intuitive
- [ ] Navigation buttons are clearly labeled
- [ ] Results are easy to interpret
- [ ] Recommendations are actionable

### Accessibility (Basic Check)
- [ ] All interactive elements are keyboard accessible
- [ ] Text has sufficient contrast
- [ ] Error messages are clear and visible
- [ ] Loading states are communicated

---

## D.6. Integration Points

### Cooperative Workspace
- [ ] Assessment tab integrates seamlessly with other tabs
- [ ] Tab switching doesn't lose state
- [ ] Overview card updates after assessment completion
- [ ] Navigation between tabs works correctly

### API Integration
- [ ] API calls use correct Supabase schema (`agrosoluce.assessments`)
- [ ] Error responses are handled gracefully
- [ ] Network failures don't break the application
- [ ] Data is correctly transformed between frontend and database

---

## Verification Sign-Off

**Verified By**: _________________  
**Date**: _________________  
**Environment**: [ ] Development [ ] Staging [ ] Production  
**Browser(s) Tested**: _________________  
**Overall Status**: [ ] ✅ Pass [ ] ⚠️ Pass with Issues [ ] ❌ Fail

### Issues Found
(List any issues discovered during verification)

1. 
2. 
3. 

### Notes
(Additional observations or comments)

---

## Quick Test Script

For rapid verification, follow this sequence:

1. **Fresh Start**: Clear browser cache/localStorage
2. **Navigate**: Go to `/workspace/<test-coop-id>`
3. **Complete Assessment**: Answer all questions, complete assessment
4. **Verify Results**: Check ResultsDashboard displays correctly
5. **Refresh**: Reload page, verify persistence
6. **Check Database**: Verify data in Supabase tables
7. **Check Overview**: Verify overview card shows latest assessment
8. **Edge Cases**: Test partial completion, errors, empty states

**Estimated Time**: 15-20 minutes for full verification


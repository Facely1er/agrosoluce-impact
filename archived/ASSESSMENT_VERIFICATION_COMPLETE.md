# Assessment Module Verification Document

**Date:** December 2025  
**Status:** Manual Testing Checklist  
**Purpose:** Verify assessment module functionality end-to-end

---

## Overview

This document provides a comprehensive manual testing checklist for the AgroSoluce Assessment Module. The assessment module allows cooperatives to complete self-assessments that are stored in Supabase and displayed in the workspace.

---

## Pre-Testing Setup

### Database Verification

- [ ] Verify `assessments` table exists in Supabase
- [ ] Verify `assessment_responses` table exists in Supabase
- [ ] Verify RLS policies are enabled on both tables
- [ ] Verify tables are accessible with anon key (or appropriate service role key for testing)

### Environment Setup

- [ ] Verify `VITE_SUPABASE_URL` is set in `.env` or deployment environment
- [ ] Verify `VITE_SUPABASE_ANON_KEY` is set
- [ ] Verify `VITE_SUPABASE_SCHEMA` is set to `agrosoluce` (if using custom schema)
- [ ] Start development server: `npm run dev` or `npm run dev:web`

---

## Test Scenarios

### 1. Assessment Flow - New Assessment

**Route:** `/assessment/:coop_id` or `/workspace/:coop_id` → Assessment tab

**Steps:**
1. [ ] Navigate to a cooperative workspace (e.g., `/workspace/coop-123`)
2. [ ] Click on the "Assessment" tab
3. [ ] Verify the assessment form loads without errors
4. [ ] Verify all assessment sections are visible:
   - [ ] Section A: Basic Information
   - [ ] Section B: Governance & Management
   - [ ] Section C: Financial Health
   - [ ] Section D: Operational Capacity
   - [ ] Section E: Compliance & Certifications
   - [ ] Section F: Social Impact
5. [ ] Fill out at least one section completely
6. [ ] Verify progress indicator updates
7. [ ] Navigate between sections using Next/Previous buttons
8. [ ] Complete all sections
9. [ ] Click "Submit Assessment"
10. [ ] Verify success message appears
11. [ ] Verify assessment is saved to Supabase:
    - [ ] Check `assessments` table for new record
    - [ ] Check `assessment_responses` table for response records
    - [ ] Verify `cooperative_id` matches the workspace cooperative
    - [ ] Verify `completed_at` timestamp is set

**Expected Results:**
- Assessment form loads without console errors
- All sections are accessible
- Progress tracking works correctly
- Assessment saves successfully to database
- Success feedback is shown to user

---

### 2. Assessment Results Display

**Route:** `/workspace/:coop_id` → Assessment tab (after completion)

**Steps:**
1. [ ] After completing an assessment, verify results page appears
2. [ ] Verify overall score is displayed (0-100)
3. [ ] Verify score band is displayed (e.g., "Excellent", "Good", "Fair", "Needs Improvement")
4. [ ] Verify score breakdown by section is shown
5. [ ] Verify recommendations list appears
6. [ ] Verify "Self-assessment (not certified)" disclaimer is visible
7. [ ] Reload the page
8. [ ] Verify assessment results persist and display correctly

**Expected Results:**
- Results display immediately after submission
- Score and band are calculated correctly
- Recommendations are relevant to the score
- Disclaimer is prominently displayed
- Results persist after page reload

---

### 3. Assessment Display on Overview Tab

**Route:** `/workspace/:coop_id` → Overview tab

**Steps:**
1. [ ] Navigate to workspace Overview tab
2. [ ] Verify "Latest Assessment" section appears
3. [ ] Verify latest assessment shows:
   - [ ] Assessment date
   - [ ] Score band (e.g., "Good")
   - [ ] Score value (e.g., "75/100")
   - [ ] "Self-assessment (not certified)" wording
4. [ ] Verify link to full assessment results works
5. [ ] Complete a new assessment
6. [ ] Return to Overview tab
7. [ ] Verify latest assessment updates to show new assessment

**Expected Results:**
- Latest assessment appears on Overview
- All required information is displayed
- Proper disclaimer wording is used
- Latest assessment updates when new assessment is completed

---

### 4. Assessment History

**Route:** `/workspace/:coop_id` → Assessment tab

**Steps:**
1. [ ] Complete multiple assessments for the same cooperative
2. [ ] Navigate to Assessment tab
3. [ ] Verify assessment history is displayed (if implemented)
4. [ ] Verify each assessment shows:
   - [ ] Completion date
   - [ ] Score
   - [ ] Ability to view details
5. [ ] Verify latest assessment is clearly marked

**Expected Results:**
- Multiple assessments are stored correctly
- Assessment history displays all assessments
- Each assessment is uniquely identifiable
- Latest assessment is highlighted

---

### 5. Assessment Persistence

**Route:** `/assessment/:coop_id` or `/workspace/:coop_id` → Assessment tab

**Steps:**
1. [ ] Start filling out an assessment
2. [ ] Fill out 2-3 sections
3. [ ] Navigate away from the page (or close browser)
4. [ ] Return to the assessment page
5. [ ] Verify if draft saving is implemented:
   - [ ] If yes: Verify draft is restored
   - [ ] If no: Verify form starts fresh (acceptable for v1)
6. [ ] Complete and submit assessment
7. [ ] Verify assessment persists in database after browser restart

**Expected Results:**
- Assessment data persists after submission
- Draft saving (if implemented) works correctly
- Submitted assessments are never lost

---

### 6. Error Handling

**Route:** `/assessment/:coop_id` or `/workspace/:coop_id` → Assessment tab

**Steps:**
1. [ ] Disconnect from internet (or block Supabase requests)
2. [ ] Try to submit an assessment
3. [ ] Verify error message is displayed
4. [ ] Verify form data is not lost
5. [ ] Reconnect to internet
6. [ ] Verify assessment can be submitted successfully
7. [ ] Test with invalid `coop_id` in URL
8. [ ] Verify appropriate error handling

**Expected Results:**
- Network errors are handled gracefully
- User-friendly error messages are shown
- Form data is preserved during errors
- Invalid cooperative IDs are handled

---

### 7. Assessment Scoring Logic

**Route:** `/assessment/:coop_id` → Complete assessment

**Steps:**
1. [ ] Complete an assessment with all "Excellent" answers
2. [ ] Verify score is close to 100
3. [ ] Complete an assessment with all "Poor" answers
4. [ ] Verify score is close to 0
5. [ ] Complete an assessment with mixed answers
6. [ ] Verify score is calculated correctly
7. [ ] Verify score bands match expected ranges:
   - [ ] 90-100: "Excellent"
   - [ ] 75-89: "Good"
   - [ ] 60-74: "Fair"
   - [ ] <60: "Needs Improvement"

**Expected Results:**
- Scoring algorithm works correctly
- Score bands are accurate
- Scores reflect assessment answers appropriately

---

### 8. Assessment Recommendations

**Route:** `/assessment/:coop_id` → Results page

**Steps:**
1. [ ] Complete an assessment with low scores in specific sections
2. [ ] Verify recommendations are generated
3. [ ] Verify recommendations are relevant to low-scoring sections
4. [ ] Verify recommendations are actionable
5. [ ] Complete an assessment with high scores
6. [ ] Verify recommendations still appear (may be positive/encouraging)

**Expected Results:**
- Recommendations are generated for all assessments
- Recommendations are relevant to assessment results
- Recommendations are helpful and actionable

---

### 9. Multi-Language Support (if applicable)

**Route:** `/assessment/:coop_id`

**Steps:**
1. [ ] Switch language to French (if implemented)
2. [ ] Verify assessment form is translated
3. [ ] Verify section names are translated
4. [ ] Verify question text is translated
5. [ ] Verify results page is translated
6. [ ] Verify disclaimers are translated
7. [ ] Complete assessment in French
8. [ ] Verify data saves correctly regardless of language

**Expected Results:**
- All text is properly translated
- Assessment functionality works in all languages
- Data storage is language-independent

---

### 10. Mobile Responsiveness

**Route:** `/assessment/:coop_id` (on mobile device or mobile viewport)

**Steps:**
1. [ ] Open assessment on mobile device (or use browser dev tools)
2. [ ] Verify form is usable on small screens
3. [ ] Verify buttons are appropriately sized
4. [ ] Verify text is readable
5. [ ] Verify navigation between sections works
6. [ ] Verify results page displays correctly
7. [ ] Test on multiple screen sizes (375px, 768px, 1024px)

**Expected Results:**
- Assessment is fully functional on mobile
- UI elements are appropriately sized
- Text is readable
- Navigation works smoothly

---

## Database Verification Queries

Run these queries in Supabase SQL Editor to verify data integrity:

### Check Assessment Records

```sql
-- Count total assessments
SELECT COUNT(*) as total_assessments 
FROM agrosoluce.assessments;

-- View latest assessments
SELECT 
  id,
  cooperative_id,
  overall_score,
  score_band,
  completed_at,
  created_at
FROM agrosoluce.assessments
ORDER BY completed_at DESC
LIMIT 10;

-- Check assessment responses
SELECT 
  ar.assessment_id,
  COUNT(*) as response_count,
  a.overall_score
FROM agrosoluce.assessment_responses ar
JOIN agrosoluce.assessments a ON ar.assessment_id = a.id
GROUP BY ar.assessment_id, a.overall_score
ORDER BY a.completed_at DESC
LIMIT 10;
```

### Verify Data Integrity

```sql
-- Check for assessments without responses
SELECT a.id, a.cooperative_id, a.completed_at
FROM agrosoluce.assessments a
LEFT JOIN agrosoluce.assessment_responses ar ON a.id = ar.assessment_id
WHERE ar.id IS NULL;

-- Check for orphaned responses
SELECT ar.id, ar.assessment_id
FROM agrosoluce.assessment_responses ar
LEFT JOIN agrosoluce.assessments a ON ar.assessment_id = a.id
WHERE a.id IS NULL;
```

---

## Known Issues & Limitations

### Current Limitations (v1)

1. **Draft Saving:** Draft saving may not be implemented in v1. Assessments must be completed in one session.
2. **Assessment History:** Assessment history view may not be fully implemented. Only latest assessment may be visible.
3. **Export:** Assessment export functionality may not be available in v1.

### Known Issues

- [ ] List any known bugs or issues here
- [ ] Document workarounds if applicable

---

## Performance Testing

### Load Testing

- [ ] Test with 10+ assessments for the same cooperative
- [ ] Verify page load time is acceptable (< 3 seconds)
- [ ] Verify database queries are optimized
- [ ] Check for N+1 query problems

### Browser Compatibility

- [ ] Test in Chrome (latest)
- [ ] Test in Firefox (latest)
- [ ] Test in Safari (latest)
- [ ] Test in Edge (latest)
- [ ] Test on mobile browsers (iOS Safari, Chrome Mobile)

---

## Security Testing

### RLS Policy Verification

- [ ] Verify users can only see assessments for cooperatives they have access to
- [ ] Verify users cannot modify other users' assessments
- [ ] Verify anon key has appropriate permissions
- [ ] Test with different user roles (if applicable)

### Data Validation

- [ ] Verify assessment scores are within valid range (0-100)
- [ ] Verify required fields are validated
- [ ] Verify SQL injection protection (if using raw queries)
- [ ] Verify XSS protection in assessment responses

---

## Integration Testing

### Workspace Integration

- [ ] Verify assessment tab appears in workspace
- [ ] Verify assessment results appear on Overview tab
- [ ] Verify navigation between tabs works correctly
- [ ] Verify cooperative ID is correctly passed to assessment

### API Integration

- [ ] Verify `assessmentApi.ts` functions work correctly
- [ ] Verify error handling in API calls
- [ ] Verify loading states during API calls
- [ ] Verify success/error notifications

---

## Acceptance Criteria

### Must Have (Launch Blockers)

- [x] Assessment form loads without errors
- [x] All sections are accessible
- [x] Assessment can be completed and submitted
- [x] Assessment data saves to Supabase
- [x] Results display correctly after submission
- [x] Latest assessment appears on Overview tab
- [x] Proper disclaimers are displayed
- [x] No "certified" or "compliant" claims (except in disclaimers)

### Should Have (Post-Launch)

- [ ] Draft saving functionality
- [ ] Assessment history view
- [ ] Assessment export (JSON/CSV)
- [ ] Email notifications for assessment completion
- [ ] Assessment comparison over time

### Nice to Have (Future)

- [ ] PDF export of assessment results
- [ ] Assessment templates
- [ ] Collaborative assessments (multiple users)
- [ ] Assessment scheduling/reminders

---

## Test Results Summary

**Date Tested:** _______________  
**Tester:** _______________  
**Environment:** Development / Staging / Production

### Overall Status

- [ ] ✅ **PASS** - All critical tests passed, ready for production
- [ ] ⚠️ **PASS WITH ISSUES** - Critical tests passed, but some non-critical issues found
- [ ] ❌ **FAIL** - Critical tests failed, not ready for production

### Critical Issues Found

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Non-Critical Issues Found

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

### Notes

_________________________________________________
_________________________________________________
_________________________________________________

---

## Sign-Off

**Tested By:** _______________  
**Date:** _______________  
**Approved For Production:** [ ] Yes [ ] No

**Reviewed By:** _______________  
**Date:** _______________  
**Approved For Production:** [ ] Yes [ ] No

---

## Appendix: File Locations

### Key Files

- **Assessment API:** `apps/web/src/features/assessment/api/assessmentApi.ts`
- **Assessment Hook:** `apps/web/src/hooks/assessment/useAssessment.ts`
- **Assessment Flow Component:** `apps/web/src/components/assessment/AssessmentFlow.tsx`
- **Assessment Page:** `apps/web/src/pages/assessment/index.tsx`
- **Workspace Integration:** `apps/web/src/pages/workspace/CooperativeWorkspace.tsx`
- **Database Migrations:** `packages/database/migrations/019_add_assessment_tables.sql`

### Related Documentation

- `ASSESSMENT_TODO_REVIEW.md` - Implementation status review
- `AGROSOLUCE_LAUNCH_VERIFICATION.md` - Overall launch verification
- `ASSESSMENT_IMPLEMENTATION_COMPLETE.md` - Implementation details

---

**Last Updated:** December 2025  
**Version:** 1.0


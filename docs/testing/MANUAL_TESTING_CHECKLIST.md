# Manual Testing Checklist for AgroSoluce v1 Launch

**Purpose:** Complete manual verification before production deployment  
**Estimated Time:** 30-45 minutes

---

## Pre-Testing Setup

- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Verify environment variables are set:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Start dev server: `npm run dev`
- [ ] Open browser console (F12) and keep it open during testing

---

## 1. Build & Basic Navigation ✅

### 1.1 Production Build
- [ ] Run `npm run build` - should complete without errors
- [ ] Run `npm run preview` - should start preview server
- [ ] Verify build output in `apps/web/dist`

### 1.2 Basic Routes
- [ ] Navigate to `/` - homepage loads
- [ ] Navigate to `/directory` - directory page loads
- [ ] Navigate to `/directory/nonexistent` - shows 404 page
- [ ] Navigate to `/workspace/nonexistent` - shows error or 404
- [ ] Navigate to `/pilot/nonexistent` - shows error or 404
- [ ] Check browser console - no red errors

---

## 2. Directory Page - Context-First Design

### 2.1 Filter Bar
- [ ] Filter bar visible at top of page
- [ ] Commodity dropdown shows available commodities (Cocoa, Coffee, etc.)
- [ ] Country dropdown shows available countries
- [ ] Region dropdown shows available regions
- [ ] Coverage dropdown shows: All, Substantial, Partial, Limited
- [ ] Search box is present (secondary to filters)

### 2.2 Default State
- [ ] On initial load, commodity defaults to "Cocoa" (or first available)
- [ ] Country defaults to "CI" (Côte d'Ivoire)
- [ ] Coverage defaults to "All"
- [ ] Results are filtered by default commodity

### 2.3 Filtering Functionality
- [ ] Change commodity filter → results update
- [ ] Change country filter → results update
- [ ] Change region filter → results update
- [ ] Change coverage filter → results update
- [ ] Use search box → results filter by name
- [ ] Click "Reset" button → filters return to defaults
- [ ] No console errors during filtering

### 2.4 Card Display
- [ ] Each card shows context first: `COCOA • CI • Nawa` format
- [ ] Cooperative name appears after context
- [ ] Coverage snippet visible: "Documentation coverage: Substantial/Partial/Limited"
- [ ] "View cooperative profile →" link present
- [ ] Cards are clickable/navigable

---

## 3. Cooperative Detail Page (`/directory/:coop_id`)

### 3.1 Identity Section
- [ ] Cooperative name visible
- [ ] Country, region visible
- [ ] Commodities list visible (if available)
- [ ] Primary crop visible (if available)

### 3.2 Commodities & Documentation Coverage Section
- [ ] Section titled "Commodities & Documentation Coverage" exists
- [ ] For each commodity, shows:
  - [ ] Coverage band (Substantial/Partial/Limited)
  - [ ] Coverage percentage
  - [ ] Document count (X / Y)
- [ ] Shows "No documentation submitted" when appropriate
- [ ] Disclaimer present in section

### 3.3 Documentation Coverage Snapshot
- [ ] Shows coverage description
- [ ] Shows required documents total
- [ ] Shows required documents present
- [ ] Shows coverage percentage

### 3.4 Disclaimers
- [ ] Disclaimer present at bottom of page
- [ ] Text includes: "does not constitute certification, verification, or regulatory approval"

---

## 4. Cooperative Workspace (`/workspace/:coop_id`)

### 4.1 Tabs
- [ ] Overview tab visible and loads
- [ ] Evidence tab visible and loads
- [ ] Coverage tab visible and loads
- [ ] Gaps & Guidance tab visible and loads
- [ ] Enablement tab visible and loads
- [ ] Farmers First tab visible and loads
- [ ] Assessment tab visible and loads
- [ ] No console errors when switching tabs

**Note:** Readiness functionality is in Overview tab (not separate tab)

### 4.2 Overview Tab
- [ ] Shows pilot information (if applicable)
- [ ] Shows Farmers First snapshot
- [ ] Shows Assessment snapshot
- [ ] Shows Readiness Status section
- [ ] "Create Snapshot" button works
- [ ] Snapshot history displays (if snapshots exist)
- [ ] Disclaimer present: "internal readiness shorthand... not a compliance determination"

### 4.3 Evidence Tab
- [ ] Evidence documents list displays
- [ ] "Upload Document" button works
- [ ] Upload form appears when clicked
- [ ] Can select document type, title, issuer, dates
- [ ] Can upload file
- [ ] Uploaded document appears in list
- [ ] Can delete documents
- [ ] No console errors

### 4.4 Coverage Tab
- [ ] Coverage summary displays
- [ ] Shows required docs total
- [ ] Shows required docs present
- [ ] Shows coverage percentage
- [ ] Document presence list displays
- [ ] Shows which document types are present/missing

### 4.5 Gaps & Guidance Tab
- [ ] Shows missing document types
- [ ] Shows "Why This Is Commonly Requested" for each gap
- [ ] Shows "Typical Next Steps" for each gap
- [ ] Disclaimer present
- [ ] If no gaps, shows "No Documentation Gaps" message

### 4.6 Assessment Tab
- [ ] Assessment form loads
- [ ] Title shows "Cocoa Self-Assessment"
- [ ] Subtitle shows "Cocoa Due-Diligence Self-Assessment"
- [ ] Disclaimer visible: "applies to cocoa supply chains only... does not constitute certification"
- [ ] Can answer questions
- [ ] Can navigate between sections
- [ ] Can save assessment
- [ ] Results display after completion
- [ ] Results clearly marked as "Self-assessment (not certified)"

---

## 5. Farmers First Tab

### 5.1 Data Display
- [ ] Shows aggregated metrics only:
  - [ ] Number of farmers onboarded
  - [ ] Number of trainings
  - [ ] Participation rates
  - [ ] Declarations counts
- [ ] **NO individual farmer names visible**
- [ ] **NO farmer IDs visible**
- [ ] **NO PII (personally identifiable information) visible**

### 5.2 Navigation
- [ ] No public links to `/farmers/:farmer_id`
- [ ] All data is aggregated/cooperative-level

---

## 6. Pilot Dashboard (`/pilot/:pilot_id`)

### 6.1 Dashboard Loads
- [ ] Page loads without errors
- [ ] Shows pilot label/ID
- [ ] Shows number of cooperatives

### 6.2 Aggregate Metrics
- [ ] Average coverage percentage displays
- [ ] Not Ready count displays
- [ ] In Progress count displays
- [ ] Buyer Ready count displays
- [ ] Percentages calculate correctly

### 6.3 Cooperative Table
- [ ] Table of cooperatives displays
- [ ] Each row shows:
  - [ ] Cooperative name (clickable link)
  - [ ] Country
  - [ ] Primary crop
  - [ ] Coverage %
  - [ ] Readiness status
  - [ ] Last snapshot date
- [ ] Links to workspace work correctly

### 6.4 Disclaimer
- [ ] Disclaimer present
- [ ] Text includes: "does not constitute a certification, rating, or compliance decision"

---

## 7. Assessment Flow

### 7.1 Cocoa-Specific Wording
- [ ] Title: "Cocoa Self-Assessment"
- [ ] Subtitle: "Cocoa Due-Diligence Self-Assessment"
- [ ] Intro text mentions "cocoa supply chains only"

### 7.2 Non-Certifying Language
- [ ] No use of "compliant" in results
- [ ] No use of "certified" in results
- [ ] No use of "fully EUDR ready" in results
- [ ] Results clearly marked as "self-assessment"
- [ ] Disclaimer visible throughout

---

## 8. Over-Claim Audit

### 8.1 Search for Problematic Terms
Open browser and search (Ctrl+F) for:
- [ ] "compliant" - only in disclaimers/context
- [ ] "certified" - only in disclaimers/context
- [ ] "verified" - only in disclaimers/context
- [ ] "approved" - only in disclaimers/context
- [ ] "risk-free" - should not appear
- [ ] "child-labor free" - should not appear
- [ ] "EUDR ready" - should not appear without context
- [ ] "fully aligned" - should not appear without context

### 8.2 Disclaimers Present
- [ ] Directory page has disclaimer
- [ ] Cooperative detail has disclaimer
- [ ] Assessment page has disclaimer
- [ ] Workspace pages have disclaimers
- [ ] Pilot dashboard has disclaimer

---

## 9. Console & Error Checking

### 9.1 Browser Console
- [ ] No red errors on any page
- [ ] Warnings are minimal/acceptable
- [ ] No failed API calls on every load
- [ ] Network tab shows successful requests

### 9.2 Error Handling
- [ ] Invalid routes show 404 page (not white screen)
- [ ] Missing data shows appropriate empty states
- [ ] API errors show user-friendly messages
- [ ] Error boundaries catch React errors

---

## 10. Production Build Testing

### 10.1 Build Verification
- [ ] `npm run build` completes successfully
- [ ] No build warnings
- [ ] Build output in `apps/web/dist`

### 10.2 Preview Testing
- [ ] `npm run preview` starts successfully
- [ ] All routes work in preview mode
- [ ] No differences from dev mode (except performance)
- [ ] Environment variables work in preview

---

## 11. Final Checklist

### Critical Items
- [ ] All routes accessible
- [ ] No console errors
- [ ] All disclaimers visible
- [ ] Assessment is cocoa-specific
- [ ] Directory is context-first
- [ ] No PII exposed in Farmers First
- [ ] Build completes successfully

### Nice-to-Have
- [ ] Performance is acceptable (< 3s initial load)
- [ ] Mobile responsive (test on mobile device)
- [ ] Accessibility (keyboard navigation works)
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)

---

## Issues Found

Document any issues found during testing:

1. **Issue:** [Description]
   - **Page:** [URL/Route]
   - **Severity:** Critical / Medium / Low
   - **Steps to Reproduce:** [Steps]
   - **Expected:** [Expected behavior]
   - **Actual:** [Actual behavior]

---

## Sign-Off

- [ ] All critical items checked
- [ ] No blocking issues found
- [ ] Ready for production deployment

**Tester Name:** _________________  
**Date:** _________________  
**Status:** ✅ Ready / ⚠️ Issues Found / ❌ Not Ready

---

## Notes

- Test with real data if possible
- Test with empty states (no data)
- Test with edge cases (very long names, special characters)
- Test with slow network (throttle in DevTools)
- Test with different screen sizes


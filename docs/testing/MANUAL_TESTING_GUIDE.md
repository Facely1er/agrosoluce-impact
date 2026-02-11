# Manual Testing Guide - Directory Feature

## Prerequisites
1. Ensure the dev server is running: `npm run dev`
2. The application should be available at `http://localhost:5173`
3. Ensure you have test data in the database (cooperatives with `coop_id` values)

## Test Flow

### 1. Directory Page Navigation ✅
**Steps:**
1. Navigate to `http://localhost:5173/directory`
2. **Expected Result:**
   - Page loads with directory listing
   - Shows stats dashboard (Total, Active, Countries, Crops)
   - Filter options visible (Search, Country, Crop, Pilot, Status)
   - Cooperative cards displayed in grid

**Verification:**
- [ ] Page loads without errors
- [ ] Stats are displayed
- [ ] Cooperative cards are visible
- [ ] Filters are functional

---

### 2. Directory Detail Page ✅
**Steps:**
1. From `/directory`, click on any cooperative card
2. **Expected Result:** Navigate to `/directory/:coop_id`
3. **Verify the following sections are displayed:**

#### a. Identity Section
- [ ] Cooperative name displayed
- [ ] Status badge shown (Active/Inactive/etc.)
- [ ] General Information:
  - [ ] Name
  - [ ] Country (if available)
  - [ ] Region (if available)
  - [ ] Department (if available)
- [ ] Activity Information:
  - [ ] Primary Crop
  - [ ] Source Registry
  - [ ] Creation Date

#### b. Coverage Snapshot Text
- [ ] "Documentation Coverage Snapshot" section visible
- [ ] Coverage description text shows one of:
  - "Limited documentation available" (< 30%)
  - "Partial documentation available" (30-70%)
  - "Substantial documentation available" (> 70%)
- [ ] Text is displayed prominently

#### c. Plain Numbers
- [ ] Three metric boxes displayed:
  - [ ] Required Documents Total (number)
  - [ ] Required Documents Present (number)
  - [ ] Coverage Percentage (number with %)
- [ ] Numbers are clearly visible and formatted

#### d. Disclaimer
- [ ] Disclaimer section visible at bottom
- [ ] Contains disclaimer text about due-diligence
- [ ] Data source information shown
- [ ] Last updated timestamp displayed

**Additional Sections (if data available):**
- [ ] Market Context Snapshot
- [ ] Contextual Information (Risks, Regulatory Context)

---

### 3. Workspace Page ✅
**Steps:**
1. Navigate to `/workspace/:coop_id` (replace `:coop_id` with actual ID)
   - Can navigate directly via URL
   - Or click link from directory detail page if available
2. **Expected Result:**
   - Workspace page loads
   - Header shows "Cooperative Workspace"
   - Four tabs visible: Overview, Evidence, Coverage, Gaps

**Verification:**
- [ ] Page loads without errors
- [ ] All tabs are accessible
- [ ] Cooperative ID is correct in URL

---

### 4. Evidence Tab - Upload & Status ✅
**Steps:**
1. Click on "Evidence" tab in workspace
2. Click "Upload Document" button
3. Fill in the form:
   - Document Type: Select from dropdown (Certification/Policy/Land Evidence/Other)
   - Title: Enter a test title
   - Issuer: (Optional) Enter issuer name
   - Issue Date: (Optional) Select date
   - Expiration Date: (Optional) Select date
   - File: Select a test file (PDF, image, etc.)
4. Click "Upload Document"
5. **Expected Result:**
   - Upload completes successfully
   - Document appears in the documents table
   - Status column shows "Unverified" badge (yellow background)

**Verification:**
- [ ] Upload form appears when clicking button
- [ ] Form can be filled out
- [ ] File can be selected
- [ ] Upload completes without errors
- [ ] Document appears in table
- [ ] Status shows "Unverified" (yellow badge)
- [ ] Document details are correct (title, type, dates)

---

### 5. Coverage Tab - Metrics Update ✅
**Steps:**
1. After uploading evidence in Evidence tab, click "Coverage" tab
2. **Expected Result:**
   - Coverage metrics are displayed
   - Metrics reflect the uploaded evidence

**Verification:**
- [ ] Coverage Summary section shows:
  - [ ] Required Documents Total
  - [ ] Required Documents Present (should increase after upload)
  - [ ] Coverage Percentage (should update)
- [ ] Required Document Types table shows:
  - [ ] Document types listed
  - [ ] Status for each (Present/Missing)
  - [ ] Uploaded document type should show "Present"
- [ ] Click "Refresh" button - metrics should reload

**Note:** If metrics don't update immediately, click Refresh button or navigate away and back.

---

### 6. Gaps Tab - Guidance Display ✅
**Steps:**
1. Click on "Gaps & Guidance" tab
2. **Expected Result:**
   - If gaps exist: Shows missing document types with guidance
   - If no gaps: Shows "No Documentation Gaps" message

**Verification (if gaps exist):**
- [ ] "Current Documentation Gaps" section:
  - [ ] Lists missing document types
  - [ ] Each gap has an icon/indicator
- [ ] "Why This Is Commonly Requested" section:
  - [ ] Each missing doc type has explanation
  - [ ] Text explains why it's requested
- [ ] "Typical Next Steps" section:
  - [ ] Each missing doc type has next steps
  - [ ] Text provides actionable guidance
- [ ] Disclaimer banner at top

**Verification (if no gaps):**
- [ ] Shows "No Documentation Gaps" message
- [ ] CheckCircle icon displayed
- [ ] Message indicates all document types are present

---

### 7. Readiness Snapshot - Create ✅
**Steps:**
1. Go to "Overview" tab in workspace
2. Scroll to "Readiness Status" section
3. Click "Create Snapshot" button
4. **Expected Result:**
   - Snapshot is created
   - Status appears (Not Ready / In Progress / Buyer Ready)
   - Timestamp displayed showing when snapshot was created

**Verification:**
- [ ] Button is clickable
- [ ] Loading state shows "Creating..." while processing
- [ ] After creation:
  - [ ] Status label is displayed (e.g., "Not Ready", "In Progress", "Buyer Ready")
  - [ ] "Last Updated" timestamp is shown
  - [ ] Timestamp format is readable (date and time)
  - [ ] Snapshot reason may be displayed if available

---

### 8. Readiness Snapshot - Update After Coverage Change ✅
**Steps:**
1. Create an initial snapshot (from step 7)
2. Note the current status
3. Change coverage:
   - Option A: Upload a new evidence document (Evidence tab)
   - Option B: Delete an evidence document (Evidence tab)
4. Go back to Overview tab
5. Click "Create Snapshot" again
6. **Expected Result:**
   - New snapshot is created
   - Status may change based on new coverage
   - New timestamp is displayed
   - Snapshot history shows multiple entries

**Verification:**
- [ ] New snapshot created successfully
- [ ] Status may be different from previous (if coverage changed significantly)
- [ ] New timestamp is later than previous
- [ ] "Snapshot History" section shows:
  - [ ] Multiple snapshots listed
  - [ ] Each with status and timestamp
  - [ ] Most recent at top

---

### 9. Export Functionality ✅
**Steps:**
1. In Overview tab, find "Due-Diligence Summary" section
2. Click "Export Summary" button
3. **Expected Result:**
   - JSON file downloads
   - Filename format: `due_diligence_summary_{coop_id}_{timestamp}.json`

**Verification:**
- [ ] Button is clickable
- [ ] Loading state shows "Exporting..." while processing
- [ ] File downloads successfully
- [ ] Open the downloaded JSON file
- [ ] Verify it contains all required sections:
  - [ ] `cooperative_identity` - coop_id, name, country, region, etc.
  - [ ] `market_context_snapshot` - country, risks, regulatory context
  - [ ] `evidence_summary` - total_documents, documents_by_type
  - [ ] `coverage_metrics` - required_docs_total, required_docs_present, coverage_percentage
  - [ ] `documentation_gaps` - missing_doc_types array
  - [ ] `readiness` - readiness_status, snapshot_timestamp, snapshot_reason
  - [ ] `disclaimer` - disclaimer text
  - [ ] `generated_at` - ISO timestamp

**JSON Structure Example:**
```json
{
  "cooperative_identity": { ... },
  "market_context_snapshot": { ... },
  "evidence_summary": { ... },
  "coverage_metrics": { ... },
  "documentation_gaps": { ... },
  "readiness": { ... },
  "disclaimer": "...",
  "generated_at": "2024-..."
}
```

---

### 10. Pilot Assignment ✅
**Steps:**
1. In Overview tab, find "Pilot Information" section
2. Click "Edit" button
3. **Expected Result:**
   - Edit form appears with input fields
   - Current pilot_id and pilot_label are pre-filled (if set)

**Verification:**
- [ ] Edit button is visible
- [ ] Clicking Edit shows form:
  - [ ] Pilot ID input field
  - [ ] Pilot Label input field (optional)
  - [ ] Save button
  - [ ] Cancel button
- [ ] Enter test values:
  - Pilot ID: e.g., "pilot-001"
  - Pilot Label: e.g., "Pilot A"
- [ ] Click "Save"
- [ ] **Expected Result:**
  - [ ] Pilot assignment updates
  - [ ] Form closes
  - [ ] Display shows new pilot information
  - [ ] No errors displayed

**Additional Test:**
- [ ] Click Edit again
- [ ] Clear both fields
- [ ] Click Save
- [ ] Verify pilot is removed (shows "none")

---

### 11. Pilot Dashboard ✅
**Steps:**
1. First, assign at least one cooperative to a pilot_id (from step 10)
2. Navigate to `/pilot/:pilot_id` (replace with actual pilot_id)
   - Can navigate directly via URL
   - Or use pilot filter in directory page
3. **Expected Result:**
   - Pilot dashboard loads
   - Shows pilot label/ID
   - Shows number of cooperatives
   - Aggregate metrics displayed
   - Table with cooperatives listed

**Verification:**
- [ ] Page loads without errors
- [ ] Header shows "Pilot Due-Diligence Snapshot"
- [ ] Pilot information displayed:
  - [ ] Pilot label/ID
  - [ ] Number of cooperatives
- [ ] Aggregate Metrics section shows:
  - [ ] Average Coverage (percentage)
  - [ ] Not Ready (count and percentage)
  - [ ] In Progress (count and percentage)
  - [ ] Buyer Ready (count and percentage)
- [ ] Cooperatives table shows:
  - [ ] Cooperative Name (clickable link to workspace)
  - [ ] Country
  - [ ] Primary Crop
  - [ ] Coverage %
  - [ ] Readiness Status
  - [ ] Last Snapshot (date)
- [ ] All cooperatives assigned to this pilot are listed
- [ ] Metrics match the data in the table
- [ ] Disclaimer section at bottom

**Calculation Verification:**
- [ ] Average Coverage = sum of all coverage percentages / number of cooperatives
- [ ] Not Ready % = (not ready count / total) * 100
- [ ] In Progress % = (in progress count / total) * 100
- [ ] Buyer Ready % = (buyer ready count / total) * 100

---

## Test Scenarios

### Scenario 1: New Cooperative (No Evidence)
1. Navigate to directory detail for a cooperative with no evidence
2. Verify coverage shows 0% or "Limited documentation available"
3. Go to workspace, verify Gaps tab shows all document types as missing
4. Create snapshot - should show "Not Ready"
5. Export - verify gaps array contains all doc types

### Scenario 2: Cooperative with Partial Evidence
1. Upload 1-2 evidence documents
2. Verify coverage updates (should be 30-70% range)
3. Coverage tab should show some "Present" statuses
4. Gaps tab should show remaining missing types
5. Create snapshot - should show "In Progress" or "Not Ready"
6. Export - verify coverage percentage matches

### Scenario 3: Cooperative with Full Evidence
1. Upload evidence for all required document types
2. Verify coverage is 100%
3. Coverage tab shows all "Present"
4. Gaps tab shows "No Documentation Gaps"
5. Create snapshot - should show "Buyer Ready"
6. Export - verify gaps array is empty

### Scenario 4: Pilot with Multiple Cooperatives
1. Assign 3+ cooperatives to same pilot_id
2. Ensure they have different readiness statuses
3. Navigate to pilot dashboard
4. Verify aggregate metrics calculate correctly
5. Verify all cooperatives appear in table
6. Verify links to workspace work

---

## Common Issues & Troubleshooting

### Issue: Coverage metrics don't update after upload
**Solution:** 
- Click Refresh button in Coverage tab
- Navigate away and back to workspace
- Check browser console for errors

### Issue: Snapshot creation fails
**Solution:**
- Ensure cooperative has coverage data
- Check browser console for API errors
- Verify database connection

### Issue: Export doesn't download
**Solution:**
- Check browser download settings
- Verify browser allows downloads
- Check browser console for errors

### Issue: Pilot assignment doesn't save
**Solution:**
- Verify database permissions
- Check browser console for API errors
- Ensure pilot_id format is valid

---

## Test Completion Checklist

- [ ] All 11 test steps completed
- [ ] All verification points checked
- [ ] Test scenarios executed
- [ ] No critical errors encountered
- [ ] All features working as expected
- [ ] Export JSON structure verified
- [ ] Pilot dashboard calculations verified

---

## Notes

- Some features may require database setup (evidence documents, coverage calculations)
- Coverage metrics are computed from evidence documents
- Readiness status is calculated from coverage percentage
- Pilot assignment requires valid pilot_id format
- All timestamps should be in ISO format or readable date format


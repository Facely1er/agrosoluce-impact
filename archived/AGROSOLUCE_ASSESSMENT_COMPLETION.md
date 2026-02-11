# AgroSoluce Assessment – Completion Tasks

## A. Supabase integration
- [ ] Implement `createAssessment(coopId, results)`
- [ ] Persist overall score, section scores, recommendations
- [ ] Persist individual answers in `assessment_responses`
- [ ] Implement `getAssessmentsByCoop(coopId)`
- [ ] Implement `getLatestAssessment(coopId)`

## B. Remove localStorage dependency
- [ ] Use localStorage only as temporary buffer
- [ ] On completion → Supabase is source of truth
- [ ] On reload → fetch from Supabase

## C. Cooperative workspace integration
- [ ] Add Assessment tab to `/workspace/:coop_id`
- [ ] Pass coopId into AssessmentFlow
- [ ] Display latest band + date in Overview tab
- [ ] Show “Self-assessment (not certified)” label

## D. Language & safety
- [ ] Replace “Premium market ready” with non-assertive phrasing
- [ ] Add disclaimer block in ResultsDashboard
- [ ] Ensure no “compliant / approved / certified” terms appear

## E. Verification
- [ ] Run assessment → reload page → assessment still visible
- [ ] Create 2 assessments → latest shown by default
- [ ] Empty coop → no crash, proper empty state

# Farmers First Toolkit & Cooperative Dashboard – Execution TODO

## A. Wire full Farmers First flows (per cooperative)

- [x] Create/verify Supabase tables for:
      - farmers ✅ (exists in migration 002)
      - farmer_declarations ✅ (exists in migration 016)
      - farmer_trainings (or similar) ✅ (training_sessions in migration 008)
      - farmer_value_snapshots (baseline + periodic) ✅ (baseline_measurements, monthly_progress in migration 008)
- [x] Implement CRUD APIs (TS services/hooks) for:
      - getFarmersByCoop(coopId) ✅ (getFarmersByCooperative in farmersApi.ts)
      - createFarmer(coopId, payload) ✅ (createFarmer in farmersApi.ts)
      - recordFarmerDeclaration(farmerId, payload) ✅ (createFarmerDeclaration in farmerDeclarationsApi.ts)
      - recordTrainingEvent(coopId, payload) ✅ (createTrainingSession in trainingApi.ts)
      - recordValueSnapshot(coopId, payload) ✅ (submitMonthlyProgress in valueTrackingApi.ts)
      - getFarmersFirstSummary(coopId) ✅ (created in farmersFirstApi.ts)
- [x] Update `FarmersFirstDashboard`:
      - Use real Supabase hooks/services above ✅
      - Add loading + error + empty states ✅
      - Show:
        - Onboarding coverage tile ✅
        - Declarations coverage tile ✅
        - Training coverage tile ✅
        - Impact vs baseline chart ✅ (via ImpactDashboard component)

## B. Integrate Farmers First into CooperativeWorkspace

- [x] Add `Farmers First` tab to `CooperativeWorkspace` tabs config ✅
- [x] Route handling:
      - Ensure tab state (e.g. query param or local state) selects the right view ✅ (URL params + event listener)
- [x] Inside Farmers First tab:
      - Render `FarmersFirstDashboard` or its core components ✅
- [x] Overview integration:
      - Add "Farmers First Snapshot" card on Overview tab ✅
      - Data from `getFarmersFirstSummary(coopId)` ✅

## C. Sanity checks & UX

- [x] Empty state: Coop with no farmers → show:
      - "No farmers onboarded yet" ✅
      - CTA: "Start onboarding farmers" ✅
- [x] Partial state: Some farmers, no declarations:
      - Show count but highlight "declarations missing" ✅
- [x] At least some data:
      - All tiles show values without console errors ✅

## D. Manual test scenarios

- [ ] Scenario 1 – Fresh cooperative
      - No farmers, no trainings, no declarations
      - Farmers First tab loads with clear empty states
- [ ] Scenario 2 – Onboarded but no training
      - Add 5–10 farmers
      - Dashboard shows onboarding coverage > 0, training = 0
- [ ] Scenario 3 – Training and declarations
      - Record 1–2 training events and declarations
      - Dashboard tiles & overview snapshot reflect updates
- [ ] Scenario 4 – Impact tracking
      - Set baseline + 1 follow-up snapshot
      - Chart shows at least 2 points, no errors
- [ ] Confirm:
      - `/directory/:coop_id` → `/workspace/:coop_id` → Farmers First tab
      - Pilot Dashboard → Cooperative → Farmers First tab

# AgroSoluce Route Map

> Single source of truth for all routes in this repo.
> If a route is not listed here, it should not exist in production.

---

## 0. Entry Points & Apps

| App / Entry | File | Description | Launch Status |
|-------------|------|-------------|---------------|
| Web (main)  | `src/main.tsx` or `apps/web/src/main.tsx` | Primary SPA used for AgroSoluce | ✅ Live / 🚧 In progress |
| (Optional) Admin / Toolkit | `...` | Internal-only tools (if any) | ✅ / 🚧 / ❌ Not for launch |
| Legacy       | `legacy/...` | Archived v1 / experiments | ❌ Not for launch |

---

## 1. Public / Marketplace Routes

Routes visible without auth, for buyers / visitors.

| Path | Purpose | Component / File | Notes | Launch |
|------|---------|------------------|-------|--------|
| `/` | Landing / overview of AgroSoluce | `...` | Hero, EUDR / farmers-first messaging | ✅ |
| `/directory` | Cooperative directory list | `...` | Filters by country / crop / status | ✅ |
| `/directory/:coop_id` | Cooperative detail page | `...` | Identity, coverage, disclaimers | ✅ |
| `/about` | About AgroSoluce (if exists) | `...` | | ✅ / ❌ |
| `/contact` | Contact / pilot interest (if exists) | `...` | | ✅ / ❌ |
| `…` |  |  |  |  |

---

## 2. Cooperative Workspace Routes

Routes used by cooperative admins / internal users.

| Path | Purpose | Component / File | Key Tabs / Features | Launch |
|------|---------|------------------|---------------------|--------|
| `/workspace/:coop_id` | Main cooperative cockpit | `...` | Overview / Coverage / Gaps / Readiness / Assessment / Farmers First | ✅ |
| `/workspace/:coop_id/coverage` (if separate) | Direct link to coverage tab | `...` | | ✅ / ❌ |
| `/workspace/:coop_id/farmers-first` (if separate) | Farmers First dashboard | `...` | Farmers onboarding / training / impact | ✅ / 🚧 |
| `/login` or `/auth/*` (if exists) | Auth entry for workspace | `...` | | ✅ / 🚧 / ❌ |
| `…` |  |  |  |  |

---

## 3. Assessment & Due Diligence Routes

Self-assessment and EUDR/child-labor readiness routes.

| Path | Purpose | Component / File | Notes | Launch |
|------|---------|------------------|-------|--------|
| `/workspace/:coop_id#assessment-tab` or `?tab=assessment` | Coop-scoped assessment embedded in workspace | `CooperativeWorkspace` + `AssessmentFlow` | **Self-assessment, non-certifying** | ✅ |
| `/assessment` (if standalone) | Global assessment page | `...` | Should be coop-scoped or restricted; mark if temporary | 🚧 / ❌ |
| `…` |  |  |  |  |

---

## 4. Farmers First Routes

Farmer-first toolkit & dashboards.

| Path | Purpose | Component / File | Notes | Launch |
|------|---------|------------------|-------|--------|
| `/workspace/:coop_id#farmers-first-tab` or `/cooperative/:coop_id/farmers-first` | Farmers First dashboard | `FarmersFirstDashboard.tsx` or in workspace | Onboarding / training / value tracking | ✅ / 🚧 |
| `/farmers/:farmer_id` (if exists) | Individual farmer view | `...` | Check privacy & exposure before launch | 🚧 / ❌ |
| `…` |  |  |  |  |

---

## 5. Pilot / Buyer / Portfolio Routes

Pilot dashboards, buyer-facing overviews, portfolio views.

| Path | Purpose | Component / File | Notes | Launch |
|------|---------|------------------|-------|--------|
| `/pilot/:pilot_id` | Pilot cohort dashboard | `PilotDashboard.tsx` | List of coops, aggregate metrics | ✅ / 🚧 |
| `/buyer` or `/buyer/portal` | Buyer entry (if exists) | `...` | May be v2 – mark clearly | 🚧 / ❌ |
| `/buyer/matches` | Matching / sourcing view (if exists) | `...` | Ensure no sensitive farmer data shown | 🚧 / ❌ |
| `…` |  |  |  |  |

---

## 6. System / Utility Routes

Health, error pages, misc utilities.

| Path | Purpose | Component / File | Notes | Launch |
|------|---------|------------------|-------|--------|
| `/health` (if exists) | Simple health check page | `...` | Optional, but must not leak secrets | 🚧 / ❌ |
| `/404` or `*` | Not-found handler | `...` | Should exist, even if simple | ✅ |
| `…` |  |  |  |  |

---

## 7. Legacy / Experimental / NOT FOR LAUNCH

Any route that should **never** be reachable in production.

| Path | Purpose | Component / File | Action | Status |
|------|---------|------------------|--------|--------|
| `/dev/*` | Dev / debug screens | `...` | Remove route or behind dev-flag | ❌ |
| `/playground` | UI playground | `...` | Move to `/legacy` | ❌ |
| `/old-dashboard` | Old UI | `...` | Delete or move to `/legacy` | ❌ |
| `…` |  |  |  |  |

---

## 8. Route Ownership & Notes

Who “owns” which surface and what it’s allowed to say.

| Route / Group | Owner | Notes / Guardrails |
|---------------|-------|--------------------|
| Public (`/`, `/directory`, `/directory/:coop_id`) | **Market** | No compliance promises, only “supports due diligence”, “documentation coverage”, “self-reported”. |
| Workspace (`/workspace/:coop_id`) | **Coop / Ops** | Can show more detail, but still no “certified”. |
| Assessment routes | **Risk / Compliance** | Must label as “self-assessment, non-certifying”. |
| Farmers First routes | **Impact / Field** | May show farmer-related metrics; be careful with PII. |
| Pilot/Boyer routes | **Partnerships** | Only aggregated, non-sensitive info. |


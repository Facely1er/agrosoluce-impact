# AgroSoluce v1 – Launch Readiness Checklist (for Cursor + Browser)

Goal:  
Confirm **apps/web** is production-ready for a **cocoa-focused due diligence** v1, with:
- context-first directory (product/region/coverage),
- cocoa-only self-assessment,
- cooperative workspace + farmers-first + pilot dashboard,
- no compliance over-claims.

If any section fails → fix before launch. No exceptions.

---

## 0. Repo & Build Sanity (monorepo, but only web ships)

### 0.1 Root package.json

- [ ] Open `package.json` at repo root.
- [ ] Confirm:
  - [ ] `"workspaces"` includes `"apps/*"` and (optionally) `"packages/*"`.
  - [ ] Scripts point **only** to `apps/web`:

    ```json
    "scripts": {
      "dev:web": "npm run dev --workspace apps/web",
      "build:web": "npm run build --workspace apps/web",
      "preview:web": "npm run preview --workspace apps/web",
      "dev": "npm run dev:web",
      "build": "npm run build:web",
      "preview": "npm run preview:web"
    }
    ```

  - [ ] No script builds legacy or toolkit apps for prod.

### 0.2 apps/web package.json

- [ ] Open `apps/web/package.json`.
- [ ] Confirm:
  - [ ] `"scripts"` use Vite (`vite`, `vite build`, `vite preview`).
  - [ ] Dependencies: `react`, `react-dom`, `react-router-dom`, `@supabase/supabase-js`, etc.
  - [ ] No weird experimental deps that can break builds.

### 0.3 Build commands

In repo root terminal:

- [ ] `npm install` completes successfully.
- [ ] `npm run build` completes with **no errors**.
- [ ] Build output is at `apps/web/dist` (or whatever you configured for deployment).

If build fails → fix before touching anything else.

---

## 1. Routing & Basic Navigation

### 1.1 Route map

- [ ] Confirm `AGROSOLUCE_ROUTE_MAP.md` (or equivalent) exists and matches reality.
- [ ] In code, find router:

  - [ ] Search `createBrowserRouter` or `<Routes>` and list:
    - `/`
    - `/directory`
    - `/directory/:coop_id`
    - `/workspace/:coop_id`
    - `/pilot/:pilot_id` (or equivalent)
    - `*` / 404

- [ ] Ensure **no dev/legacy** routes are reachable in production build (e.g. `/dev`, `/playground`).

### 1.2 Manual click-through (in browser, dev or preview)

- [ ] `/` loads without console errors.
- [ ] From `/`, you can reach:
  - [ ] Directory
  - [ ] At least one cooperative detail
- [ ] Direct URL `/directory/:some_coop_id` works.
- [ ] Direct URL `/workspace/:same_coop_id` works.
- [ ] Direct URL `/pilot/:some_pilot_id` works (if implemented).
- [ ] Invalid route shows a 404 / not-found, not a white screen.

---

## 2. Directory – Product / Region / Coverage First (NOT names)

### 2.1 Filter bar presence

Open `/directory` in dev.

- [ ] At the **top** of the directory page, see a filter section with:
  - [ ] Commodity dropdown (`Cocoa`, `Coffee`, etc. + `All`).
  - [ ] Country dropdown (default `CI` or your main country).
  - [ ] Region dropdown.
  - [ ] Coverage dropdown (`Substantial`, `Partial`, `Limited`, `All`).

If cooperative name search is present, it must be **secondary**, not the main entry.

### 2.2 Default state

- [ ] On initial load:
  - [ ] Commodity default = `Cocoa` (or at least in-scope EUDR commodity).
  - [ ] Country default = `CI` (if that's your starting geography).
  - [ ] Coverage = `All`.

This aligns with *cocoa-first due diligence*.

### 2.3 Filtering actually works

- [ ] Change commodity → `Coffee`: list updates (even if empty, you get a sane empty state).
- [ ] Change coverage → `Substantial`: fewer coops or none; no errors.
- [ ] Change region → some region: list filters correctly.

No red console errors during any of these.

### 2.4 Card contents (context before name)

For each directory result card:

- [ ] First line shows **context**, something like:

  - `COCOA • CI • Nawa`
  - or equivalent product / country / region.

- [ ] Coop name appears **after** that (e.g. `Cooperative: SCOOP-XYZ`).
- [ ] Coverage snippet is shown (even if coarse):

  - `Documentation coverage: Substantial / Partial / Limited / Not available`.

- [ ] There is a link/button:

  - `View cooperative profile →` pointing to `/directory/:coop_id`.

If name is visually dominating everything, you’re drifting toward “co-op phonebook” instead of due diligence → adjust.

---

## 3. Cooperative Detail – Commodities & Coverage + Disclaimers

Open a cooperative profile `/directory/:coop_id`.

### 3.1 Identity & context

- [ ] Name, country, region visible.
- [ ] List of commodities (e.g. `Cocoa, Coffee, Rubber`) visible.

### 3.2 “Commodities & documentation coverage” block

- [ ] There is a section titled something like **“Commodities & documentation coverage”**.
- [ ] For each EUDR commodity in scope:
  - [ ] Shows either:
    - coverage band + % + doc count, **OR**
    - `No documentation submitted` / `Not available`.
- [ ] Cocoa has meaningful data (substantial/partial/limited, not blank).

### 3.3 Disclaimer

In this section or near the bottom:

- [ ] A line similar to:

  > Information may include cooperative self-reported data and does not constitute certification, verification, or regulatory approval.

If this is missing, add it. No launch without this.

---

## 4. Cooperative Workspace – Tabs & Core Flows

Open `/workspace/:coop_id`.

### 4.1 Tabs exist and load

- [ ] Tabs visible:
  - [ ] Overview
  - [ ] Coverage
  - [ ] Gaps
  - [ ] Readiness
  - [ ] Assessment
  - [ ] Farmers First

- [ ] Clicking each tab:
  - [ ] No console errors.
  - [ ] Content loads; no blank white areas.

### 4.2 Evidence upload & coverage impact

On Coverage / Evidence tabs:

- [ ] You can:
  - [ ] Upload or simulate adding an evidence item.
  - [ ] See it appear in a list or table.
- [ ] After adding evidence:
  - [ ] Coverage / gaps update OR are at least logically consistent (no obviously wrong values).
  - [ ] You don’t get any JS errors or “undefined” crashes.

### 4.3 Readiness snapshots

On Readiness tab:

- [ ] Button exists: `Create snapshot` / `Save snapshot` / similar.
- [ ] Clicking it:
  - [ ] Creates a time-stamped record.
  - [ ] If you change coverage and snapshot again, you see **multiple** snapshots (history, not overwrite).
- [ ] No errors in console during snapshot creation.

---

## 5. Assessment – Cocoa-only, Non-Certifying

On `/workspace/:coop_id` → Assessment tab.

### 5.1 Wording

- [ ] Title or heading mentions **Cocoa** explicitly, e.g.:

  - `Cocoa Self-Assessment`
  - `Cocoa Due-Diligence Self-Assessment`

- [ ] In the intro text, you have something like:

  > This self-assessment applies to cocoa supply chains only. It is based on cooperative self-reported information and does not constitute certification, verification, or regulatory approval.

If assessment is labeled generic “EUDR assessment” → fix it.

### 5.2 Behavior

- [ ] You can:
  - [ ] Fill answers or see existing results.
  - [ ] Save or view a result summary.
- [ ] No wording like:
  - “compliant”
  - “certified”
  - “fully EUDR ready”
- [ ] If results are banded (e.g. Low / Medium / High), they’re clearly **internal / self-assessment**, not regulatory.

---

## 6. Farmers First – Aggregated, No PII Exposure

On `/workspace/:coop_id` → Farmers First tab.

### 6.1 Data shown

- [ ] Only aggregated metrics:
  - number of farmers onboarded,
  - number of trainings,
  - participation rates,
  - maybe declarations counts.
- [ ] No individual farmer names, IDs, or directly identifying info on **public** surfaces.

### 6.2 Routing

- [ ] There are **no** public links to `/farmers/:farmer_id` or equivalent in UI.
- [ ] If such routes exist, they are hidden / disabled for v1 or locked behind proper auth.

---

## 7. Pilot Dashboard – Cohort View

Open `/pilot/:pilot_id` (or your pilot route).

- [ ] Page loads with:
  - [ ] Table of cooperatives in pilot.
  - [ ] Aggregate metrics (coverage, readiness, etc.).
- [ ] Each listed coop has a working link back to its workspace or directory detail.
- [ ] No “coming soon” placeholders or broken panels.

If pilot is half-baked, either:
- finish it, or
- hide pilot routes from navigation for v1.

---

## 8. Guardrail Text & Over-Claim Audit

In Cursor, run global searches:

### 8.1 Forbidden / risky words

Search for each of these and review context:

- `compliant`
- `compliance`
- `certified`
- `verification`
- `verified`
- `approved`
- `risk-free`
- `child-labor free`
- `EUDR ready`
- `fully aligned`

- [ ] None of these appears in **user-facing** text in a way that suggests:
  - certification,
  - regulatory approval,
  - risk guarantee.

If they appear in comments or internal docs only, it’s fine.

### 8.2 Required disclaimers

- [ ] Directory page has a global disclaimer.
- [ ] Cooperative detail has at least one disclaimer.
- [ ] Assessment view has a cocoa-specific + non-certifying disclaimer.
- [ ] No page contradicts these disclaimers.

---

## 9. Console & UX Smoke Test

Run `npm run dev`, open in browser.

### 9.1 Flows to test

- [ ] `/` → directory → coop detail → workspace → assessment → readiness → back
- [ ] `/directory` with filters:
  - Cocoa / CI / Substantial
  - Coffee / All / All
- [ ] `/workspace/:coop_id`:
  - add evidence
  - create snapshot
  - open Farmers First
- [ ] `/pilot/:pilot_id` open + drill-down.

### 9.2 Check browser console

- [ ] No red errors on any of the above flows.
- [ ] Warnings are minimal; nothing obviously serious (like failed API calls on every load).

---

## 10. Deployment Sanity

For your actual hosting (Netlify / Vercel):

- [ ] Build command set to: `npm run build:web`
- [ ] Output directory: `apps/web/dist`
- [ ] Environment variables configured:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] Production build preview:
  - [ ] Same critical routes work:
    - `/`
    - `/directory`
    - `/directory/:coop_id`
    - `/workspace/:coop_id`
    - `/pilot/:pilot_id`
  - [ ] No 500s for basic navigation.

If dev works but prod doesn’t → you have build-time or env issues; fix before launch.

---

## Final Go / No-Go

You are ready to launch if and only if:

- [ ] Build is clean.
- [ ] Directory is **context-first** (product/region/coverage), not name-first.
- [ ] Cocoa assessment is scoped, honest, and non-certifying.
- [ ] Workspaces (coverage, gaps, readiness, Farmers First) work without errors.
- [ ] Pilot dashboard is usable or intentionally hidden.
- [ ] No UI text over-claims compliance or EUDR status.

If all boxes are honestly checked → you ship.  
If any unchecked → fix, then re-run the relevant section.


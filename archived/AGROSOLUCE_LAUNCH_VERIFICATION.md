# AGROSOLUCE – PRODUCTION LAUNCH VERIFICATION

This checklist is about **verification**, not intention.  
A box is only checked when you’ve seen it work on the deployed URL.

---

## 1. CORE USER JOURNEYS (NO CRASH, NO LIES)

### 1.1 Marketplace & Directory

- [ ] `/` loads without console errors
- [ ] Global navigation renders (logo, primary menu, footer)
- [ ] “Directory” / “Cooperatives” link goes to the directory page
- [ ] Directory list shows multiple cooperatives
- [ ] Filters (country, crop, status) do NOT break the page (even if they don’t change much yet)
- [ ] Clicking a cooperative card goes to `/directory/:coop_id`

### 1.2 Cooperative Detail (Directory → Detail)

For at least 3 different coops:

- [ ] `/directory/:coop_id` loads without errors
- [ ] Identity shown: name, region/country, crop, basic context
- [ ] Coverage panel shows:
  - a numeric % (or clear “N/A”)
  - a text description (Limited / Partial / Substantial)
  - a disclaimer about documentation, not certification
- [ ] No “undefined”, “NaN”, or broken template strings in UI
- [ ] Child-labor/EUDR context (if present) is **descriptive, not declarative** (“risk signals”, not “compliant”)

### 1.3 Cooperative Workspace (Cockpit)

From `/directory/:coop_id` → open `/workspace/:coop_id`

- [ ] Page renders and uses the correct `coop_id` from the URL
- [ ] Tabs visible:
  - Overview
  - Coverage
  - Gaps
  - Readiness
  - Assessment
  - Farmers First
- [ ] Switching tabs produces **no console errors**

---

## 2. WORKSPACE FEATURES (REAL DATA, NOT MOCKS)

### 2.1 Coverage & Evidence

- [ ] Evidence upload or data-entry flow exists OR clearly disabled with message
- [ ] Adding evidence **changes** coverage metrics (or at minimum, triggers a visible refresh)
- [ ] Coverage numbers align with what’s in Supabase when you query the table manually
- [ ] Coverage labels (Limited / Partial / Substantial) follow your stated thresholds

### 2.2 Gaps

- [ ] Gaps tab lists missing or weak areas (not an empty white screen)
- [ ] Each gap has:
  - a short explanation (“Why this matters” / “Why requested”)
  - a suggested next step
- [ ] No internal identifiers or debug text shown to user

### 2.3 Readiness Snapshots

- [ ] You can create a readiness snapshot for a cooperative
- [ ] Snapshot includes:
  - status/band
  - timestamp
  - possibly a comment/note
- [ ] Creating multiple snapshots:
  - shows a chronological list
  - does NOT overwrite previous entries
- [ ] Readiness panel on Overview shows most recent snapshot only

### 2.4 Assessment (Self-Assessment)

- [ ] Assessment tab loads, scoped to the current `coop_id`
- [ ] You can complete the full assessment without UI blocking or JS errors
- [ ] On submit:
  - results are stored in Supabase (`assessments` + `assessment_responses`)
  - page shows overall score + band
  - recommendations list appears
- [ ] Reloading `/workspace/:coop_id`:
  - Latest assessment appears in Assessment tab
  - Overview shows latest band + date with “Self-assessment (non-certifying)” wording
- [ ] No wording suggests:
  - “certified”
  - “EUDR compliant”
  - “approved”
  - “audited”

### 2.5 Farmers First (Toolkit)

- [ ] Farmers First tab loads without error
- [ ] For at least one coop, you can:
  - register or view farmers
  - see training or engagement items (even if minimal)
- [ ] Empty-state handling:
  - Coop with no farmers → clear guidance, not crash
- [ ] If impact/baseline charts exist:
  - they render even with low/no data
  - no NaN values on screen

---

## 3. PILOT & BUYER VIEWS

### 3.1 Pilot Dashboard

- [ ] `/pilot/:pilot_id` loads
- [ ] Shows:
  - list of cooperatives in that pilot
  - basic metrics per cooperative (coverage, latest readiness, maybe assessment band)
- [ ] Click through to a cooperative workspace from the pilot and back without breaking navigation
- [ ] No personally sensitive farmer data exposed here (high-level cooperative info only)

### 3.2 Buyer-Facing Journey (If Exposed Now)

If you have buyer views separate from coop views:

- [ ] Buyer can:
  - discover cooperatives
  - view non-sensitive summary per cooperative
  - see assessment outputs **without edit controls**
- [ ] All buyer pages use:
  - “self-assessed”, “documentation coverage”, “readiness indicators”
  - NOT “certified”, “compliant”, “approved”

If no buyer-specific UI yet:

- [ ] Confirm no half-broken “for buyers” route is exposed in navigation

---

## 4. DATA & SUPABASE (REALITY CHECK)

### 4.1 Migrations

- [ ] All SQL migrations have been run against the real production Supabase project
- [ ] Tables exist:
  - canonical_cooperatives
  - coverage_metrics
  - readiness_snapshots
  - farmers (+ related farmers_first tables)
  - assessments
  - assessment_responses
  - pilot / cohort tables (if used)
- [ ] A `select count(*)` on `canonical_cooperatives` returns > 0

### 4.2 RLS & Security

If you’re using anon Supabase keys:

- [ ] Row-level security is **enabled** on tables that contain sensitive data (farmers, declarations, assessments if necessary)
- [ ] Policies are not wide-open `true` for everything in production
- [ ] No admin/service keys are exposed in the frontend code or committed repo

### 4.3 Environment Variables

On your deployed environment (Netlify/Vercel/etc):

- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set
- [ ] `VITE_SUPABASE_SCHEMA` is set (if you use custom schema)
- [ ] Build logs show these are present and used (no undefined in console at runtime)

---

## 5. CONTENT, LEGAL & HONESTY

### 5.1 Language & Claims

- [ ] There is **no** use of:
  - “EUDR compliant”
  - “fully compliant”
  - “certified”
  - “guaranteed”
- [ ] Assessment result wording explicitly says:
  - “self-assessment”
  - “non-certifying”
- [ ] Any EUDR/child-labor mention is:
  - “supports due diligence”
  - “helps structure risk awareness”
  - NOT “ensures compliance”

### 5.2 Disclaimers

- [ ] On coverage/assessment panels, a short disclaimer is present, e.g.:
  - “These indicators are based on available information and self-reported data and do not replace independent audits or regulatory checks.”
- [ ] Privacy / data-handling statement is reachable (even if minimal), especially if farmer names or sensitive info might be stored later.

---

## 6. UX, ERRORS & PERFORMANCE

### 6.1 Error Handling

- [ ] When Supabase returns an error (test by temporarily breaking a key):
  - UI shows a user-friendly error message or toast
  - App does **not** crash to blank screen
- [ ] Forms don’t hang endlessly on submit; they either:
  - succeed with confirmation
  - fail with a clear message

### 6.2 Console & Network

On the **deployed** app (not localhost):

- [ ] Browser console is free of:
  - red errors
  - React warnings that indicate unstable keys / memory leaks
- [ ] Network tab:
  - no repeated infinite polling/spam
  - Supabase calls return 2xx for normal flows

### 6.3 Mobile & Layout

- [ ] Core pages (home, directory, coop detail, workspace) are usable on a mobile viewport (no critical layout collapse)
- [ ] No text fully clipped or unreadable on small screens

---

## 7. DEPLOYMENT & OPS

### 7.1 Build & Deploy

- [ ] `npm run build` passes locally
- [ ] Production build passes on Netlify/Vercel (no red build logs)
- [ ] Custom domain (if used) points correctly (HTTPS, not HTTP only)

### 7.2 Logging & Monitoring (Minimal Viable)

- [ ] At least browser console + Supabase logs used manually during early pilot
- [ ] You know where to look if:
  - assessments stop saving
  - coverage metrics stop updating

---

## 8. NICE-TO-HAVE (AFTER STABLE LAUNCH)

These are not launch blockers, but add real value.

- [ ] Simple analytics (page views per key routes, assessments started/completed)
- [ ] JSON export or CSV export for:
  - assessments
  - coverage summaries
- [ ] Read-only “pilot report” view for sharing with trusted buyers/NGOs
- [ ] Basic uptime alert (email or dashboard) for the frontend

---

## FINAL GO / NO-GO QUESTIONS

Before calling this “launched”, honestly answer:

- [ ] Can a cooperative admin go from:
      Home → Directory → Coop detail → Workspace → Assessment → Farmers First
      without hitting a broken or obviously fake screen?
- [ ] If a buyer or NGO saw this today, would you feel **comfortable** explaining:
      - what is real,
      - what is self-reported,
      - and what still requires audits?

If the answer to either is “no”, it’s **not launch-ready** yet. If both are “yes”, you have a legitimate v1 pilot.


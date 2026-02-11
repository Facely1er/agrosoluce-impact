# ⚡ QUICK START CHECKLIST
## Child Labor Monitoring Module - 45 Minute Implementation

**Just copy/paste these Cursor prompts in order!**

---

## ✅ Step 1: Deploy Database (10 min)

**DO MANUALLY IN SUPABASE:**
1. Open https://app.supabase.com
2. SQL Editor > New Query
3. Copy/paste entire `child-labor-monitoring-schema.sql`
4. Click "Run"
5. Verify 5 tables created

---

## ✅ Step 2: Add Types (2 min)

**CURSOR PROMPT:**
```
Copy child-labor-monitoring-types.ts to src/types/

If src/types/ doesn't exist, create it first.

Update tsconfig.json to add path alias:
"@/types": ["./src/types"]
```

---

## ✅ Step 3: Add Service (5 min)

**CURSOR PROMPT:**
```
Create src/services/childLaborService.ts

Copy the complete ChildLaborService class from 
CHILD_LABOR_MONITORING_COMPLETE_PACKAGE.md (section "File 1").

Ensure imports are correct:
- Supabase from '@/lib/supabaseClient'  
- Types from '@/types/child-labor-monitoring-types'
```

---

## ✅ Step 4: Add Dashboard (5 min)

**CURSOR PROMPT:**
```
Copy ChildLaborDashboard.tsx to src/components/compliance/

Install dependencies if needed:
npm install recharts

Create index file for clean imports.
```

---

## ✅ Step 5: Add Route (5 min)

**CURSOR PROMPT:**
```
Update App.tsx to add route:
- Path: /compliance/child-labor
- Component: ChildLaborDashboard
- Protected (requires auth)

Add navigation link:
- Text: "Child Labor Compliance"
- Icon: 👨‍👩‍👧‍👦
- Path: /compliance/child-labor
```

---

## ✅ Step 6: Add Badge to Cooperatives (8 min)

**CURSOR PROMPT:**
```
Create ComplianceBadge component that:
- Takes cooperativeId prop
- Fetches compliance status
- Shows:
  * "✓ Child Labor-Free" (green) if score >= 90
  * "Good" (blue) if 75-89
  * "Fair" (yellow) if 60-74
  * "Needs Improvement" (red) if < 60

Add to CooperativeCard component.
```

---

## ✅ Step 7: Test (5 min)

**MANUAL:**
```bash
npm run dev
```

Navigate to: http://localhost:5173/compliance/child-labor

**Should see:** Empty dashboard (no errors)

---

## ✅ Step 8: Add Sample Data (5 min)

**CURSOR PROMPT:**
```
Generate INSERT statements for 10 sample child labor assessments
with realistic data for Côte d'Ivoire cooperatives.

Include:
- 5 excellent (90-100 score)
- 3 good (75-89 score)  
- 2 fair (60-74 score)

Run in Supabase SQL Editor.
```

---

## 🎉 DONE! You now have:

✅ Working compliance dashboard  
✅ Real-time compliance scoring  
✅ Interactive charts  
✅ Cooperative badges  
✅ Sample data to explore

---

## 🔥 NEXT: Add Assessment Form

**CURSOR PROMPT:**
```
Create AssessmentForm component at:
src/components/compliance/AssessmentForm.tsx

Multi-step form with sections:
1. Basic info (cooperative, dates, assessor)
2. School enrollment data
3. Labor verification
4. Violations
5. Evidence upload

Include validation, auto-save, and success notifications.
Add route: /compliance/assessments/new
```

---

## 📊 NEXT: Add PDF Export

**CURSOR PROMPT:**
```
Add PDF export button to dashboard that generates:
- Compliance overview
- Charts
- Social impact metrics
- Cooperative details

Use react-pdf or jspdf.
```

---

## 📧 NEXT: Add Notifications

**CURSOR PROMPT:**
```
Create email notification system using Supabase Edge Functions:
- Assessment due reminders (30 days before)
- Low compliance alerts (score < 60)
- Violation reports

Integrate with SendGrid or Resend.
```

---

**Total Time:** 45 minutes to working dashboard!  
**Next Features:** 30-60 min each

🚀 **Ready? Start with Step 1!**

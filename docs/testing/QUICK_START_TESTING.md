# Quick Start Testing Guide

**For:** Rapid verification before launch  
**Time:** 10-15 minutes

---

## 🚀 Quick Test Commands

```bash
# 1. Build verification
npm run build

# 2. Start preview server
npm run preview

# 3. Or start dev server
npm run dev
```

---

## ✅ Essential Checks (5 minutes)

### 1. Homepage
- [ ] `/` loads
- [ ] No console errors

### 2. Directory
- [ ] `/directory` loads
- [ ] Filters visible (Commodity, Country, Region, Coverage)
- [ ] Default: Cocoa, CI
- [ ] Cards show context first: `COCOA • CI • Region`
- [ ] Can click to cooperative detail

### 3. Cooperative Detail
- [ ] `/directory/:coop_id` loads
- [ ] "Commodities & Documentation Coverage" section visible
- [ ] Disclaimer present at bottom

### 4. Workspace
- [ ] `/workspace/:coop_id` loads
- [ ] All tabs visible: Overview, Evidence, Coverage, Gaps, Enablement, Farmers First, Assessment
- [ ] Assessment tab shows "Cocoa Self-Assessment"
- [ ] Disclaimer visible in Assessment

### 5. 404 Page
- [ ] `/nonexistent-route` shows 404 page
- [ ] 404 page has navigation links

---

## 🔍 Critical Verification (5 minutes)

### Over-Claim Check
Search pages for these terms (should only appear in disclaimers):
- [ ] "compliant" - OK in disclaimers only
- [ ] "certified" - OK in disclaimers only
- [ ] "verified" - OK in disclaimers only

### Assessment Check
- [ ] Title: "Cocoa Self-Assessment" ✅
- [ ] Disclaimer mentions "cocoa supply chains only" ✅
- [ ] Disclaimer mentions "does not constitute certification" ✅

### Farmers First Check
- [ ] Only aggregated data (no individual names/IDs) ✅

---

## ⚠️ If Issues Found

1. **Build fails:** Check Node version (>=18.0.0)
2. **Routes don't work:** Check environment variables
3. **API errors:** Check Supabase credentials
4. **Console errors:** Check browser console for details

---

## ✅ Ready to Launch?

If all checks pass:
- ✅ Build completes
- ✅ All routes work
- ✅ No console errors
- ✅ Disclaimers present
- ✅ Assessment is cocoa-specific

**Status:** 🟢 **READY FOR PRODUCTION**

---

For detailed testing, see `MANUAL_TESTING_CHECKLIST.md`


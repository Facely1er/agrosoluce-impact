# Database Migration Checklist

## Pre-Migration Checklist

### Environment Setup
- [ ] Supabase project created
- [ ] Database credentials obtained
- [ ] `.env` file created in project root with:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_SCHEMA=agrosoluce`
- [ ] Environment variables tested (can connect to database)

### Dependencies
- [ ] Node.js >= 18.0.0 installed
- [ ] All npm dependencies installed (`npm install`)
- [ ] `@supabase/supabase-js` package available
- [ ] PostgreSQL client installed (optional, for CLI migrations)

### Data Preparation
- [ ] VRAC CSV/PDF files in `VRAC/` directory
- [ ] VRAC data processed (`npm run vrac:process`)
- [ ] `apps/web/public/data/vrac/processed.json` exists and contains data
- [ ] Verify 8 periods of data (check processed.json)

## Schema Migration Checklist

### Option A: New Database (Full Migration)
- [ ] Back up any existing data (if applicable)
- [ ] Run `ALL_MIGRATIONS.sql` to create complete schema
- [ ] Verify `agrosoluce` schema exists
- [ ] Verify all 22+ migrations recorded in `agrosoluce.migrations` table

### Option B: Existing Database (VRAC Only)
- [ ] Verify base schema exists (migrations 001-021)
- [ ] Run `022_create_vrac_tables.sql` migration
- [ ] Verify migration recorded in `agrosoluce.migrations` table

### Post-Schema Verification
- [ ] `agrosoluce.pharmacy_profiles` table exists
- [ ] `agrosoluce.vrac_product_sales` table exists
- [ ] `agrosoluce.vrac_period_aggregates` table exists
- [ ] `agrosoluce.vrac_regional_health_index` table exists
- [ ] Row Level Security (RLS) enabled on all VRAC tables
- [ ] Indexes created for performance
- [ ] Triggers created for updated_at columns

## Data Migration Checklist

### Run Migration Script
- [ ] Environment variables loaded
- [ ] Run `npm run vrac:migrate`
- [ ] Script completes without errors

### Verify Pharmacy Profiles (4 records)
- [ ] Grande Pharmacie de Tanda (tanda, gontougo)
- [ ] Pharmacie Prolife (prolife, gontougo)
- [ ] Pharmacie Olympique (olympique, abidjan)
- [ ] Pharmacie Attobrou (attobrou, la_me)

### Verify Product Sales
- [ ] ~10,000+ product sales records inserted
- [ ] Records span multiple years and periods
- [ ] Product codes, designations, and quantities populated
- [ ] Foreign keys to pharmacy_profiles valid

### Verify Aggregates (8 records)
- [ ] One aggregate per pharmacy per period
- [ ] Total quantities calculated correctly
- [ ] Antimalarial quantities counted
- [ ] Antimalarial share percentages calculated (0-1 range)
- [ ] Antibiotic and analgesic quantities included

### Verify Health Index (8 records)
- [ ] Health index records match aggregates
- [ ] Antimalarial share values consistent
- [ ] All pharmacies represented
- [ ] All periods covered

## Application Integration Checklist

### UI Testing
- [ ] Start dev server (`npm run dev`)
- [ ] Navigate to `/vrac` page
- [ ] Page loads without database errors
- [ ] Pharmacy profiles displayed
- [ ] Charts render with data
- [ ] Year filter works
- [ ] Pharmacy filter works
- [ ] View type toggle (quantity/share) works
- [ ] CSV export works
- [ ] JSON export works

### Data Accuracy
- [ ] Chart values match database aggregates
- [ ] Antimalarial share percentages correct
- [ ] Period labels displayed correctly
- [ ] Pharmacy names and regions correct
- [ ] Trend lines show expected patterns

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Charts render smoothly
- [ ] Filter changes respond quickly
- [ ] No console errors or warnings
- [ ] Network requests complete successfully

## Production Deployment Checklist

### Pre-Deployment
- [ ] All migrations tested in staging environment
- [ ] Data verified in staging database
- [ ] UI tested with staging data
- [ ] Performance benchmarks acceptable
- [ ] Security review completed

### Environment Variables
- [ ] Production Supabase credentials configured
- [ ] Environment variables set in Vercel/deployment platform
- [ ] `.env` file NOT committed to git
- [ ] `.gitignore` includes `.env`

### Build and Deploy
- [ ] Production build succeeds (`npm run build`)
- [ ] No build warnings or errors
- [ ] Static assets include processed VRAC data
- [ ] Application deployed to production
- [ ] Production URL accessible

### Post-Deployment Verification
- [ ] Production site loads
- [ ] `/vrac` page accessible
- [ ] Data displays correctly
- [ ] All features functional
- [ ] No console errors in production
- [ ] Analytics/monitoring configured

## Rollback Plan

### If Migration Fails
1. [ ] Document the specific error
2. [ ] Check migration logs
3. [ ] Restore from backup if needed
4. [ ] Review schema changes
5. [ ] Fix issues and re-run

### If Application Breaks
1. [ ] Revert to previous deployment
2. [ ] Check Supabase connection
3. [ ] Verify environment variables
4. [ ] Review RLS policies
5. [ ] Test with sample queries

## Documentation Updates

- [ ] Update README with VRAC features
- [ ] Document migration procedures
- [ ] Update API documentation
- [ ] Add troubleshooting guide
- [ ] Update changelog

## Sign-Off

### Technical Review
- [ ] Schema reviewed by: _________________ Date: _______
- [ ] Data verified by: _________________ Date: _______
- [ ] Security reviewed by: _________________ Date: _______

### Approval
- [ ] Migration approved by: _________________ Date: _______
- [ ] Ready for production: ☐ Yes ☐ No

---

**Migration Date**: _________________  
**Completed By**: _________________  
**Version**: 022_create_vrac_tables  
**Notes**: _________________________________________________

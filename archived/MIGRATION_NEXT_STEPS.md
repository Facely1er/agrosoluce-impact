# Monorepo Migration - Next Steps

## ✅ Completed

- [x] Monorepo structure created
- [x] Files moved to `apps/web/` and `packages/database/`
- [x] Root `package.json` with workspaces configured
- [x] TypeScript configs updated
- [x] Dependencies installed
- [x] Migration script paths updated

## 🧪 Testing Required

### 1. Test Development Server

```bash
npm run dev:web
```

**Expected:** Dev server starts on `http://localhost:5173`

**If errors occur:**
- Check that all dependencies are installed
- Verify `apps/web/vite.config.ts` paths are correct
- Check `apps/web/tsconfig.json` extends base config correctly

### 2. Test Build

```bash
npm run build:web
```

**Expected:** Build completes successfully, creates `apps/web/dist/` folder

**If errors occur:**
- Check TypeScript errors: `npm run type-check` (if script exists)
- Verify all imports resolve correctly
- Check for missing dependencies

### 3. Verify Routes

Test these key routes in the dev server:
- [ ] `/` - Home page
- [ ] `/directory` - Directory listing
- [ ] `/directory/:coop_id` - Cooperative detail
- [ ] `/workspace/:coop_id` - Workspace
- [ ] `/assessment` - Assessment flow
- [ ] `/cooperative/:id/farmers-first` - Farmers First

### 4. Verify Supabase Connection

- [ ] Check that Supabase client initializes
- [ ] Test a simple query (e.g., load cooperatives)
- [ ] Verify environment variables are set

## 🔧 Deployment Updates

### Vercel Configuration

Update your Vercel project settings:

1. **Root Directory:** `apps/web`
2. **Build Command:** `npm run build:web` (or `npm run build`)
3. **Output Directory:** `dist`
4. **Install Command:** `npm install`

### Netlify Configuration

Update `netlify.toml`:

```toml
[build]
  base = "apps/web"
  command = "npm run build:web"
  publish = "apps/web/dist"
```

### Environment Variables

Ensure these are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SCHEMA` (if using custom schema)

## 📝 Script Updates

Migration scripts have been updated to use new paths:
- `scripts/run-migrations.ts` - Updated to use `packages/database/migrations/`
- `packages/database/package.json` - Scripts reference correct paths

## 🐛 Troubleshooting

### Issue: Module not found errors

**Solution:** 
- Run `npm install` from root
- Check that workspace paths are correct in `package.json`

### Issue: TypeScript path errors

**Solution:**
- Verify `apps/web/tsconfig.json` extends `../../tsconfig.base.json`
- Check that `baseUrl` and `paths` are set correctly

### Issue: Vite can't find files

**Solution:**
- Check `apps/web/vite.config.ts` paths
- Verify `publicDir` is set to `'public'`
- Check that `index.html` is in `apps/web/`

### Issue: Build fails

**Solution:**
- Check for TypeScript errors
- Verify all imports use correct paths
- Check that all dependencies are in `apps/web/package.json`

## 📚 Reference

- `MIGRATION_COMPLETE.md` - Migration summary
- `PHASE0_INVENTORY.md` - Route mapping
- `MONOREPO_STRUCTURE.md` - Structure guide
- `AGROSOLUCE_MONOREPO_TODOS.md` - Detailed checklist

---

**Status:** Ready for testing! 🚀


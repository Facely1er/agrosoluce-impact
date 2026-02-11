# AgroSoluce Mobile App - Deployment Guide

**Status:** ✅ **READY FOR DEPLOYMENT**

---

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New Project"

2. **Import Git Repository**
   - Select your AgroSoluce repository
   - Choose "Import" for the repository

3. **Configure Project Settings**
   - **Root Directory:** `apps/mobile`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)

4. **Environment Variables** (if needed)
   - Add any required environment variables
   - For PWA, usually no env vars needed

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-project.vercel.app`

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Navigate to mobile app directory
cd apps/mobile

# Login to Vercel
vercel login

# Deploy (first time - will ask for configuration)
vercel

# Deploy to production
vercel --prod
```

**Configuration when prompted:**
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No**
- Project name: `agrosoluce-mobile` (or your preferred name)
- Directory: `apps/mobile` (or just `.` if already in the directory)
- Override settings? **No** (uses vercel.json)

---

### Option 3: Deploy from Root (Monorepo)

If deploying from the repository root:

```bash
# From repository root
vercel --cwd apps/mobile
```

Or configure in Vercel Dashboard:
- **Root Directory:** `apps/mobile`
- Vercel will automatically detect `vercel.json` in that directory

---

## 📋 Pre-Deployment Checklist

- [x] ✅ Build completes successfully (`npm run build`)
- [x] ✅ `dist/` folder contains all files
- [x] ✅ `vercel.json` configured correctly
- [x] ✅ PWA manifest and service worker generated
- [x] ✅ All assets included in build

---

## 🔧 Vercel Configuration

The mobile app includes a `vercel.json` with:

- ✅ **SPA Routing:** All routes redirect to `index.html`
- ✅ **PWA Support:** Service worker headers configured
- ✅ **Security Headers:** XSS protection, frame options, etc.
- ✅ **Caching:** Optimized cache headers for assets
- ✅ **Service Worker:** Proper headers for PWA functionality

---

## 🌐 Custom Domain Setup

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Add your custom domain (e.g., `mobile.agrosoluce.com`)
   - Configure DNS as instructed
   - SSL certificate will be provisioned automatically

2. **DNS Configuration:**
   - Add CNAME record pointing to Vercel
   - Wait for DNS propagation (usually 5-10 minutes)

---

## 📱 PWA Installation

Once deployed, users can install the PWA:

### On Mobile Devices:
1. Open the app in mobile browser (Chrome, Safari)
2. Look for "Add to Home Screen" prompt
3. Or use browser menu → "Add to Home Screen"
4. App will install and work offline

### On Desktop:
1. Open in Chrome/Edge
2. Look for install icon in address bar
3. Click to install as desktop app

---

## 🔄 Continuous Deployment

### Automatic Deployments:
- **Production:** Deploys on push to `main` branch
- **Preview:** Deploys on pull requests

### Manual Deployment:
```bash
cd apps/mobile
vercel --prod
```

---

## 📊 Build Output

After successful build, you should see:

```
dist/
├── index.html
├── manifest.webmanifest
├── sw.js (Service Worker)
├── registerSW.js
├── workbox-*.js
└── assets/
    ├── index-*.css
    └── index-*.js
```

**Total Size:** ~180 KB (gzipped: ~53 KB)

---

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (requires >= 18.0.0)
- Run `npm install` in `apps/mobile` directory
- Check for TypeScript errors: `npm run typecheck`

### PWA Not Working
- Verify `manifest.webmanifest` is accessible
- Check service worker is registered (check browser console)
- Ensure HTTPS is enabled (required for PWA)

### Routing Issues
- Verify `vercel.json` has SPA rewrite rules
- Check all routes redirect to `index.html`

### Service Worker Not Updating
- Clear browser cache
- Unregister old service worker in DevTools
- Check `sw.js` has correct headers

---

## 📝 Environment Variables

If you need environment variables (e.g., API keys):

1. **In Vercel Dashboard:**
   - Go to Project → Settings → Environment Variables
   - Add variables for Production, Preview, and Development

2. **In Code:**
   - Use `import.meta.env.VITE_*` for Vite env vars
   - Example: `import.meta.env.VITE_API_URL`

---

## ✅ Post-Deployment Verification

After deployment, verify:

- [ ] App loads correctly
- [ ] All 3 user profiles accessible
- [ ] Role selector works
- [ ] PWA can be installed
- [ ] Service worker registers
- [ ] Offline functionality works
- [ ] All routes work (SPA routing)
- [ ] Assets load correctly

---

## 🔗 Deployment URLs

After deployment, you'll get:

- **Production:** `https://your-project.vercel.app`
- **Preview:** `https://your-project-git-branch.vercel.app`

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [PWA Best Practices](https://web.dev/progressive-web-apps/)

---

**Status:** ✅ **READY TO DEPLOY**

Build completed successfully. Follow the steps above to deploy to Vercel.


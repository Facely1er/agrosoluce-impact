# 🚀 Quick Start - Deploy AgroSoluce to Vercel

## Prerequisites Check

```powershell
# Check if Vercel CLI is installed
vercel --version

# If not installed:
npm install -g vercel
```

## 5-Minute Deployment

### Step 1: Login to Vercel
```powershell
vercel login
```

### Step 2: Setup Project
```powershell
.\setup-vercel-project.ps1
```

**When prompted:**
- Create new project
- Project name: `agrosoluce-marketplace`
- Use default settings (vercel.json will be used)

### Step 3: Configure Environment Variables

Go to [Vercel Dashboard](https://vercel.com/dashboard) → Your Project → Settings → Environment Variables

Add these variables (for Production, Preview, and Development):

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_SUPABASE_SCHEMA=agrosoluce
```

### Step 4: Deploy
```powershell
.\deploy-vercel.ps1
```

### Step 5: Add Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add: `www.agrosoluce.com`
3. Configure DNS as instructed

## That's It! 🎉

Your site will be live at: `https://agrosoluce-marketplace.vercel.app`

## Need Help?

- See `VERCEL_SETUP_GUIDE.md` for detailed instructions
- See `DEPLOYMENT_CHECKLIST.md` for a complete checklist
- See `ENV_TEMPLATE.txt` for environment variable reference


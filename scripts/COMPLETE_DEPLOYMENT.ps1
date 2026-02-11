# AgroSoluce Complete Deployment Script
# This script automates the final deployment steps

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AgroSoluce Complete Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check if npm packages are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Build Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed. Please check errors above." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Build successful" -ForegroundColor Green

# Verify build output
if (Test-Path "dist/agrosoluce/index.html") {
    Write-Host "✓ Build output verified" -ForegroundColor Green
} else {
    Write-Host "✗ Build output not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Database Migration Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if migration file exists
if (Test-Path "database/migrations/ALL_MIGRATIONS.sql") {
    Write-Host "✓ Migration file ready: database/migrations/ALL_MIGRATIONS.sql" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠ ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "   1. Open Supabase Dashboard" -ForegroundColor White
    Write-Host "   2. Go to SQL Editor" -ForegroundColor White
    Write-Host "   3. Open database/migrations/ALL_MIGRATIONS.sql" -ForegroundColor White
    Write-Host "   4. Copy ALL contents and execute in SQL Editor" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "⚠ Migration file not found. Generating..." -ForegroundColor Yellow
    npm run migrate:generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Migration file generated" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Environment Variables Check" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for .env file
if (Test-Path ".env") {
    Write-Host "✓ .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @("VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY", "VITE_SUPABASE_SCHEMA")
    $missingVars = @()
    
    foreach ($var in $requiredVars) {
        if ($envContent -match $var) {
            Write-Host "  ✓ $var configured" -ForegroundColor Green
        } else {
            Write-Host "  ✗ $var missing" -ForegroundColor Red
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠ Missing environment variables. See ENV_TEMPLATE.txt" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ .env file not found" -ForegroundColor Yellow
    Write-Host "   Create .env file with variables from ENV_TEMPLATE.txt" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 4: Vercel Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✓ Vercel CLI installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠ Vercel CLI not installed" -ForegroundColor Yellow
    Write-Host "   Installing Vercel CLI..." -ForegroundColor White
    npm install -g vercel
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install Vercel CLI" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Options" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "  1. Setup Vercel project (first time)" -ForegroundColor White
Write-Host "  2. Deploy to Vercel (production)" -ForegroundColor White
Write-Host "  3. Skip deployment (manual later)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "Setting up Vercel project..." -ForegroundColor Yellow
        npm run setup:vercel
    }
    "2" {
        Write-Host ""
        Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
        npm run deploy
    }
    "3" {
        Write-Host ""
        Write-Host "Skipping deployment. Run 'npm run deploy' when ready." -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice. Skipping deployment." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Build verification complete" -ForegroundColor Green
Write-Host "✓ Project ready for deployment" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Execute database migrations in Supabase SQL Editor" -ForegroundColor White
Write-Host "  2. Migrate cooperative data: npm run migrate:data" -ForegroundColor White
Write-Host "  3. Set environment variables in Vercel dashboard" -ForegroundColor White
Write-Host "  4. Deploy: npm run deploy" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "  - PROJECT_COMPLETION_STATUS.md" -ForegroundColor White
Write-Host "  - DEPLOYMENT_CHECKLIST.md" -ForegroundColor White
Write-Host "  - VERCEL_SETUP_GUIDE.md" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment script complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan


# Vercel Deployment Script for AgroSoluce
# This script helps deploy AgroSoluce to Vercel

Write-Host "=== AgroSoluce Vercel Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    Write-Host "✓ Vercel CLI installed" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✓ Vercel CLI found" -ForegroundColor Green
    Write-Host ""
}

# Check if logged in
Write-Host "Checking Vercel authentication..." -ForegroundColor Yellow
$authStatus = vercel whoami 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Already logged in to Vercel" -ForegroundColor Green
} else {
    Write-Host "⚠ Not logged in. Please authenticate:" -ForegroundColor Yellow
    Write-Host "  Run: vercel login" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will open your browser to authenticate." -ForegroundColor White
    $login = Read-Host "Do you want to login now? (y/n)"
    if ($login -eq "y" -or $login -eq "Y") {
        vercel login
    } else {
        Write-Host "Please run 'vercel login' first, then run this script again." -ForegroundColor Yellow
        exit
    }
}

Write-Host ""
Write-Host "=== Building AgroSoluce ===" -ForegroundColor Cyan
Write-Host "Building project..." -ForegroundColor Yellow

npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Build failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Build successful" -ForegroundColor Green
Write-Host ""

Write-Host "=== Deploying to Vercel ===" -ForegroundColor Cyan
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Verify deployment in Vercel dashboard" -ForegroundColor White
    Write-Host "2. Configure custom domain: www.agrosoluce.com" -ForegroundColor White
    Write-Host "3. Set environment variables in Vercel dashboard:" -ForegroundColor White
    Write-Host "   - VITE_SUPABASE_URL" -ForegroundColor Gray
    Write-Host "   - VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
    Write-Host "   - VITE_SUPABASE_SCHEMA=agrosoluce" -ForegroundColor Gray
} else {
    Write-Host "✗ Deployment failed" -ForegroundColor Red
    exit 1
}


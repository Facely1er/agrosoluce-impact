# PowerShell script to help run database migrations
# This script generates the combined SQL file and provides instructions

Write-Host "🚀 AgroSoluce Database Migration Helper" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if tsx is available
try {
    npx tsx --version | Out-Null
    Write-Host "✅ tsx is available" -ForegroundColor Green
} catch {
    Write-Host "⚠️  tsx not found. Installing..." -ForegroundColor Yellow
    npm install -g tsx
}

Write-Host ""
Write-Host "📝 Generating combined migration file..." -ForegroundColor Cyan
Write-Host ""

# Generate combined SQL file
npx tsx scripts/run-migrations.ts --generate

Write-Host ""
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open your Supabase project dashboard" -ForegroundColor White
Write-Host "2. Navigate to SQL Editor" -ForegroundColor White
Write-Host "3. Open the file: database\migrations\ALL_MIGRATIONS.sql" -ForegroundColor White
Write-Host "4. Copy all contents and paste into SQL Editor" -ForegroundColor White
Write-Host "5. Click 'Run' to execute all migrations" -ForegroundColor White
Write-Host "6. Verify by running: npx tsx scripts/run-migrations.ts --check" -ForegroundColor White
Write-Host ""

# Ask if user wants to check status
$checkStatus = Read-Host "Would you like to check migration status now? (y/n)"
if ($checkStatus -eq 'y' -or $checkStatus -eq 'Y') {
    Write-Host ""
    Write-Host "🔍 Checking migration status..." -ForegroundColor Cyan
    Write-Host ""
    npx tsx scripts/run-migrations.ts --check
}

Write-Host ""
Write-Host "✅ Done!" -ForegroundColor Green


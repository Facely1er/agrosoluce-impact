# PowerShell script to commit and push translation system fixes
# Run this script from the project root directory

Write-Host "=== Committing Translation System Fixes ===" -ForegroundColor Cyan

# Check if git is available
try {
    $gitVersion = git --version
    Write-Host "Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Git is not available in PATH. Please install Git or add it to your PATH." -ForegroundColor Red
    Write-Host "You can download Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Check if we're in a git repository
if (-not (Test-Path .git)) {
    Write-Host "ERROR: Not a git repository. Please initialize git first." -ForegroundColor Red
    exit 1
}

# Show current status
Write-Host "`nChecking git status..." -ForegroundColor Cyan
git status

# Stage all changes
Write-Host "`nStaging all changes..." -ForegroundColor Cyan
git add .

# Show what will be committed
Write-Host "`nFiles to be committed:" -ForegroundColor Cyan
git status --short

# Commit with descriptive message
$commitMessage = @"
fix: Complete translation system implementation

- Added missing translation keys for Navbar (partners, about, more, main, theme, language)
- Added translation keys for HomePage (quickLinks, carousel, heroSubtitle)
- Updated Navbar component to use translation keys instead of hardcoded strings
- Updated HomePage component to use translation keys for all user-facing text
- Improved I18nProvider with better browser environment checks and persistence
- Ensured language preference persists across page navigation
- Fixed mixed translated/untranslated content issues

Translation system is now:
- Complete: All visible strings in Navbar and HomePage are translated
- Consistent: Components use translation system uniformly
- Persistent: Language preference saves to localStorage
- Unified: No mixed translated/untranslated content

Files changed:
- apps/web/src/lib/i18n/translations.ts (added translation keys)
- apps/web/src/components/layout/Navbar.tsx (replaced hardcoded strings)
- apps/web/src/pages/home/HomePage.tsx (replaced hardcoded strings)
- apps/web/src/lib/i18n/I18nProvider.tsx (improved persistence)
"@

Write-Host "`nCommitting changes..." -ForegroundColor Cyan
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nCommit successful!" -ForegroundColor Green
    
    # Push to remote
    Write-Host "`nPushing to remote repository..." -ForegroundColor Cyan
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n=== SUCCESS ===" -ForegroundColor Green
        Write-Host "Changes have been committed and pushed successfully!" -ForegroundColor Green
        Write-Host "`nNext steps:" -ForegroundColor Yellow
        Write-Host "1. Check your Vercel dashboard for automatic deployment" -ForegroundColor White
        Write-Host "2. Verify the build completed successfully" -ForegroundColor White
        Write-Host "3. Test the translation system on the deployed site" -ForegroundColor White
    } else {
        Write-Host "`nERROR: Push failed. Please check your git remote configuration." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`nERROR: Commit failed. Please check the error message above." -ForegroundColor Red
    exit 1
}


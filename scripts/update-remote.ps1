# Script to update the remote repository
# Run this script from the repository root directory

Write-Host "Checking git status..." -ForegroundColor Cyan
git status

Write-Host "`nFetching latest changes from remote..." -ForegroundColor Cyan
git fetch origin

Write-Host "`nChecking for uncommitted changes..." -ForegroundColor Cyan
$status = git status --porcelain
if ($status) {
    Write-Host "Found uncommitted changes. Do you want to commit them? (y/n)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "y" -or $response -eq "Y") {
        Write-Host "`nStaging all changes..." -ForegroundColor Cyan
        git add .
        
        Write-Host "Enter commit message (or press Enter for default):" -ForegroundColor Yellow
        $commitMsg = Read-Host
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "Update repository"
        }
        
        Write-Host "`nCommitting changes..." -ForegroundColor Cyan
        git commit -m $commitMsg
    }
}

Write-Host "`nChecking if local branch is ahead of remote..." -ForegroundColor Cyan
$localCommit = git rev-parse HEAD
$remoteCommit = git rev-parse origin/main 2>$null

if ($LASTEXITCODE -ne 0) {
    Write-Host "Remote branch not found locally. Fetching..." -ForegroundColor Yellow
    git fetch origin
    $remoteCommit = git rev-parse origin/main
}

$commitsAhead = git rev-list --count origin/main..HEAD 2>$null
if ($commitsAhead -gt 0) {
    Write-Host "Local branch is $commitsAhead commit(s) ahead of remote." -ForegroundColor Green
    Write-Host "`nPushing to remote (origin/main)..." -ForegroundColor Cyan
    git push origin main
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ Successfully pushed to remote!" -ForegroundColor Green
    } else {
        Write-Host "`n✗ Push failed. You may need to pull first or resolve conflicts." -ForegroundColor Red
    }
} else {
    Write-Host "Local branch is up to date with remote. No push needed." -ForegroundColor Green
}

Write-Host "`nCurrent branch status:" -ForegroundColor Cyan
git status


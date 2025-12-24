# DigitalOcean Deployment Helper Script for Windows
# Usage: powershell -ExecutionPolicy Bypass -File deploy-digitalocean.ps1

Write-Host "🚀 Future Smile Clinic - DigitalOcean Deployment Helper" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# الخطوة 1: تحديث requirements.txt
Write-Host ""
Write-Host "✅ Step 1: Checking requirements.txt..." -ForegroundColor Cyan

$requirementsPath = "backend/requirements.txt"
$content = Get-Content $requirementsPath -Raw

$packagesNeeded = @(
    ("gunicorn==21.2.0", "gunicorn"),
    ("dj-database-url==2.1.0", "dj-database-url")
)

foreach ($package, $packageName in $packagesNeeded) {
    if ($content -like "*$packageName*") {
        Write-Host "   ✓ $packageName found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Adding $packageName..." -ForegroundColor Yellow
        Add-Content $requirementsPath $package
    }
}

# الخطوة 2: التحقق من .env.example
Write-Host ""
Write-Host "✅ Step 2: Checking .env configuration..." -ForegroundColor Cyan

if (Test-Path "backend/.env.example") {
    Write-Host "   ✓ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ .env.example missing" -ForegroundColor Red
}

# الخطوة 3: التحقق من app.yaml
Write-Host ""
Write-Host "✅ Step 3: Checking app.yaml..." -ForegroundColor Cyan

if (Test-Path "app.yaml") {
    Write-Host "   ✓ app.yaml exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ app.yaml missing" -ForegroundColor Red
}

# الخطوة 4: Git Operations
Write-Host ""
Write-Host "✅ Step 4: Git Operations" -ForegroundColor Cyan

git add -A
git commit -m "feat: Prepare for DigitalOcean deployment"
Write-Host "   ✓ Changes committed" -ForegroundColor Green

git push origin master
Write-Host "   ✓ Changes pushed to master" -ForegroundColor Green

Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ Deployment preparation complete!" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "1. اذهب إلى: https://cloud.digitalocean.com" 
Write-Host "2. اضغط Create → Apps"
Write-Host "3. ربط GitHub و select 'master' branch"
Write-Host "4. اضيف Environment Variables من backend/.env.example"
Write-Host "5. Build Command: pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput"
Write-Host "6. Run Command: gunicorn future_smile.wsgi:application --bind 0.0.0.0:8080"
Write-Host "7. اضغط Deploy"
Write-Host ""
Write-Host "📧 Support: check DIGITALOCEAN_DEPLOYMENT.md" -ForegroundColor Cyan

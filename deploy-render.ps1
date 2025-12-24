# Render.com Deployment Helper Script for Windows
# Usage: powershell -ExecutionPolicy Bypass -File deploy-render.ps1

Write-Host "🚀 Future Smile Clinic - Render Deployment Helper" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# الخطوة 1: التحقق من requirements.txt
Write-Host ""
Write-Host "✅ Step 1: Verifying requirements.txt..." -ForegroundColor Cyan

$requirementsPath = "backend/requirements.txt"
if (Test-Path $requirementsPath) {
    $content = Get-Content $requirementsPath -Raw
    if ($content -like "*gunicorn*") {
        Write-Host "   ✓ gunicorn found" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Adding gunicorn..." -ForegroundColor Yellow
        Add-Content $requirementsPath "gunicorn==21.2.0"
    }
} else {
    Write-Host "   ✗ requirements.txt not found!" -ForegroundColor Red
}

# الخطوة 2: التحقق من render.yaml
Write-Host ""
Write-Host "✅ Step 2: Checking render.yaml..." -ForegroundColor Cyan

if (Test-Path "backend/render.yaml") {
    Write-Host "   ✓ render.yaml exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ render.yaml missing" -ForegroundColor Red
}

# الخطوة 3: التحقق من .env.example
Write-Host ""
Write-Host "✅ Step 3: Checking .env configuration..." -ForegroundColor Cyan

if (Test-Path "backend/.env.example") {
    Write-Host "   ✓ .env.example exists" -ForegroundColor Green
} else {
    Write-Host "   ✗ .env.example missing" -ForegroundColor Red
}

# الخطوة 4: Git Operations
Write-Host ""
Write-Host "✅ Step 4: Git Operations" -ForegroundColor Cyan

Write-Host "   Adding files..." -ForegroundColor Yellow
git add -A

Write-Host "   Committing changes..." -ForegroundColor Yellow
git commit -m "Deploy: Prepare for Render.com deployment"

Write-Host "   Pushing to GitHub..." -ForegroundColor Yellow
git push origin master

Write-Host "   ✓ All changes pushed" -ForegroundColor Green

# الخطوة 5: معلومات الـ Deploy
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "✅ Preparation Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host ""
Write-Host "📋 Next Steps for Render Deployment:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣ Go to: https://render.com"
Write-Host "2️⃣ Sign up with GitHub"
Write-Host ""
Write-Host "3️⃣ Create Web Service:"
Write-Host "   - Click: + New → Web Service"
Write-Host "   - Connect GitHub repo"
Write-Host "   - Select: Future-Smile-Clinic"
Write-Host ""
Write-Host "4️⃣ Configure Service:"
Write-Host "   Name: future-smile-clinic-backend"
Write-Host "   Root Directory: backend"
Write-Host "   Runtime: Python 3.11"
Write-Host "   Region: Frankfurt"
Write-Host ""
Write-Host "5️⃣ Build & Start Commands:"
Write-Host "   Build: pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput"
Write-Host "   Start: gunicorn future_smile.wsgi:application --bind 0.0.0.0:`$PORT"
Write-Host ""
Write-Host "6️⃣ Add Environment Variables:"
Write-Host "   DEBUG = False"
Write-Host "   SECRET_KEY = (generate one)"
Write-Host "   ALLOWED_HOSTS = .onrender.com"
Write-Host "   CORS_ALLOWED_ORIGINS = https://future-smile-clinic.vercel.app"
Write-Host ""
Write-Host "7️⃣ Create PostgreSQL Database:"
Write-Host "   - Click: + New → PostgreSQL"
Write-Host "   - Select: Free plan"
Write-Host "   - Copy DATABASE_URL"
Write-Host "   - Add to Web Service Environment"
Write-Host ""
Write-Host "8️⃣ After Deployment:"
Write-Host "   - Copy Backend URL"
Write-Host "   - Update Frontend API URL in src/lib/api.ts"
Write-Host "   - Commit & push changes"
Write-Host ""
Write-Host "📚 Full guide in: RENDER_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Everything is ready! Start deploying on Render!" -ForegroundColor Green

# ========================================
# تشغيل Frontend (Next.js)
# ========================================

Write-Host "🚀 تشغيل موقع ابتسامة المستقبل..." -ForegroundColor Cyan
Write-Host ""

# تثبيت المكتبات إذا لم تكن مثبتة
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 تثبيت المكتبات..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# تشغيل الخادم التطويري
Write-Host "✨ تشغيل الخادم..." -ForegroundColor Green
Write-Host ""
Write-Host "الموقع متاح على: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Dashboard متاح على: http://localhost:3000/dashboard" -ForegroundColor Cyan
Write-Host ""
Write-Host "اضغط Ctrl+C لإيقاف الخادم" -ForegroundColor Yellow
Write-Host ""

npm run dev

# ========================================
# تشغيل Backend (Django)
# ========================================

Write-Host "🚀 تشغيل Backend API..." -ForegroundColor Cyan
Write-Host ""

# الانتقال لمجلد backend
Set-Location backend

# تحقق من وجود البيئة الافتراضية
if (-Not (Test-Path "venv")) {
    Write-Host "📦 إنشاء البيئة الافتراضية..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host ""
}

# تفعيل البيئة الافتراضية
Write-Host "✨ تفعيل البيئة الافتراضية..." -ForegroundColor Green
.\venv\Scripts\Activate.ps1

# تثبيت المكتبات إذا لم تكن مثبتة
if (-Not (Test-Path "venv\Lib\site-packages\django")) {
    Write-Host "📦 تثبيت المكتبات..." -ForegroundColor Yellow
    pip install -r requirements.txt
    Write-Host ""
}

# إنشاء قاعدة البيانات إذا لم تكن موجودة
if (-Not (Test-Path "db.sqlite3")) {
    Write-Host "🗄️ إنشاء قاعدة البيانات..." -ForegroundColor Yellow
    python manage.py makemigrations
    python manage.py migrate
    Write-Host ""
    
    Write-Host "👤 يرجى إنشاء مستخدم admin:" -ForegroundColor Yellow
    python manage.py createsuperuser
    Write-Host ""
}

# تشغيل الخادم
Write-Host "✨ تشغيل الخادم..." -ForegroundColor Green
Write-Host ""
Write-Host "API متاح على: http://localhost:8000/api/" -ForegroundColor Cyan
Write-Host "Admin Panel متاح على: http://localhost:8000/admin/" -ForegroundColor Cyan
Write-Host ""
Write-Host "اضغط Ctrl+C لإيقاف الخادم" -ForegroundColor Yellow
Write-Host ""

python manage.py runserver

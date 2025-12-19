# 🚀 دليل النشر Production Deployment Guide

## Future Smile Clinic - خطوات النشر الكاملة

---

## 📋 المتطلبات الأساسية

- حساب GitHub
- حساب Vercel (للـ Frontend)
- حساب Railway أو Render (للـ Backend)
- معرفة أساسية بـ Git

---

## 🎯 الجزء الأول: نشر Backend على Railway

### 1. تحضير الكود

```bash
cd backend
```

تأكد من وجود الملفات التالية:

- ✅ `Procfile`
- ✅ `runtime.txt`
- ✅ `requirements.txt` (مع gunicorn, whitenoise, psycopg2-binary)

### 2. إنشاء مشروع على Railway

1. اذهب إلى [railway.app](https://railway.app)
2. سجل دخول باستخدام GitHub
3. انقر على "New Project"
4. اختر "Deploy from GitHub repo"
5. اختر repository الخاص بك

### 3. تكوين متغيرات البيئة

في Railway Dashboard، أضف المتغيرات التالية:

```env
SECRET_KEY=قم-بتوليد-مفتاح-سري-قوي-هنا
DEBUG=False
ALLOWED_HOSTS=your-app-name.railway.app
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**لتوليد SECRET_KEY قوي:**

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. إضافة PostgreSQL Database

1. في Railway Dashboard، انقر على "New"
2. اختر "Database" → "PostgreSQL"
3. Railway سيقوم بربطها تلقائياً وإنشاء `DATABASE_URL`

### 5. تطبيق Migrations

في Railway Terminal:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic --noinput
```

### 6. الحصول على رابط Backend

بعد النشر، ستحصل على رابط مثل:

```
https://your-app-name.railway.app
```

احفظ هذا الرابط لاستخدامه في Frontend.

---

## 🎨 الجزء الثاني: نشر Frontend على Vercel

### 1. تحضير الكود

```bash
cd ..  # العودة للمجلد الرئيسي
```

### 2. تحديث `.env.production`

عدّل الملف `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app/api
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### 3. رفع الكود على GitHub

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 4. نشر على Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول باستخدام GitHub
3. انقر على "New Project"
4. استورد repository الخاص بك
5. Vercel سيكتشف Next.js تلقائياً

### 5. تكوين Environment Variables في Vercel

في Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.railway.app/api
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

### 6. Deploy

انقر على "Deploy" وانتظر اكتمال البناء (2-3 دقائق).

---

## 🔗 الجزء الثالث: الربط النهائي

### 1. تحديث CORS في Backend

بعد الحصول على رابط Vercel، عد إلى Railway:

**في Environment Variables:**

```env
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
ALLOWED_HOSTS=your-backend.railway.app,localhost
```

### 2. تحديث API URL في Frontend

إذا تغير رابط Backend، حدّث Environment Variables في Vercel:

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
```

### 3. Redeploy

- في Railway: سيتم إعادة النشر تلقائياً
- في Vercel: انقر "Redeploy" في Deployments tab

---

## ✅ الاختبار النهائي

### اختبر الميزات التالية:

- [ ] الصفحة الرئيسية تعمل
- [ ] الصور تحمّل بشكل صحيح
- [ ] تسجيل الدخول يعمل
- [ ] Dashboard يعمل
- [ ] CRUD Operations (إضافة/تعديل/حذف)
- [ ] PDF Reports تعمل
- [ ] نظام الإشعارات (Toast) يعمل
- [ ] الصور من Backend تظهر
- [ ] SEO و Sitemap يعملان

---

## 🔒 أمان إضافي (اختياري)

### 1. تفعيل Custom Domain

**في Vercel:**

1. Settings → Domains
2. أضف domain الخاص بك
3. اتبع تعليمات DNS

**في Railway:**

1. Settings → Domains
2. أضف custom domain

### 2. SSL Certificates

- Vercel: تلقائي ✅
- Railway: تلقائي ✅

### 3. Rate Limiting

أضف إلى `settings.py`:

```python
# في requirements.txt
django-ratelimit>=4.1.0

# في settings.py
RATELIMIT_ENABLE = not DEBUG
```

---

## 🐛 استكشاف الأخطاء

### مشكلة: Frontend لا يتصل بـ Backend

**الحل:**

1. تأكد من CORS_ALLOWED_ORIGINS في Backend
2. تحقق من NEXT_PUBLIC_API_URL في Frontend
3. افتح Developer Console وابحث عن أخطاء CORS

### مشكلة: Static Files لا تعمل

**الحل:**

```bash
python manage.py collectstatic --noinput
```

### مشكلة: Database Migration Errors

**الحل:**

```bash
python manage.py migrate --run-syncdb
```

### مشكلة: 502 Bad Gateway

**الحل:**

- تأكد من Procfile صحيح
- تحقق من Railway logs
- تأكد من gunicorn مثبت في requirements.txt

---

## 📊 Monitoring

### Backend Logs (Railway)

```bash
# في Railway Dashboard
View Logs → Select Service
```

### Frontend Logs (Vercel)

```bash
# في Vercel Dashboard
Deployments → Select Deployment → View Function Logs
```

---

## 🔄 تحديثات مستقبلية

عند إجراء تعديلات على الكود:

```bash
git add .
git commit -m "Your update message"
git push origin main
```

- Railway: سيتم النشر تلقائياً
- Vercel: سيتم النشر تلقائياً

---

## 📞 الدعم

إذا واجهت مشاكل:

1. تحقق من Logs في Railway/Vercel
2. تأكد من Environment Variables
3. تحقق من CORS Settings
4. راجع Django settings.py

---

## 🎉 تهانينا!

تطبيقك الآن منشور ويعمل في Production! 🚀

**روابط مفيدة:**

- Frontend: https://your-project.vercel.app
- Backend: https://your-backend.railway.app
- Admin Panel: https://your-backend.railway.app/admin

---

**ملاحظة:** احفظ جميع البيانات الحساسة (SECRET_KEY, DATABASE_URL) بشكل آمن ولا تشاركها مع أحد.

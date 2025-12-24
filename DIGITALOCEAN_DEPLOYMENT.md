# DigitalOcean Deployment Guide

## الخطوة 1: إعداد حساب DigitalOcean

1. اذهب إلى: https://education.github.com/pack
2. ابحث عن **DigitalOcean**
3. اضغط **"Claim"**
4. سجّل بـ GitHub student account
5. احصل على **$50 credit** مجاني

---

## الخطوة 2: إنشاء PostgreSQL Database

1. في DigitalOcean Dashboard
2. اضغط **"Create"** → **"Databases"**
3. اختر **PostgreSQL** (Version 14+)
4. اختر region قريب (مثل Belgium)
5. اختر **Single Node** (كافي للـ development)
6. اضغط **"Create Database Cluster"**

### احفظ بيانات Database:
```
Host: xxxxx.db.ondigitalocean.com
Port: 25060
Database: defaultdb
User: doadmin
Password: xxxxxxxxxxxxxxxxx
```

**DATABASE_URL:**
```
postgresql://doadmin:password@host:25060/defaultdb?sslmode=require
```

---

## الخطوة 3: إنشاء App

1. في Dashboard، اضغط **"Create"** → **"Apps"**
2. اختر **"GitHub"**
3. اربط repository: `Future-Smile-Clinic`
4. اختر **branch: master**
5. اختر **source directory: backend**
6. اضغط **"Next"**

---

## الخطوة 4: إضافة Environment Variables

في **App Settings** → **Environment Variables**:

```
DEBUG=False
SECRET_KEY=[جديد من python manage.py shell]
DATABASE_URL=postgresql://doadmin:password@host:25060/defaultdb?sslmode=require
ALLOWED_HOSTS=localhost,127.0.0.1,*.ondigitalocean.app,your-domain.com
CORS_ALLOWED_ORIGINS=https://future-smile-clinic-production.vercel.app,http://localhost:3000
CSRF_TRUSTED_ORIGINS=https://*.ondigitalocean.app,https://future-smile-clinic-production.vercel.app
```

---

## الخطوة 5: Configure Build و Run Commands

في **App Settings** → **Components**:

### Build Command:
```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

### Run Command:
```bash
gunicorn future_smile.wsgi:application --bind 0.0.0.0:8080
```

### Source Directory:
```
backend
```

---

## الخطوة 6: Deploy

1. اضغط **"Review"**
2. تحقق من الإعدادات
3. اضغط **"Create Resources"**
4. انتظر الـ deployment (5-10 دقائق)

---

## الخطوة 7: احصل على Backend URL

بعد الـ deployment الناجح:

```
Backend URL: https://future-smile-clinic-backend-xxxxx.ondigitalocean.app/api
```

---

## الخطوة 8: تحديث Frontend

حدّث الـ API URL في Frontend:

**src/lib/api.ts:**
```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://future-smile-clinic-backend-xxxxx.ondigitalocean.app/api";
```

**أو أضيف في .env.local:**
```
NEXT_PUBLIC_API_URL=https://future-smile-clinic-backend-xxxxx.ondigitalocean.app/api
```

---

## الخطوة 9: إنشاء Admin User

عند أول deployment:

```bash
# في terminal:
doctl apps logs <app-id>

# أو زيارة مباشرة:
https://future-smile-clinic-backend-xxxxx.ondigitalocean.app/admin/
```

---

## 📊 التكلفة

| الخدمة | السعر |
|--------|------|
| App (Backend) | مجاني |
| PostgreSQL Database | $15/شهر (مجاني أول سنة) |
| **Total** | **مجاني للسنة الأولى** |

---

## 🔧 Troubleshooting

### 1. Database Connection Error
```bash
# تحقق من DATABASE_URL
# جرب الـ SSL:
postgresql://user:password@host:25060/dbname?sslmode=require
```

### 2. Static Files Not Loading
```bash
# تأكد من:
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATIC_URL = 'static/'
```

### 3. CORS Error
```python
# في settings.py:
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend-domain.com',
]
```

---

## 🚀 Next Steps

1. **Domain Custom:**
   - استخدم Namecheap domain من Student Pack
   - أضيف CNAME record إلى DigitalOcean

2. **SSL Certificate:**
   - DigitalOcean توفر SSL automatically

3. **Monitoring:**
   - استخدم DigitalOcean App Metrics
   - Setup alerts للـ CPU/Memory

---

**عند أي مشكلة، شُف DigitalOcean logs!** 📋

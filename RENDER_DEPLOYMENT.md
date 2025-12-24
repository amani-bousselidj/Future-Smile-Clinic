# Render Deployment Guide

## 🚀 Deploy Django على Render.com (مجاني 100%)

---

## 📋 الخطوة 1: إنشاء حساب Render

```
1. اذهب: https://render.com
2. اضغط "Sign Up"
3. اختر "Continue with GitHub"
4. Authorize rendering-io
5. Done! ✅
```

---

## 🌐 الخطوة 2: إنشاء Web Service

### **في Render Dashboard:**

```
1. اضغط "+ New"
2. اختر "Web Service"
3. ربط GitHub account
4. ابحث عن: Future-Smile-Clinic
5. اضغط "Connect"
```

---

## ⚙️ الخطوة 3: إعدادات Service

### **ملأ النموذج هكذا:**

```
📝 Name:
   future-smile-clinic-backend

📁 Root Directory:
   backend

🐍 Environment:
   Python 3.11

🌍 Region:
   Frankfurt (EU-Central)

🔗 Branch:
   master

Instance Type:
   Free
```

**اضغط "Next"**

---

## 🏗️ الخطوة 4: Build و Start Commands

### **في الحقول التالية:**

**Build Command:**

```bash
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

**Start Command:**

```bash
gunicorn future_smile.wsgi:application --bind 0.0.0.0:$PORT
```

**اضغط "Next"**

---

## 🔐 الخطوة 5: متغيرات البيئة (Environment Variables)

### **اضغط "Add Environment Variable" وأضيف:**

```
① DEBUG
   False

② SECRET_KEY
   django-insecure-8j_s!@q^#8zx$5#9k!j@^#$%^&*()_+-=[]{}|;:,.<>?

③ ALLOWED_HOSTS
   .onrender.com

④ CORS_ALLOWED_ORIGINS
   https://future-smile-clinic.vercel.app,http://localhost:3000

⑤ CSRF_TRUSTED_ORIGINS
   https://.onrender.com,https://future-smile-clinic.vercel.app
```

**اضغط "Create Web Service"**

---

## 📊 الخطوة 6: انتظر الـ Deploy

```
شاشة البناء ستظهر:
↓
"Building your service..."
↓
بعد 2-5 دقائق: "Live ✓"
↓
Done! ✅
```

---

## 🗄️ الخطوة 7: إنشاء PostgreSQL Database

### **عند ما ينتهي Web Service:**

```
1. من Render Dashboard → اضغط "+ New"
2. اختر "PostgreSQL"
3. ملأ:

   Name:
   future-smile-clinic-db

   Database:
   clinic

   User:
   admin

   Region:
   Frankfurt

   Plan:
   Free

4. اضغط "Create Database"
```

---

## 📋 الخطوة 8: ربط Database مع Web Service

### **بعد إنشاء Database:**

```
1. اذهب لصفحة Database
2. ابحث عن: "Internal Database URL"
3. Copy الـ URL الكامل
```

**مثال:**

```
postgresql://admin:xyz123abc@dpg-xxxxx.onrender.com:5432/clinic
```

### **ثم:**

```
1. اذهب للـ Web Service
2. اضغط "Environment"
3. اضغط "Add Environment Variable"
4. أضيف:

   DATABASE_URL
   postgresql://admin:xyz123abc@dpg-xxxxx.onrender.com:5432/clinic?sslmode=require

5. اضغط "Save"
6. الخدمة ستعاد تشغيل تلقائياً
```

---

## 🌐 الخطوة 9: احصل على Backend URL

### **في Web Service page:**

ستشوف شيء مثل:

```
https://future-smile-clinic-backend-xxxx.onrender.com
```

**Backend API URL:**

```
https://future-smile-clinic-backend-xxxx.onrender.com/api
```

---

## 📝 الخطوة 10: تحديث Frontend

### **في الـ Frontend Repository:**

**`src/lib/api.ts`:**

ابحث عن هذا السطر:

```typescript
const API_BASE_URL =
  "https://future-smile-clinic-production.up.railway.app/api";
```

غيّره لـ:

```typescript
const API_BASE_URL =
  "https://future-smile-clinic-backend-xxxx.onrender.com/api";
```

(استبدل `xxxx` بـ الأرقام من URL الفعلي)

### **أو أستخدم .env:**

**`.env.local`:**

```
NEXT_PUBLIC_API_URL=https://future-smile-clinic-backend-xxxx.onrender.com/api
```

**في `src/lib/api.ts`:**

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://...";
```

---

## 🚀 الخطوة 11: Push الـ Changes

```powershell
cd "path/to/project"
git add .
git commit -m "Update API URL to Render backend"
git push origin master
```

Vercel ستعيد بناء الـ Frontend تلقائياً.

---

## ✅ تحقق من الاتصال

### **في المتصفح:**

```
https://future-smile-clinic.vercel.app/dashboard
↓
جرب تسجيل دخول
↓
إذا اشتغل → كل شيء تمام! ✅
```

---

## 📊 المقارنة:

| الميزة             | Render   | Railway    |
| ------------------ | -------- | ---------- |
| **مجاني**          | ✅ 100%  | ⚠️ محدود   |
| **بدون بطاقة**     | ✅       | ✅         |
| **Database مجاني** | ✅       | ❌         |
| **الأداء**         | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## ⚡ نقاط مهمة:

✅ **مجاني 100%** - بدون بطاقة ائتمان
✅ **PostgreSQL مجاني** - شامل
✅ **750 ساعة/شهر** - يكفي لـ 24/7
✅ **Auto deployment** - من GitHub
✅ **HTTPS تلقائي** - آمن

⚠️ **الحدود:**

- Service واحد مجاني
- Database واحد مجاني
- Sleep بعد 15 دقيقة عدم استخدام (يصحو بسرعة)

---

## 🔧 Troubleshooting

### **مشكلة: CORS Error**

**الحل:**

```python
# في settings.py
CORS_ALLOWED_ORIGINS = [
    'https://future-smile-clinic.vercel.app',
]
```

### **مشكلة: Database Connection Failed**

**الحل:**

```
1. تحقق من DATABASE_URL
2. أضيف: ?sslmode=require في النهاية
3. أعد تشغيل الخدمة
```

### **مشكلة: Static files not loading**

**الحل:**

```bash
python manage.py collectstatic --noinput
```

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Django Docs:** https://docs.djangoproject.com
- **Vercel Docs:** https://vercel.com/docs

---

**Done! Backend جاهز على Render! 🚀**

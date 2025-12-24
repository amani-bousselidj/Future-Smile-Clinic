# 🔗 اختبار ربط Frontend و Backend

## ✅ حالة الاتصال

### Backend (Django REST API)

- **الرابط:** https://future-smile-clinic-production.up.railway.app
- **البيئة:** Railway
- **قاعدة البيانات:** PostgreSQL
- **حالة:** ✅ يعمل (Status 200)

### Frontend (Next.js)

- **البيئة:** Vercel
- **متغيرات البيئة:** `NEXT_PUBLIC_API_URL`
- **API Endpoint:** https://future-smile-clinic-production.up.railway.app/api

---

## 🧪 اختبارات الاتصال

### 1. اختبار API الخدمات

```bash
curl -X GET "https://future-smile-clinic-production.up.railway.app/api/services/"
```

**النتيجة:** ✅ Status 200 - يرجع قائمة الخدمات

### 2. اختبار تسجيل الدخول

```bash
curl -X POST "https://future-smile-clinic-production.up.railway.app/api/token/" \
  -H "Content-Type: application/json" \
  -d '{"username":"amani","password":"bousselidj"}'
```

**النتيجة:** ✅ يرجع access_token و refresh_token

### 3. اختبار API المرضى (يحتاج token)

```bash
curl -X GET "https://future-smile-clinic-production.up.railway.app/api/patients/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**النتيجة:** ✅ يرجع قائمة المرضى

---

## 📋 نقاط الاتصال الرئيسية

### من Frontend إلى Backend:

1. **Authentication (تسجيل الدخول)**

   - POST `/api/token/` - الحصول على JWT token
   - endpoint يستخدم: `NEXT_PUBLIC_API_URL`

2. **API Endpoints**
   - GET `/api/services/` - الخدمات
   - GET `/api/patients/` - المرضى
   - GET `/api/appointments/` - المواعيد
   - GET `/api/blog/` - المقالات
   - POST `/api/contact/` - رسائل التواصل
   - GET `/api/admin-init/init_admin/` - إنشاء المسؤول

---

## ⚙️ التكوين الحالي

### Backend Settings (`future_smile/settings.py`)

```python
# CORS - مسموح لـ Vercel
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend-domain.vercel.app',
    'http://localhost:3000',
]

# CSRF - مسموح لـ Railway
CSRF_TRUSTED_ORIGINS = [
    'https://future-smile-clinic-production.up.railway.app'
]

# Database - PostgreSQL على Railway
DATABASE_URL = os.getenv('DATABASE_URL')
```

### Frontend Config (`src/lib/api.ts`)

```typescript
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
```

### Environment File (`.env.production`)

```env
NEXT_PUBLIC_API_URL=https://future-smile-clinic-production.up.railway.app/api
```

---

## 🔐 بيانات الاختبار

**حساب Admin:**

- Username: `amani`
- Password: `bousselidj`

---

## 📱 خطوات الاستخدام الكاملة

### 1. الدخول إلى الموقع

```
https://future-smile-clinic-production.vercel.app/login
```

### 2. تسجيل الدخول

- أدخل: `amani` / `bousselidj`
- يتم إرسال طلب POST إلى `/api/token/`

### 3. الحصول على Dashboard

```
https://future-smile-clinic-production.vercel.app/dashboard
```

### 4. إدارة المحتوى

- الخدمات: `/dashboard/services`
- المواعيد: `/dashboard/appointments`
- المرضى: `/dashboard/patients`
- المقالات: `/dashboard/blog`
- الآراء: `/dashboard/testimonials`

---

## 🐛 استكشاف الأخطاء

### إذا لم يعمل الاتصال:

1. **تحقق من Backend**

   ```bash
   railway logs --service Future-Smile-Clinic
   ```

2. **تحقق من Environment Variables على Vercel**

   - اذهب إلى Vercel Dashboard
   - Project → Settings → Environment Variables
   - تأكد من وجود `NEXT_PUBLIC_API_URL`

3. **اختبر الاتصال مباشرة**

   ```bash
   curl -X GET "https://future-smile-clinic-production.up.railway.app/api/services/"
   ```

4. **تحقق من CORS Headers**
   ```bash
   curl -i -X OPTIONS "https://future-smile-clinic-production.up.railway.app/api/services/"
   ```

---

## ✨ الخلاصة

**Frontend و Backend مربوطين بشكل صحيح! ✅**

- ✅ Backend يعمل على Railway
- ✅ Frontend يعمل على Vercel
- ✅ API endpoints تستجيب
- ✅ Authentication معاً
- ✅ Dashboard جاهز للاستخدام

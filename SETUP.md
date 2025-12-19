# تعليمات التشغيل السريع - Future Smile Clinic

## 🚀 البدء السريع

### 1️⃣ تشغيل Frontend (Next.js)

افتح terminal في مجلد المشروع الرئيسي:

```powershell
# تثبيت المكتبات (مرة واحدة فقط)
npm install

# تشغيل الموقع
npm run dev
```

افتح المتصفح على: **http://localhost:3000**

---

### 2️⃣ تشغيل Backend (Django)

افتح terminal جديد:

```powershell
# الانتقال لمجلد backend
cd backend

# إنشاء البيئة الافتراضية (مرة واحدة فقط)
python -m venv venv

# تفعيل البيئة الافتراضية
.\venv\Scripts\activate

# تثبيت المكتبات (مرة واحدة فقط)
pip install -r requirements.txt

# إنشاء قاعدة البيانات (مرة واحدة فقط)
python manage.py makemigrations
python manage.py migrate

# إنشاء مستخدم admin (مرة واحدة فقط)
python manage.py createsuperuser
# سيطلب منك إدخال:
# - Username: admin
# - Email: admin@example.com
# - Password: (اختر كلمة مرور)

# تشغيل الخادم
python manage.py runserver
```

افتح المتصفح على:

- **API:** http://localhost:8000/api/
- **Admin Panel:** http://localhost:8000/admin/

---

## 📱 الصفحات المتاحة

### الموقع الرئيسي:

- **الرئيسية:** http://localhost:3000/
- **من نحن:** http://localhost:3000/about
- **الخدمات:** http://localhost:3000/services
- **حجز موعد:** http://localhost:3000/appointment
- **تواصل معنا:** http://localhost:3000/contact
- **المقالات:** http://localhost:3000/blog

### لوحة التحكم:

- **Dashboard:** http://localhost:3000/dashboard

---

## ⚙️ نصائح مهمة

### في حالة مواجهة مشاكل:

1. **Frontend لا يعمل:**

   ```powershell
   # احذف المجلدات وأعد التثبيت
   Remove-Item -Recurse -Force node_modules, .next
   npm install
   npm run dev
   ```

2. **Backend لا يعمل:**

   ```powershell
   # تأكد من تفعيل البيئة الافتراضية
   .\venv\Scripts\activate

   # أعد إنشاء قاعدة البيانات
   python manage.py flush
   python manage.py migrate
   ```

3. **Port مشغول:**
   - Frontend: غير Port في package.json
   - Backend: استخدم `python manage.py runserver 8001`

---

## 🎯 للبناء للإنتاج (Production)

### Frontend:

```powershell
npm run build
npm start
```

### Backend:

```powershell
# في settings.py غير:
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']

# استخدم Gunicorn
pip install gunicorn
gunicorn future_smile.wsgi:application
```

---

## 📊 ملء البيانات التجريبية

بعد تشغيل Backend، ادخل على Admin Panel:

1. اذهب إلى http://localhost:8000/admin/
2. سجل دخول بحساب admin
3. أضف بيانات تجريبية:
   - خدمات (Services)
   - مرضى (Patients)
   - حجوزات (Appointments)
   - آراء (Testimonials)
   - مقالات (Blog Posts)

---

✅ **الآن الموقع جاهز بالكامل!**

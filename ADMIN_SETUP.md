# Admin Setup Instructions

## Step 1: Initialize Admin User

يجب أولاً التأكد من أن الـ admin user موجود على Render. استخدم هذا الـ endpoint:

```
POST https://future-smile-clinic.onrender.com/api/admin/init/
```

في Postman أو من browser console:

```javascript
fetch("https://future-smile-clinic.onrender.com/api/admin/init/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((r) => r.json())
  .then((d) => console.log(d));
```

**التوقع:** رسالة تقول إما "Admin user created" أو "Admin user updated"

---

## Step 2: Verify Admin Exists

```
GET https://future-smile-clinic.onrender.com/api/admin/init/
```

أو من console:

```javascript
fetch("https://future-smile-clinic.onrender.com/api/admin/init/")
  .then((r) => r.json())
  .then((d) => console.log(d));
```

**التوقع:** `{ "exists": true, "username": "amani", ... }`

---

## Step 3: Login to Django Admin

بعد التأكد من وجود الـ admin:

https://future-smile-clinic.onrender.com/admin/

استخدم:

- **Username:** amani
- **Password:** bousselidj

---

## Troubleshooting

### إذا كان الـ endpoint غير موجود:

الانتظار 2-3 دقائق لـ Render rebuilding

### إذا كان الـ admin لم يتم إنشاؤه:

استخدم الـ SSH في Render console:

```bash
python manage.py shell
```

ثم في الـ shell:

```python
from django.contrib.auth.models import User
User.objects.create_superuser('amani', 'amani@example.com', 'bousselidj')
```

---

## API Endpoints Available

- **POST** `/api/admin/init/` - إنشاء/تحديث admin
- **GET** `/api/admin/init/` - التحقق من وجود admin
- **POST** `/api/admin/check/` - فحص عدد الـ admins
- **POST** `/api/admin/login/` - تسجيل الدخول والحصول على JWT token
- **POST** `/api/admin/create/` - إنشاء admin جديد (بديل)

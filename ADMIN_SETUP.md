# Admin Setup Instructions

## Step 1: Create/Reset Production Admin (Recommended)

بدلاً من صفحات login العامة، تسجيل دخول الأدمن يتم عبر `/api/admin/token/` (staff-only).
لإنشاء/تحديث أدمن على Render بشكل آمن، استخدم:

- **Endpoint:**
  - `POST https://future-smile-clinic.onrender.com/api/admin/bootstrap/`
- **Header (required):**
  - `X-Bootstrap-Token: <ADMIN_BOOTSTRAP_TOKEN>`
    - هذا التوكن يجب ضبطه كـ Environment Variable على Render باسم `ADMIN_BOOTSTRAP_TOKEN`
- **Body (JSON):**
  - `username` (required)
  - `password` (required)
  - `email` (optional)

مثال (PowerShell):

```powershell
$token = "YOUR_BOOTSTRAP_TOKEN"
$body = @{ username = "admin"; password = "CHANGE_ME_STRONG"; email = "admin@futuresmile.local" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://future-smile-clinic.onrender.com/api/admin/bootstrap/" -Method Post -ContentType "application/json" -Headers @{ "X-Bootstrap-Token" = $token } -Body $body
```

---

## Step 2: Login

بعد التأكد من وجود الـ admin:

https://future-smile-clinic.onrender.com/admin/

استخدم:

- **Username:** amani
- **Password:** bousselidj

ملاحظة: البيانات أعلاه قد تكون قديمة. استخدم البيانات التي وضعتها في bootstrap.

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

- **POST** `/api/admin/bootstrap/` - إنشاء/تحديث أدمن (يتطلب `X-Bootstrap-Token`)
- **POST** `/api/admin/token/` - الحصول على JWT للأدمن (staff-only)
- **POST** `/api/token/refresh/` - تجديد JWT

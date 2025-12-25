# Vercel Environment Variables Configuration

## المشكلة

الـ Frontend يستخدم Railway URL القديمة:

```
https://future-smile-clinic-production.up.railway.app
```

بدلاً من Render:

```
https://future-smile-clinic.onrender.com
```

## الحل

### الخطوة 1: اذهب إلى Vercel Dashboard

https://vercel.com/amani-bousselidj/future-smile-clinic/settings/environment-variables

### الخطوة 2: ابحث عن NEXT_PUBLIC_API_URL

إذا كانت موجودة:

- اضغط Edit
- غيّر القيمة إلى: `https://future-smile-clinic.onrender.com/api`
- اضغط Save

إذا لم تكن موجودة:

- اضغط "Add New"
- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://future-smile-clinic.onrender.com/api`
- اختار: Production
- اضغط Add

### الخطوة 3: Redeploy

- اذهب إلى https://vercel.com/amani-bousselidj/future-smile-clinic/deployments
- اضغط على آخر deployment
- اضغط "Redeploy"

### الخطوة 4: انتظر الـ Build

- استنتظر حتى ينتهي الـ build (2-3 دقائق)
- تحقق من Console لـ تأكيد عدم وجود errors

---

## التحقق

بعد الـ redeploy، جرب:

```javascript
// في browser console
fetch("https://future-smile-clinic.onrender.com/api/services/")
  .then((r) => r.json())
  .then((d) => console.log(d));
```

يجب أن ترجع البيانات بدون 401 error!

# Django Admin Access Guide

## 🔐 Admin Panel URL:

```
https://future-smile-clinic.onrender.com/admin/
```

---

## 📝 Login Credentials:

### **Username:**

```
amani
```

### **Password:**

```
bousselidj
```

⚠️ **Note:** Both fields are case-sensitive (صغار الأحرف)

---

## ✅ If Login Still Fails:

### **Option 1: Check Render Logs**

1. Go to Render Dashboard
2. Select `future-smile-clinic-backend`
3. Go to "Logs"
4. Look for `init_admin` output
5. Check for any errors

### **Option 2: Manual Admin Creation**

```bash
# If you have Render access, run in terminal:
python manage.py init_admin

# Or create manually:
python manage.py createsuperuser
```

### **Option 3: Reset Admin User**

```bash
# Delete and recreate:
python manage.py shell
>>> from django.contrib.auth.models import User
>>> User.objects.filter(username='amani').delete()
>>> User.objects.create_superuser('amani', 'amani@example.com', 'bousselidj')
>>> exit()
```

---

## 🎯 Features in Admin Panel:

✅ **Users Management** - Add/edit/delete admin users
✅ **Services** - Manage clinic services
✅ **Appointments** - View and manage bookings
✅ **Patients** - Patient database
✅ **Blog Posts** - Create and publish articles
✅ **Testimonials** - Manage reviews
✅ **Permissions** - Control user access levels

---

## 🔒 Security Tips:

1. **Change Password** after first login
2. **Create staff accounts** for your team
3. **Set proper permissions** for each user
4. **Enable 2FA** (if available in future)
5. **Backup database** regularly

---

## 🆘 Troubleshooting:

| Problem                     | Solution                                |
| --------------------------- | --------------------------------------- |
| **Credentials not working** | Check Render logs for init_admin errors |
| **Page won't load**         | Check ALLOWED_HOSTS in settings         |
| **CSRF error**              | Clear browser cache and cookies         |
| **Database not found**      | Check DATABASE_URL in Render env vars   |

---

## 📞 Support:

- Check `RENDER_DEPLOYMENT.md` for deployment issues
- Check `RENDER_IMPLEMENTATION.md` for general setup
- View Render logs for detailed error messages

---

**Happy admin managing!** 🏥👨‍💼

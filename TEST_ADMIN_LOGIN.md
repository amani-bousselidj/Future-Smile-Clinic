# Testing Admin Login API

## New Admin Login Endpoints

لقد أضفنا 3 endpoints جديدة لـ admin login بدلاً من الـ Django admin panel:

### 1. Check if Admin Exists

```bash
POST https://future-smile-clinic.onrender.com/api/admin/check/
```

**Response:**

```json
{
  "admin_exists": true,
  "admin_count": 1,
  "message": "Admin user exists"
}
```

### 2. Create Admin User (Only if None Exists)

```bash
POST https://future-smile-clinic.onrender.com/api/admin/create/

Body:
{
  "username": "amani",
  "password": "bousselidj",
  "email": "amani@example.com"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Admin user created successfully",
  "user": {
    "id": 1,
    "username": "amani",
    "email": "amani@example.com"
  }
}
```

**Response (400 Bad Request - if admin exists):**

```json
{
  "error": "Admin user already exists",
  "message": "Cannot create another admin"
}
```

### 3. Admin Login

```bash
POST https://future-smile-clinic.onrender.com/api/admin/login/

Body:
{
  "username": "amani",
  "password": "bousselidj"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "amani",
    "email": "amani@example.com",
    "is_staff": true,
    "is_superuser": true
  },
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Error Response (401):**

```json
{
  "error": "Invalid credentials"
}
```

---

## Test Steps

### Step 1: Check Admin Exists

```bash
curl -X POST https://future-smile-clinic.onrender.com/api/admin/check/
```

### Step 2: If Admin Doesn't Exist, Create It

```bash
curl -X POST https://future-smile-clinic.onrender.com/api/admin/create/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "amani",
    "password": "bousselidj",
    "email": "amani@example.com"
  }'
```

### Step 3: Login with Credentials

```bash
curl -X POST https://future-smile-clinic.onrender.com/api/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "amani",
    "password": "bousselidj"
  }'
```

### Step 4: Use Access Token

The access token returned in Step 3 can be used to make authenticated API calls:

```bash
curl -X GET https://future-smile-clinic.onrender.com/api/patients/ \
  -H "Authorization: Bearer <access_token_from_step_3>"
```

---

## Testing with Postman

1. **Check Admin:**

   - Method: POST
   - URL: `https://future-smile-clinic.onrender.com/api/admin/check/`
   - Body: None

2. **Create Admin:**

   - Method: POST
   - URL: `https://future-smile-clinic.onrender.com/api/admin/create/`
   - Body (JSON):
     ```json
     {
       "username": "amani",
       "password": "bousselidj",
       "email": "amani@example.com"
     }
     ```

3. **Login:**
   - Method: POST
   - URL: `https://future-smile-clinic.onrender.com/api/admin/login/`
   - Body (JSON):
     ```json
     {
       "username": "amani",
       "password": "bousselidj"
     }
     ```

---

## Files Changed

1. **Created:** `backend/clinic/views_admin.py`

   - Contains 3 new endpoints for admin authentication
   - Uses DRF's `@api_view` decorator
   - Generates JWT tokens for authenticated users

2. **Modified:** `backend/clinic/urls.py`

   - Added imports for the new endpoints
   - Added 3 new URL patterns for admin operations

3. **Modified:** `backend/release.sh`
   - Changed from calling `init_admin` command
   - Now directly creates admin user in Django shell
   - Checks if admin exists before creating
   - More robust error handling

---

## Next Steps After Push

1. Wait for Render to rebuild and deploy
2. Check Render logs to confirm release.sh ran successfully
3. Call `/api/admin/check/` to verify admin user was created
4. Call `/api/admin/login/` with credentials to get JWT token
5. Use JWT token for authenticated API calls

---

## If This Still Doesn't Work

If the admin user is still not being created:

1. SSH into Render container
2. Run: `python manage.py shell`
3. Execute:
   ```python
   from django.contrib.auth.models import User
   User.objects.create_superuser('amani', 'amani@example.com', 'bousselidj')
   ```
4. Exit and test login again

---

## Benefits of This Approach

✅ Bypasses Django admin panel issues  
✅ Uses proper JWT authentication  
✅ Works with frontend authentication system  
✅ Cleaner error messages  
✅ Can be called from frontend dashboard  
✅ No CSRF issues with AJAX requests  
✅ Standard REST API format

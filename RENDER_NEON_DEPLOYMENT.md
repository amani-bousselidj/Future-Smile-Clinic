# Deploy Backend on Render + Neon Postgres (Django)

This guide deploys the **Django REST API** (folder: `backend/`) to **Render** using **Neon** for PostgreSQL.

## 0) Prereqs

- A Neon account + a Postgres database created.
- A Render account.
- Your GitHub repo connected to Render.

## 1) Create Neon database and get `DATABASE_URL`

1. In Neon, create a project + database.
2. Copy the connection string (it looks like):

`postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require`

This is your **`DATABASE_URL`**.

## 2) Render: create a Web Service (backend)

In Render dashboard:

1. **New** → **Web Service**
2. Connect the GitHub repository.
3. Settings:
   - **Root Directory**: `backend`
   - **Environment**: `Python`
   - **Build Command**:
     - `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**:
     - `gunicorn future_smile.wsgi:application --bind 0.0.0.0:$PORT`

Notes:
- Render automatically provides the `$PORT` environment variable.
- `collectstatic` writes to `backend/staticfiles/` and WhiteNoise serves it.

## 3) Render: environment variables (Required)

In the Render service → **Environment** add:

- `SECRET_KEY` = a long random secret
- `DEBUG` = `False`
- `DATABASE_URL` = (paste from Neon)
- `ALLOWED_HOSTS` = `YOUR-SERVICE.onrender.com`

Recommended (helps admin + cross-site POSTs):
- `CSRF_TRUSTED_ORIGINS` = `https://YOUR-SERVICE.onrender.com,https://future-smile-clinic.vercel.app`
- `CORS_ALLOWED_ORIGINS` = `https://future-smile-clinic.vercel.app,http://localhost:3000`

Render also exposes `RENDER_EXTERNAL_HOSTNAME` automatically; the app will add it to `ALLOWED_HOSTS`.

## 4) First deploy checklist

After the first deploy succeeds:

### 4.1 Run migrations (already in build command)

We run:
- `python manage.py migrate`

### 4.2 Create admin user (one time)

From Render → Shell:

- `python manage.py createsuperuser`

### 4.3 Verify API is live

Open in a browser:

- `https://YOUR-SERVICE.onrender.com/api/`

Try creating an appointment (example JSON):

```json
{
  "patient_name": "Test User",
  "patient_phone": "+201000000000",
  "service_id": 1,
  "appointment_date": "2026-01-07",
  "appointment_time": "10:30",
  "notes": "Render+Neon test"
}
```

POST to:

- `https://YOUR-SERVICE.onrender.com/api/appointments/`

You should get **201** with a JSON response including `booking_id`.

## 5) Frontend: point to Render backend

Set your frontend environment variable (Vercel or local):

- `NEXT_PUBLIC_API_URL=https://YOUR-SERVICE.onrender.com`

(or whatever your frontend uses as the base API URL).

## 6) Common issues

- **DisallowedHost**: ensure `ALLOWED_HOSTS` includes `YOUR-SERVICE.onrender.com`.
- **Static 404**: ensure build command runs `python manage.py collectstatic --noinput`.
- **Database connection errors**: re-check Neon `DATABASE_URL` and make sure it includes `sslmode=require`.
- **CORS errors**: update `CORS_ALLOWED_ORIGINS` to include your frontend domain.

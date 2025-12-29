# Deployment Guide - Future Smile Clinic

Complete guide for deploying the application to production.

## 🚀 Quick Start

### Option 1: Vercel + Render (Recommended)

**Frontend on Vercel** + **Backend on Render** (both auto-deploy on git push)

### Option 2: Docker Compose (Development)

**Local full-stack setup** with Docker containers

---

## 📦 Vercel Deployment (Frontend)

### 1. Connect GitHub Repository

```bash
# In Vercel Dashboard:
# 1. Click "Add New" → "Project"
# 2. Select "GitHub" and authorize
# 3. Import "Future-Smile-Clinic" repository
# 4. Click "Import"
```

### 2. Configure Environment Variables

In Vercel Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.onrender.com
NEXT_PUBLIC_SITE_URL=https://future-smile-clinic.vercel.app
```

### 3. Deploy

```bash
# Automatic deployment on git push
git push origin master

# Or manually trigger in Vercel dashboard
# Dashboard → Deployments → "Redeploy"
```

### Verification

```
✅ Frontend: https://future-smile-clinic.vercel.app
✅ Auto-redeploy on git push
✅ Environment variables loaded
✅ API calls to backend
```

---

## 🖥️ Render Deployment (Backend)

### 1. Create PostgreSQL Database

```bash
# In Render Dashboard:
# 1. Click "New +" → "PostgreSQL"
# 2. Name: "future-smile-clinic-db"
# 3. Database: "clinic"
# 4. Click "Create Database"
# 5. Note the DATABASE_URL
```

### 2. Deploy Web Service

```bash
# In Render Dashboard:
# 1. Click "New +" → "Web Service"
# 2. Select GitHub repository
# 3. Configure:
```

**Settings**:

```
Name: future-smile-clinic-api
Runtime: Python 3.10
Build Command: pip install -r backend/requirements.txt
Start Command: gunicorn future_smile.wsgi:application --bind 0.0.0.0:$PORT
```

**Environment Variables**:

```
DEBUG=False
SECRET_KEY=<generate-strong-key>
DATABASE_URL=<from-postgres-db-above>
ALLOWED_HOSTS=future-smile-clinic-api.onrender.com
CORS_ALLOWED_ORIGINS=https://future-smile-clinic.vercel.app
```

### 3. Run Migrations

```bash
# After deployment, in Render Dashboard:
# 1. Go to Web Service → "Shell"
# 2. Run:

python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py seed_initial_data
```

### Verification

```
✅ API: https://your-backend-domain.onrender.com/api/
✅ Admin: https://your-backend-domain.onrender.com/admin/
✅ Database connected
✅ CORS configured
✅ Static files served
```

---

## 🐳 Docker Compose Deployment (Local/Development)

### 1. Prerequisites

```bash
# Install Docker and Docker Compose
docker --version  # Should be 20+
docker-compose --version  # Should be 1.29+
```

### 2. Create docker-compose.yml

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: clinic
      POSTGRES_USER: clinic
      POSTGRES_PASSWORD: clinic_password_123
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U clinic"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    command: >
      sh -c "python backend/manage.py migrate &&
             python backend/manage.py createsuperuser --noinput &&
             gunicorn future_smile.wsgi:application --bind 0.0.0.0:8000"
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    environment:
      DEBUG: "True"
      SECRET_KEY: dev-secret-key-change-in-production
      DATABASE_URL: postgresql://clinic:clinic_password_123@postgres:5432/clinic
      ALLOWED_HOSTS: localhost,127.0.0.1
    depends_on:
      postgres:
        condition: service_healthy

  frontend:
    image: node:18-alpine
    working_dir: /app
    command: npm run dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://backend:8000
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 3. Create Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "future_smile.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### 4. Run Containers

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 5. Access Services

```
Frontend: http://localhost:3000
Backend API: http://localhost:8000/api/
Admin: http://localhost:8000/admin/
Database: localhost:5432
```

---

## 🔒 Production Checklist

### Frontend (Vercel)

- [ ] Domain configured
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Auto-deploy on git push
- [ ] Analytics configured
- [ ] Error tracking (Sentry optional)

### Backend (Render)

- [ ] Domain configured
- [ ] PostgreSQL database created
- [ ] Environment variables set
- [ ] DEBUG = False
- [ ] SECRET_KEY rotated (use secrets generator)
- [ ] Migrations run
- [ ] Superuser created
- [ ] CORS whitelist configured for frontend domain
- [ ] ALLOWED_HOSTS updated
- [ ] Static files collected
- [ ] Error logging configured

### Security

- [ ] All secrets in environment variables
- [ ] No credentials in git
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Database backups enabled
- [ ] Firewall rules configured

---

## 🔧 Maintenance

### Backup Database

```bash
# Using Render CLI
render get database future-smile-clinic-db \
  --output=backup-$(date +%Y%m%d).sql
```

### Update Dependencies

```bash
# Frontend
npm update
npm audit fix

# Backend
pip list --outdated
pip install --upgrade package-name
pip freeze > backend/requirements.txt

# Commit and push
git add .
git commit -m "chore: update dependencies"
git push origin master
```

### Scale Application

**Increase Dynos (Render)**:

- In Render Dashboard → Web Service → Plan
- Upgrade to higher tier
- Auto-scales with traffic

---

## 🚨 Troubleshooting

### Deployment Fails

**Frontend**:

```bash
# Check build logs in Vercel dashboard
# Common issues:
# - npm run build fails → check next.config.mjs
# - Env vars not set → add to Vercel dashboard
# - Port conflict → use PORT=3000 in commands
```

**Backend**:

```bash
# Check logs in Render dashboard
# Common issues:
# - Migration fails → reset database and retry
# - Static files missing → run collectstatic
# - Import errors → check requirements.txt
```

### Database Connection

```bash
# Test PostgreSQL connection
psql -h your-db-host -U clinic -d clinic

# Reset migrations (development only)
python backend/manage.py migrate clinic zero
python backend/manage.py migrate
```

### CORS Issues

```bash
# Check backend settings
python backend/manage.py shell
>>> from django.conf import settings
>>> print(settings.CORS_ALLOWED_ORIGINS)

# Should include frontend domain
```

---

## 📊 Monitoring

### Error Tracking (Optional)

```bash
# Install Sentry SDK
pip install sentry-sdk

# Configure in settings.py
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

### Logs

**Vercel**: Dashboard → Deployments → Logs  
**Render**: Dashboard → Logs  
**Local**: `docker-compose logs -f`

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [master]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 18
      - run: npm install
      - run: npm run lint
      - run: npm run build

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Django Docs**: https://docs.djangoproject.com
- **Next.js Docs**: https://nextjs.org/docs

---

**Last Updated**: December 2024  
**Status**: Production Ready ✅

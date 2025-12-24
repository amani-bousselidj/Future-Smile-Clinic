#!/bin/bash

# Render.com Deployment Helper Script
# Usage: bash deploy-render.sh

echo "🚀 Future Smile Clinic - Render Deployment Helper"
echo "================================================"

# الخطوة 1: التحقق من requirements.txt
echo ""
echo "✅ Step 1: Verifying requirements.txt..."
if grep -q "gunicorn" backend/requirements.txt; then
    echo "   ✓ gunicorn found"
else
    echo "   ✗ Adding gunicorn..."
    echo "gunicorn==21.2.0" >> backend/requirements.txt
fi

# الخطوة 2: التحقق من render.yaml
echo ""
echo "✅ Step 2: Checking render.yaml..."
if [ -f backend/render.yaml ]; then
    echo "   ✓ render.yaml exists"
else
    echo "   ✗ render.yaml missing"
fi

# الخطوة 3: التحقق من .env.example
echo ""
echo "✅ Step 3: Checking .env configuration..."
if [ -f backend/.env.example ]; then
    echo "   ✓ .env.example exists"
else
    echo "   ✗ .env.example missing"
fi

# الخطوة 4: Git Operations
echo ""
echo "✅ Step 4: Git Operations"
echo "   Adding files..."
git add -A

echo "   Committing changes..."
git commit -m "Deploy: Prepare for Render.com deployment"

echo "   Pushing to GitHub..."
git push origin master

echo "   ✓ All changes pushed"

# معلومات الـ Deploy
echo ""
echo "================================================"
echo "✅ Preparation Complete!"
echo "================================================"

echo ""
echo "📋 Next Steps for Render Deployment:"
echo ""
echo "1️⃣ Go to: https://render.com"
echo "2️⃣ Sign up with GitHub"
echo ""
echo "3️⃣ Create Web Service:"
echo "   - Click: + New → Web Service"
echo "   - Connect GitHub repo"
echo "   - Select: Future-Smile-Clinic"
echo ""
echo "4️⃣ Configure Service:"
echo "   Name: future-smile-clinic-backend"
echo "   Root Directory: backend"
echo "   Runtime: Python 3.11"
echo "   Region: Frankfurt"
echo ""
echo "5️⃣ Build & Start Commands:"
echo "   Build: pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput"
echo "   Start: gunicorn future_smile.wsgi:application --bind 0.0.0.0:\$PORT"
echo ""
echo "6️⃣ Add Environment Variables:"
echo "   DEBUG = False"
echo "   SECRET_KEY = (generate one)"
echo "   ALLOWED_HOSTS = .onrender.com"
echo "   CORS_ALLOWED_ORIGINS = https://future-smile-clinic.vercel.app"
echo ""
echo "7️⃣ Create PostgreSQL Database:"
echo "   - Click: + New → PostgreSQL"
echo "   - Select: Free plan"
echo "   - Copy DATABASE_URL"
echo "   - Add to Web Service Environment"
echo ""
echo "8️⃣ After Deployment:"
echo "   - Copy Backend URL"
echo "   - Update Frontend API URL in src/lib/api.ts"
echo "   - Commit & push changes"
echo ""
echo "📚 Full guide in: RENDER_DEPLOYMENT.md"
echo ""
echo "✨ Everything is ready! Start deploying on Render!"

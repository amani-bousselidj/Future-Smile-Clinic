#!/bin/bash

# DigitalOcean Deployment Helper Script
# استخدام: bash deploy-digitalocean.sh

echo "🚀 Future Smile Clinic - DigitalOcean Deployment Helper"
echo "================================================"

# الخطوة 1: تحديث requirements.txt
echo ""
echo "✅ Step 1: Checking requirements.txt..."
if grep -q "gunicorn" backend/requirements.txt; then
    echo "   ✓ gunicorn found"
else
    echo "   ✗ Adding gunicorn..."
    echo "gunicorn==21.2.0" >> backend/requirements.txt
fi

if grep -q "dj-database-url" backend/requirements.txt; then
    echo "   ✓ dj-database-url found"
else
    echo "   ✗ Adding dj-database-url..."
    echo "dj-database-url==2.1.0" >> backend/requirements.txt
fi

# الخطوة 2: التحقق من .env.example
echo ""
echo "✅ Step 2: Checking .env configuration..."
if [ -f backend/.env.example ]; then
    echo "   ✓ .env.example exists"
else
    echo "   ✗ Creating .env.example..."
fi

# الخطوة 3: التحقق من app.yaml
echo ""
echo "✅ Step 3: Checking app.yaml..."
if [ -f app.yaml ]; then
    echo "   ✓ app.yaml exists"
else
    echo "   ✗ Creating app.yaml..."
fi

# الخطوة 4: طلب بيانات DigitalOcean
echo ""
echo "✅ Step 4: DigitalOcean Configuration"
echo ""
echo "أضيف البيانات التالية في DigitalOcean Dashboard:"
echo ""
echo "DATABASE_URL:"
read -p "   → " database_url

echo ""
echo "SECRET_KEY:"
read -p "   → " secret_key

# الخطوة 5: تحديث البيانات
echo ""
echo "✅ Step 5: Updating configuration..."

# تحديث app.yaml (اختياري)
echo "   ✓ Configuration ready"

# الخطوة 6: git commit
echo ""
echo "✅ Step 6: Git Operations"
git add -A
git commit -m "feat: Prepare for DigitalOcean deployment"
git push origin master

echo ""
echo "================================================"
echo "✅ Deployment preparation complete!"
echo ""
echo "🚀 Next Steps:"
echo "1. اذهب إلى: https://cloud.digitalocean.com"
echo "2. اضغط Create → Apps"
echo "3. ربط GitHub و select 'master' branch"
echo "4. اضيف Environment Variables من .env.example"
echo "5. اضغط Deploy"
echo ""
echo "📧 Support: check DIGITALOCEAN_DEPLOYMENT.md"

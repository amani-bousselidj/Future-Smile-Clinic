#!/bin/bash
# Render release script - runs before starting the app

echo "🔧 Running database migrations..."
python manage.py migrate

echo "👤 Creating admin user..."
python manage.py shell << END
from django.contrib.auth.models import User
import sys

# Check if admin exists
admin_exists = User.objects.filter(username='amani', is_superuser=True).exists()

if admin_exists:
    print("✓ Admin user 'amani' already exists")
    sys.exit(0)

# Create admin user
try:
    User.objects.create_superuser(
        username='amani',
        email='amani@example.com',
        password='bousselidj'
    )
    print("✓ Admin user created successfully")
    print("  Username: amani")
    print("  Password: bousselidj")
except Exception as e:
    print(f"✗ Error creating admin user: {e}")
    sys.exit(1)
END

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Release phase completed!"

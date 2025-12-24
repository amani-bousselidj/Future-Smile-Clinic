#!/bin/bash
# Render release script - runs before starting the app

echo "🔧 Running database migrations..."
python manage.py migrate

echo "👤 Initializing admin user..."
python manage.py init_admin

echo "📦 Collecting static files..."
python manage.py collectstatic --noinput

echo "✅ Release phase completed!"

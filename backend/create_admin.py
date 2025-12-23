#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing admin user
User.objects.filter(username='admin').delete()

# Create new superuser
User.objects.create_superuser('admin', 'admin@example.com', 'Admin@123456')
print("✅ Superuser created successfully!")
print("Username: admin")
print("Password: Admin@123456")

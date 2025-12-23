#!/usr/bin/env python
"""
Script to reset admin password
Run with: python manage.py shell < reset_password.py
Or: railway run python manage.py shell < reset_password.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

try:
    user = User.objects.get(username='amani')
    user.set_password('bousselidj')
    user.save()
    print("✅ Password updated successfully for user 'amani'")
    print(f"Username: amani")
    print(f"Password: bousselidj")
except User.DoesNotExist:
    print("❌ User 'amani' not found")
except Exception as e:
    print(f"❌ Error: {e}")

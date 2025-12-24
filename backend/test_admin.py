#!/usr/bin/env python
"""
Simple test script to check and create admin user
Run this directly: python test_admin.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth.models import User

def main():
    print("=" * 50)
    print("ADMIN USER TEST SCRIPT")
    print("=" * 50)
    
    # Check if admin exists
    admin_user = User.objects.filter(username='amani').first()
    
    if admin_user:
        print(f"\n✓ Admin user 'amani' EXISTS")
        print(f"  Email: {admin_user.email}")
        print(f"  Is Staff: {admin_user.is_staff}")
        print(f"  Is Superuser: {admin_user.is_superuser}")
        
        # Test password
        if admin_user.check_password('bousselidj'):
            print(f"  ✓ Password 'bousselidj' is CORRECT")
        else:
            print(f"  ✗ Password 'bousselidj' is WRONG")
            print("\n  Attempting to update password...")
            admin_user.set_password('bousselidj')
            admin_user.save()
            print(f"  ✓ Password updated")
    else:
        print(f"\n✗ Admin user 'amani' DOES NOT EXIST")
        print("\nCreating admin user...")
        try:
            admin_user = User.objects.create_superuser(
                username='amani',
                email='amani@example.com',
                password='bousselidj'
            )
            print(f"✓ Admin user created successfully!")
            print(f"  Username: {admin_user.username}")
            print(f"  Email: {admin_user.email}")
            print(f"  Is Superuser: {admin_user.is_superuser}")
        except Exception as e:
            print(f"✗ Error creating admin user: {e}")
            return 1
    
    # List all users
    print("\n" + "=" * 50)
    print("ALL USERS IN DATABASE:")
    print("=" * 50)
    all_users = User.objects.all()
    if all_users:
        for user in all_users:
            print(f"  - {user.username} (staff={user.is_staff}, superuser={user.is_superuser})")
    else:
        print("  No users found")
    
    print("\n✅ Test completed!")
    return 0

if __name__ == '__main__':
    sys.exit(main())

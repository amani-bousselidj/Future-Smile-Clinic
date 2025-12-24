#!/usr/bin/env python
"""
Test script to verify frontend-backend connectivity
"""

import requests
import json

# Test the API endpoints
BACKEND_URL = "https://future-smile-clinic.onrender.com/api"
FRONTEND_URL = "https://future-smile-clinic.vercel.app"

def test_backend_health():
    """Test if backend is running"""
    print("=" * 60)
    print("BACKEND HEALTH CHECK")
    print("=" * 60)
    
    try:
        # Try to get services endpoint
        response = requests.get(f"{BACKEND_URL}/services/", timeout=10)
        print(f"✓ Backend is responding")
        print(f"  Status Code: {response.status_code}")
        print(f"  Response Time: {response.elapsed.total_seconds():.2f}s")
        
        if response.status_code == 200:
            data = response.json()
            print(f"  Data returned: {len(data) if isinstance(data, list) else 'JSON object'}")
            return True
    except Exception as e:
        print(f"✗ Backend error: {e}")
        return False

def test_cors_headers():
    """Test if CORS headers are set correctly"""
    print("\n" + "=" * 60)
    print("CORS HEADERS CHECK")
    print("=" * 60)
    
    headers = {
        "Origin": FRONTEND_URL,
        "Content-Type": "application/json"
    }
    
    try:
        # Make OPTIONS request to check CORS
        response = requests.options(
            f"{BACKEND_URL}/services/",
            headers=headers,
            timeout=10
        )
        
        print(f"✓ CORS request sent from {FRONTEND_URL}")
        print(f"  Status Code: {response.status_code}")
        
        # Check for CORS headers
        cors_headers = {
            'access-control-allow-origin': response.headers.get('access-control-allow-origin', 'NOT SET'),
            'access-control-allow-methods': response.headers.get('access-control-allow-methods', 'NOT SET'),
            'access-control-allow-headers': response.headers.get('access-control-allow-headers', 'NOT SET'),
        }
        
        print("\n  CORS Response Headers:")
        for header, value in cors_headers.items():
            if value != 'NOT SET':
                print(f"    ✓ {header}: {value[:50]}...")
            else:
                print(f"    ✗ {header}: NOT SET")
        
        if cors_headers['access-control-allow-origin'] != 'NOT SET':
            print(f"\n  ✓ CORS is enabled for frontend")
            return True
        else:
            print(f"\n  ✗ CORS not properly configured")
            return False
            
    except Exception as e:
        print(f"✗ CORS check error: {e}")
        return False

def test_admin_endpoint():
    """Test admin initialization endpoint"""
    print("\n" + "=" * 60)
    print("ADMIN ENDPOINT CHECK")
    print("=" * 60)
    
    try:
        response = requests.get(f"{BACKEND_URL}/admin/init/", timeout=10)
        print(f"✓ Admin endpoint is responding")
        print(f"  Status Code: {response.status_code}")
        print(f"  Response: {response.json()}")
        return True
    except Exception as e:
        print(f"✗ Admin endpoint error: {e}")
        return False

def main():
    print("\n")
    print("╔" + "=" * 58 + "╗")
    print("║" + " FRONTEND-BACKEND CONNECTIVITY TEST ".center(58) + "║")
    print("╚" + "=" * 58 + "╝")
    print(f"\nFrontend: {FRONTEND_URL}")
    print(f"Backend:  {BACKEND_URL}")
    
    results = {
        "Backend Health": test_backend_health(),
        "CORS Headers": test_cors_headers(),
        "Admin Endpoint": test_admin_endpoint(),
    }
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for test_name, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{test_name:.<40} {status}")
        if not result:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n✓ All tests passed! Frontend and Backend are connected.")
    else:
        print("\n✗ Some tests failed. Check configuration.")
    
    return 0 if all_passed else 1

if __name__ == "__main__":
    import sys
    sys.exit(main())

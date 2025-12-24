#!/usr/bin/env python3
"""
اختبار الاتصال بين Frontend و Backend
"""

import requests
import json
from typing import Optional

# الثوابت
BACKEND_URL = "https://future-smile-clinic-production.up.railway.app"
API_BASE = f"{BACKEND_URL}/api"

class APITester:
    def __init__(self):
        self.token: Optional[str] = None
        self.session = requests.Session()
    
    def test_backend_health(self) -> bool:
        """اختبار هل Backend يعمل"""
        print("🔍 اختبار صحة Backend...")
        try:
            response = self.session.get(f"{BACKEND_URL}/", timeout=5)
            print(f"✅ Backend يستجيب: Status {response.status_code}")
            return True
        except Exception as e:
            print(f"❌ Backend لا يستجيب: {e}")
            return False
    
    def test_api_services(self) -> bool:
        """اختبار API الخدمات"""
        print("\n🔍 اختبار API الخدمات...")
        try:
            response = self.session.get(f"{API_BASE}/services/", timeout=5)
            if response.status_code == 200:
                data = response.json()
                count = len(data.get('results', []))
                print(f"✅ API الخدمات يعمل - عدد الخدمات: {count}")
                return True
            else:
                print(f"❌ خطأ: Status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ خطأ في الاتصال: {e}")
            return False
    
    def test_login(self, username: str = "amani", password: str = "bousselidj") -> bool:
        """اختبار تسجيل الدخول"""
        print(f"\n🔍 اختبار تسجيل الدخول ({username})...")
        try:
            response = self.session.post(
                f"{API_BASE}/token/",
                json={"username": username, "password": password},
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access')
                print(f"✅ تسجيل الدخول نجح")
                print(f"   Token: {self.token[:20]}...")
                return True
            else:
                print(f"❌ فشل تسجيل الدخول: Status {response.status_code}")
                print(f"   {response.text}")
                return False
        except Exception as e:
            print(f"❌ خطأ: {e}")
            return False
    
    def test_api_patients(self) -> bool:
        """اختبار API المرضى (يحتاج token)"""
        print("\n🔍 اختبار API المرضى...")
        if not self.token:
            print("⚠️ لا توجد token - يتم تجاهل هذا الاختبار")
            return True
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = self.session.get(
                f"{API_BASE}/patients/",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                count = len(data.get('results', []))
                print(f"✅ API المرضى يعمل - عدد المرضى: {count}")
                return True
            else:
                print(f"❌ خطأ: Status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ خطأ: {e}")
            return False
    
    def test_api_appointments(self) -> bool:
        """اختبار API المواعيد"""
        print("\n🔍 اختبار API المواعيد...")
        if not self.token:
            print("⚠️ لا توجد token")
            return True
        
        try:
            headers = {"Authorization": f"Bearer {self.token}"}
            response = self.session.get(
                f"{API_BASE}/appointments/",
                headers=headers,
                timeout=5
            )
            
            if response.status_code == 200:
                data = response.json()
                count = len(data.get('results', []))
                print(f"✅ API المواعيد يعمل - عدد المواعيد: {count}")
                return True
            else:
                print(f"❌ خطأ: Status {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ خطأ: {e}")
            return False
    
    def test_cors(self) -> bool:
        """اختبار CORS headers"""
        print("\n🔍 اختبار CORS...")
        try:
            response = self.session.options(f"{API_BASE}/services/", timeout=5)
            cors_header = response.headers.get('Access-Control-Allow-Origin')
            if cors_header:
                print(f"✅ CORS مفعل: {cors_header}")
                return True
            else:
                print(f"⚠️ CORS headers غير موجود")
                return False
        except Exception as e:
            print(f"❌ خطأ: {e}")
            return False
    
    def run_all_tests(self):
        """تشغيل جميع الاختبارات"""
        print("=" * 50)
        print("🧪 اختبار الاتصال بين Frontend و Backend")
        print("=" * 50)
        
        results = {
            "Backend Health": self.test_backend_health(),
            "API Services": self.test_api_services(),
            "CORS": self.test_cors(),
            "Login": self.test_login(),
            "API Patients": self.test_api_patients(),
            "API Appointments": self.test_api_appointments(),
        }
        
        print("\n" + "=" * 50)
        print("📊 النتائج:")
        print("=" * 50)
        
        passed = sum(1 for v in results.values() if v)
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅" if result else "❌"
            print(f"{status} {test_name}")
        
        print(f"\nالإجمالي: {passed}/{total} اختبارات نجحت")
        
        if passed == total:
            print("\n🎉 Frontend و Backend مربوطين بشكل صحيح!")
        else:
            print("\n⚠️ هناك مشاكل في الاتصال")

if __name__ == "__main__":
    tester = APITester()
    tester.run_all_tests()

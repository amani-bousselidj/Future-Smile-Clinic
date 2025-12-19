# -*- coding: utf-8 -*-
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')
django.setup()

from clinic.models import Service

# Create default services
services = [
    {
        'name': 'تبييض الأسنان',
        'description': 'تبييض احترافي للأسنان بأحدث التقنيات',
        'price_min': 15000,
        'price_max': 25000,
        'duration': '1-2 ساعة',
    },
    {
        'name': 'تركيب التقويم',
        'description': 'تركيب تقويم الأسنان لتحسين الابتسامة',
        'price_min': 100000,
        'price_max': 200000,
        'duration': '12-24 شهر',
    },
    {
        'name': 'علاج التسوس',
        'description': 'علاج تسوس الأسنان وحشوات متنوعة',
        'price_min': 3000,
        'price_max': 10000,
        'duration': '30-60 دقيقة',
    },
    {
        'name': 'زراعة الأسنان',
        'description': 'زراعة أسنان عالية الجودة',
        'price_min': 50000,
        'price_max': 100000,
        'duration': '3-6 أشهر',
    },
    {
        'name': 'حشوات تجميلية',
        'description': 'حشوات تجميلية بلون الأسنان الطبيعي',
        'price_min': 5000,
        'price_max': 15000,
        'duration': '30-45 دقيقة',
    },
    {
        'name': 'تنظيف الأسنان',
        'description': 'تنظيف عميق وإزالة الجير',
        'price_min': 2000,
        'price_max': 5000,
        'duration': '30 دقيقة',
    },
    {
        'name': 'علاج اللثة',
        'description': 'علاج أمراض اللثة والتهاباتها',
        'price_min': 5000,
        'price_max': 20000,
        'duration': '1-3 جلسات',
    },
    {
        'name': 'خلع الأسنان',
        'description': 'خلع الأسنان بدون ألم',
        'price_min': 1500,
        'price_max': 5000,
        'duration': '15-30 دقيقة',
    },
]

for service_data in services:
    Service.objects.get_or_create(
        name=service_data['name'],
        defaults=service_data
    )

print("تم إنشاء الخدمات بنجاح!")

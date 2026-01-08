from django.db import migrations


def ensure_active_services(apps, schema_editor):
    Service = apps.get_model('clinic', 'Service')

    # If we already have at least one active service, do nothing.
    if Service.objects.filter(is_active=True).exists():
        return

    # If there are services but all are inactive, activate them so they appear in the public list.
    if Service.objects.exists():
        Service.objects.update(is_active=True)
        return

    # If there are no services at all, create a minimal default catalog.
    defaults = [
        dict(
            name='استشارة عامة',
            description='استشارة أولية لتقييم الحالة ووضع خطة العلاج.',
            category='preventive',
            duration_minutes=30,
        ),
        dict(
            name='تنظيف الأسنان',
            description='تنظيف احترافي لإزالة الجير والطبقة الجرثومية.',
            category='cleaning',
            duration_minutes=45,
        ),
        dict(
            name='تبييض الأسنان',
            description='جلسة تبييض لتحسين لون الأسنان وإشراقتها.',
            category='whitening',
            duration_minutes=60,
        ),
        dict(
            name='تقويم الأسنان',
            description='تشخيص ووضع خطة علاج تقويم الأسنان.',
            category='orthodontics',
            duration_minutes=45,
        ),
        dict(
            name='زراعة الأسنان',
            description='تقييم حالة الزراعة وتحديد الخطة المناسبة.',
            category='implants',
            duration_minutes=60,
        ),
        dict(
            name='طب الأسنان التجميلي',
            description='تحسين الابتسامة عبر حلول تجميلية متنوعة.',
            category='cosmetic',
            duration_minutes=45,
        ),
    ]

    for s in defaults:
        Service.objects.get_or_create(
            name=s['name'],
            defaults={
                'description': s['description'],
                'category': s['category'],
                'price_min': 0,
                'price_max': None,
                'duration_minutes': s['duration_minutes'],
                'image_url': None,
                'is_active': True,
            },
        )


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0002_seed_services'),
    ]

    operations = [
        migrations.RunPython(ensure_active_services, migrations.RunPython.noop),
    ]

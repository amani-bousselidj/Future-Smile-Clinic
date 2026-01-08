from django.db import migrations


def seed_services(apps, schema_editor):
    Service = apps.get_model('clinic', 'Service')

    if Service.objects.exists():
        return

    Service.objects.bulk_create(
        [
            Service(
                name='استشارة عامة',
                description='استشارة أولية لتقييم الحالة ووضع خطة العلاج.',
                category='preventive',
                price_min=0,
                price_max=None,
                duration_minutes=30,
                is_active=True,
            ),
            Service(
                name='تنظيف الأسنان',
                description='تنظيف احترافي لإزالة الجير والطبقة الجرثومية.',
                category='cleaning',
                price_min=0,
                price_max=None,
                duration_minutes=45,
                is_active=True,
            ),
            Service(
                name='تبييض الأسنان',
                description='جلسة تبييض لتحسين لون الأسنان وإشراقتها.',
                category='whitening',
                price_min=0,
                price_max=None,
                duration_minutes=60,
                is_active=True,
            ),
            Service(
                name='تقويم الأسنان',
                description='تشخيص ووضع خطة علاج تقويم الأسنان.',
                category='orthodontics',
                price_min=0,
                price_max=None,
                duration_minutes=45,
                is_active=True,
            ),
            Service(
                name='زراعة الأسنان',
                description='تقييم حالة الزراعة وتحديد الخطة المناسبة.',
                category='implants',
                price_min=0,
                price_max=None,
                duration_minutes=60,
                is_active=True,
            ),
            Service(
                name='طب الأسنان التجميلي',
                description='تحسين الابتسامة عبر حلول تجميلية متنوعة.',
                category='cosmetic',
                price_min=0,
                price_max=None,
                duration_minutes=45,
                is_active=True,
            ),
        ],
        ignore_conflicts=True,
    )


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(seed_services, migrations.RunPython.noop),
    ]

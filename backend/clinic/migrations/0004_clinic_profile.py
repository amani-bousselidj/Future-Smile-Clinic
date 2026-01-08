from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0003_ensure_active_services'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClinicProfile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(default='Future Smile Clinic', max_length=255)),
                ('tagline', models.CharField(blank=True, default='', max_length=255)),
                ('primary_phone', models.CharField(blank=True, default='', max_length=50)),
                ('secondary_phone', models.CharField(blank=True, default='', max_length=50)),
                ('email', models.EmailField(blank=True, default='', max_length=254)),
                ('address_line_1', models.CharField(blank=True, default='', max_length=255)),
                ('address_line_2', models.CharField(blank=True, default='', max_length=255)),
                ('hours_weekdays', models.CharField(blank=True, default='', max_length=255)),
                ('hours_weekend', models.CharField(blank=True, default='', max_length=255)),
                ('instagram_url', models.URLField(blank=True, default='')),
                ('facebook_url', models.URLField(blank=True, default='')),
                ('tiktok_url', models.URLField(blank=True, default='')),
            ],
            options={
                'verbose_name': 'Clinic Profile',
                'verbose_name_plural': 'Clinic Profile',
            },
        ),
    ]

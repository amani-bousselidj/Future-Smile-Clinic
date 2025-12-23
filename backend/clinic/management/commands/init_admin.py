from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialize admin user with correct credentials'

    def handle(self, *args, **options):
        try:
            user = User.objects.get(username='amani')
            user.set_password('bousselidj')
            user.save()
            self.stdout.write(self.style.SUCCESS('✅ Admin password updated successfully'))
            self.stdout.write(f'Username: amani')
            self.stdout.write(f'Password: bousselidj')
        except User.DoesNotExist:
            # Create admin user if doesn't exist
            User.objects.create_superuser('amani', 'amani@example.com', 'bousselidj')
            self.stdout.write(self.style.SUCCESS('✅ Admin user created successfully'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {e}'))

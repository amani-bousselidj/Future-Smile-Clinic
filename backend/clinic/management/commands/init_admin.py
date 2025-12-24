from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Initialize admin user with correct credentials'

    def handle(self, *args, **options):
        try:
            # Check if user exists
            if User.objects.filter(username='amani').exists():
                self.stdout.write(self.style.WARNING('⚠️  User "amani" already exists. Updating...'))
                user = User.objects.get(username='amani')
                user.set_password('bousselidj')
                user.email = 'amani@example.com'
                user.is_superuser = True
                user.is_staff = True
                user.save()
            else:
                self.stdout.write(self.style.SUCCESS('✨ Creating new admin user...'))
                user = User.objects.create_superuser(
                    username='amani',
                    email='amani@example.com',
                    password='bousselidj'
                )
            
            self.stdout.write(self.style.SUCCESS('✅ Admin user ready!'))
            self.stdout.write('━' * 50)
            self.stdout.write(self.style.SUCCESS('📝 Login Credentials:'))
            self.stdout.write(f'   Username: amani')
            self.stdout.write(f'   Password: bousselidj')
            self.stdout.write(f'   Email: amani@example.com')
            self.stdout.write('━' * 50)
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
            import traceback
            traceback.print_exc()

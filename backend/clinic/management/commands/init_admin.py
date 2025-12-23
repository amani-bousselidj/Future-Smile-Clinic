from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Initialize admin user with correct credentials'

    def handle(self, *args, **options):
        try:
            # Delete existing amani user if exists
            User.objects.filter(username='amani').delete()
            
            # Create new superuser
            user = User.objects.create_superuser(
                username='amani',
                email='amani@example.com',
                password='bousselidj'
            )
            
            self.stdout.write(self.style.SUCCESS('✅ Admin user created successfully'))
            self.stdout.write(f'Username: amani')
            self.stdout.write(f'Password: bousselidj')
            self.stdout.write(f'Email: amani@example.com')
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ Error: {str(e)}'))
            import traceback
            traceback.print_exc()

"""
WSGI config for Future Smile Clinic
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')
application = get_wsgi_application()

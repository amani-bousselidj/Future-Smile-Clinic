"""
WSGI config for future_smile project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')

application = get_wsgi_application()

"""
ASGI config for future_smile project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'future_smile.settings')

application = get_asgi_application()

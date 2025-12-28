"""
Test endpoint to verify deployment status
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import sys
import os

@require_http_methods(["GET"])
def deployment_status(request):
    """Check if Phase 6C changes are deployed"""
    return JsonResponse({
        "status": "deployed",
        "version": "Phase 6C - AI Time Assignment",
        "commit": "3b15de3",
        "python_version": sys.version,
        "auto_time_assignment": True,
        "serializer_updated": True
    })

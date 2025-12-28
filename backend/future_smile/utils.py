"""
Utility functions for Future Smile Clinic API
"""
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler for REST Framework
    Provides consistent error response format
    """
    # Get the standard DRF exception response
    response = drf_exception_handler(exc, context)

    # Format the response with additional context
    if response is not None:
        custom_response_data = {
            'success': False,
            'error': {
                'status': response.status_code,
                'message': str(exc.detail) if hasattr(exc, 'detail') else str(exc),
                'details': response.data if isinstance(response.data, dict) else None
            }
        }
        response.data = custom_response_data

    return response

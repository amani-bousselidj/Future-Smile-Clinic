"""
Custom middleware to fix CSRF and session issues
"""

class AdminAuthMiddleware:
    """
    Middleware to ensure CSRF and session cookies are properly set for admin
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Ensure CSRF token is always available
        if request.method in ('GET', 'HEAD', 'OPTIONS', 'TRACE'):
            # Make sure CSRF token is generated
            from django.middleware.csrf import get_token
            get_token(request)
        
        response = self.get_response(request)
        
        # For admin pages, ensure cookies are set correctly
        if '/admin' in request.path:
            # Ensure session is set
            if not request.session.session_key:
                request.session.create()
        
        return response

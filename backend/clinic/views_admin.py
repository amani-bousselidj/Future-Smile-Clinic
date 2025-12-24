from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.views.decorators.http import require_http_methods
import logging

logger = logging.getLogger(__name__)


@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def admin_init(request):
    """
    Initialize admin user - creates if doesn't exist
    GET: Check if admin exists
    POST: Create admin user
    """
    try:
        admin_user = User.objects.filter(username='amani', is_superuser=True).first()
        
        if request.method == 'GET':
            if admin_user:
                return Response({
                    'exists': True,
                    'message': 'Admin user already exists',
                    'username': admin_user.username,
                    'email': admin_user.email,
                }, status=200)
            else:
                return Response({
                    'exists': False,
                    'message': 'No admin user found',
                }, status=200)
        
        # POST - Create or update admin
        if admin_user:
            # Update existing admin
            admin_user.set_password('bousselidj')
            admin_user.email = 'amani@example.com'
            admin_user.save()
            return Response({
                'created': False,
                'updated': True,
                'message': 'Admin user updated',
                'username': admin_user.username,
                'email': admin_user.email,
            }, status=200)
        else:
            # Create new admin
            admin_user = User.objects.create_superuser(
                username='amani',
                email='amani@example.com',
                password='bousselidj'
            )
            return Response({
                'created': True,
                'updated': False,
                'message': 'Admin user created successfully',
                'username': admin_user.username,
                'email': admin_user.email,
            }, status=201)
    
    except Exception as e:
        logger.error(f"Error in admin_init: {str(e)}")
        return Response({
            'error': str(e),
            'message': 'Failed to initialize admin user'
        }, status=400)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    """
    Admin login endpoint
    
    Request body:
    {
        "username": "amani",
        "password": "bousselidj"
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({
            'error': 'Username and password are required'
        }, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({
            'error': 'Invalid credentials'
        }, status=401)
    
    if not user.is_staff and not user.is_superuser:
        return Response({
            'error': 'User is not an admin'
        }, status=403)
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'success': True,
        'message': 'Login successful',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        },
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def check_admin_exists(request):
    """
    Check if admin user exists
    """
    admin_count = User.objects.filter(is_superuser=True).count()
    
    return Response({
        'admin_exists': admin_count > 0,
        'admin_count': admin_count,
        'message': 'Admin user exists' if admin_count > 0 else 'No admin user found'
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def create_admin(request):
    """
    Create admin user (only if no admin exists)
    
    Request body:
    {
        "username": "amani",
        "password": "bousselidj",
        "email": "amani@example.com"
    }
    """
    # Check if admin already exists
    if User.objects.filter(is_superuser=True).exists():
        return Response({
            'error': 'Admin user already exists',
            'message': 'Cannot create another admin'
        }, status=400)
    
    username = request.data.get('username', 'amani')
    password = request.data.get('password', 'bousselidj')
    email = request.data.get('email', 'amani@example.com')
    
    try:
        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password
        )
        
        return Response({
            'success': True,
            'message': 'Admin user created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
            }
        }, status=201)
        
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'Failed to create admin user'
        }, status=400)

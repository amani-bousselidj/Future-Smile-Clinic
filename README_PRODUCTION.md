# Future Smile Clinic - Professional Dental Management System

> A complete, production-ready dental clinic management platform built with modern web technologies.

## 🎯 Project Overview

Future Smile Clinic is a comprehensive appointment booking and clinic management system featuring:

- **Professional Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and real-time components
- **Robust Backend**: Django REST Framework with PostgreSQL, transaction-safe operations
- **Real-time Updates**: WebSocket support for queue management and appointment tracking
- **Security First**: JWT authentication, role-based access control, rate limiting
- **Modern Architecture**: Clean code principles, SOLID design, type-safe throughout

## 📋 Technology Stack

### Frontend
- **Framework**: Next.js 14.2.35
- **Language**: TypeScript 5.4 (strict mode)
- **Styling**: Tailwind CSS 3.4 with custom utilities
- **State**: React Context API (Auth, App state)
- **HTTP Client**: Axios with automatic JWT handling
- **Form Handling**: Custom useForm hook with validation
- **UI Components**: Reusable, type-safe button, input, card, spinner

### Backend
- **Framework**: Django 5.0 + Django REST Framework 3.14
- **Database**: PostgreSQL 15 (with dj-database-url)
- **Authentication**: JWT with simple-jwt
- **Serialization**: DRF with nested relationships, field validation
- **Admin Interface**: Django admin with custom list displays and filters
- **File Storage**: WhiteNoise for static files
- **Security**: CORS, CSP headers, SECURE headers in production

### DevOps
- **Frontend Deploy**: Vercel (auto-deploy on git push)
- **Backend Deploy**: Render (auto-deploy on git push)
- **Version Control**: GitHub with clean commit history
- **Environment**: .env configuration for secrets

## 📁 Project Structure

```
future-smile-clinic/
├── src/                           # Frontend (Next.js)
│   ├── app/                       # Pages and routes
│   │   ├── layout.tsx             # Root layout with Header/Footer
│   │   ├── page.tsx               # Home page
│   │   ├── (pages)/               # All page routes
│   │   └── providers.tsx          # Context providers
│   ├── components/                # Reusable UI components
│   │   ├── Button.tsx             # Button with variants
│   │   ├── Input.tsx              # Form input field
│   │   ├── Card.tsx               # Container component
│   │   ├── Header.tsx             # Navigation header
│   │   ├── Footer.tsx             # Footer
│   │   ├── LoadingSpinner.tsx      # Loading indicator
│   │   └── NotificationCenter.tsx  # Toast notifications
│   ├── context/                   # Global state management
│   │   ├── AuthContext.tsx        # Authentication state
│   │   └── AppContext.tsx         # App global state
│   ├── lib/                       # Utilities and hooks
│   │   ├── api.ts                 # Axios client with JWT handling
│   │   ├── hooks.ts               # Custom React hooks
│   │   └── config.ts              # Environment configuration
│   ├── types/                     # TypeScript interfaces
│   └── styles/                    # Global CSS
│
├── backend/                       # Backend (Django)
│   ├── clinic/                    # Main app
│   │   ├── models.py              # 13 Django models
│   │   ├── serializers.py         # 11 DRF serializers
│   │   ├── views.py               # 11 ViewSets
│   │   ├── urls.py                # Router configuration
│   │   ├── admin.py               # Django admin config
│   │   ├── apps.py                # App configuration
│   │   └── signals.py             # Django signals
│   ├── future_smile/              # Project settings
│   │   ├── settings.py            # Django configuration
│   │   ├── urls.py                # URL routing
│   │   ├── wsgi.py                # WSGI server
│   │   └── utils.py               # Exception handler
│   ├── manage.py                  # Django management
│   └── requirements.txt           # Python dependencies
│
├── package.json                   # Frontend dependencies
├── tsconfig.json                  # TypeScript configuration
├── next.config.mjs                # Next.js configuration
├── tailwind.config.ts             # Tailwind configuration
├── postcss.config.mjs             # PostCSS configuration
├── vercel.json                    # Vercel deployment config
├── Procfile                       # Render deployment config
├── railway.toml                   # Railway deployment config
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- PostgreSQL 12+ (for production)
- Git

### Frontend Setup

```bash
# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF

# Run development server
npm run dev

# Open browser
# http://localhost:3000
```

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt

# Create .env
cat > .env << EOF
DEBUG=True
SECRET_KEY=your-secret-key-change-in-production
DATABASE_URL=sqlite:///db.sqlite3
EOF

# Run migrations
python backend/manage.py migrate

# Create superuser
python backend/manage.py createsuperuser

# Run development server
python backend/manage.py runserver
```

## 📚 API Endpoints

### Services
- `GET /api/services/` - List all services
- `GET /api/services/{id}/` - Get service details

### Doctors
- `GET /api/doctors/` - List all doctors
- `GET /api/doctors/{id}/` - Get doctor details

### Patients
- `GET /api/patients/` - List patients
- `POST /api/patients/` - Create patient

### Appointments
- `GET /api/appointments/` - List appointments
- `POST /api/appointments/` - Book appointment
- `GET /api/appointments/{id}/` - Get appointment details
- `PUT /api/appointments/{id}/confirm/` - Confirm appointment
- `PUT /api/appointments/{id}/cancel/` - Cancel appointment
- `PUT /api/appointments/{id}/complete/` - Mark complete

### Queue Management
- `GET /api/queue/` - Get current queue
- `GET /api/queue-statistics/` - Queue statistics

### Contact
- `POST /api/contact-messages/` - Submit contact form

See [API Documentation](./DEPLOYMENT.md) for complete endpoint reference.

## 🔐 Security Features

1. **Authentication**: JWT tokens with 1-hour expiry and 7-day refresh
2. **Authorization**: Role-based access control (RBAC)
3. **Validation**: Field-level and object-level validation on all endpoints
4. **Transaction Safety**: `@transaction.atomic` on appointment creation
5. **Rate Limiting**: 100/hour for anonymous, 1000/hour for authenticated users
6. **Headers**: 
   - CORS whitelist for Vercel domain
   - CSP policy to prevent XSS
   - SECURE headers in production
7. **Data Protection**:
   - Passwords hashed with Django's default hasher
   - Patient medical data encrypted
   - HTTPS enforced in production

## 📊 Database Models

### Core Models
1. **Service** - Dental services offered (15 fields)
2. **Patient** - Patient information (11 fields)
3. **Doctor** - Doctor profiles with specialization (8 fields + M2M services)
4. **Appointment** - Appointment bookings (11 fields)
5. **Queue** - Queue position tracking (8 fields)
6. **QueueStatistics** - Daily queue analytics (7 fields)

### Support Models
7. **Notification** - Appointment notifications (8 fields)
8. **Testimonial** - Patient reviews (6 fields)
9. **BlogPost** - Blog articles (10 fields)
10. **Gallery** - Before/after images (8 fields)
11. **ContactMessage** - Contact form submissions (9 fields)

All models include automatic `created_at` and `updated_at` timestamps.

## 🧪 Testing

### Frontend Testing
```bash
# Run ESLint
npm run lint

# Run type check
npx tsc --noEmit
```

### Backend Testing
```bash
# Run Django checks
python backend/manage.py check

# Create test data
python backend/manage.py seed_data
```

## 📦 Deployment

### Deploy to Vercel (Frontend)
```bash
# Automatic on git push to master
# Vercel detects Next.js project and builds automatically
```

### Deploy to Render (Backend)
```bash
# Set environment variables in Render dashboard:
DEBUG=False
SECRET_KEY=<strong-secret-key>
DATABASE_URL=<postgresql-url>
ALLOWED_HOSTS=<your-domain>

# Render automatically deploys on git push
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🛠️ Development Workflow

### Making Changes

1. **Create feature branch**
   ```bash
   git checkout -b feature/appointment-notifications
   ```

2. **Make changes**
   - Frontend changes: `src/`
   - Backend changes: `backend/`

3. **Commit with clear messages**
   ```bash
   git commit -m "feat: add real-time appointment notifications"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/appointment-notifications
   ```

### Code Style

- **Frontend**: TypeScript strict mode, Tailwind CSS conventions
- **Backend**: PEP 8 with Django conventions, 4-space indentation

## 📖 Documentation

- [Admin Setup Guide](./ADMIN_SETUP.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Advanced Features](./ADVANCED_FEATURES.md)
- [API Documentation](./DEPLOYMENT.md)

## 🐛 Common Issues

### PostgreSQL Connection
If you see "psycopg2 connection error":
1. Ensure PostgreSQL service is running
2. Check DATABASE_URL in .env
3. Verify database exists: `createdb future_smile`

### JWT Token Invalid
1. Check token not expired (1 hour default)
2. Verify SIMPLE_JWT settings in settings.py
3. Clear browser localStorage and re-login

### Static Files Not Loading
1. Run `python backend/manage.py collectstatic`
2. Check STATIC_ROOT in settings.py
3. Verify WhiteNoise middleware in MIDDLEWARE list

## 📞 Support

For issues and questions:
- GitHub Issues: [Future-Smile-Clinic/issues](https://github.com/amani-bousselidj/Future-Smile-Clinic/issues)
- Email: info@futuresmileclinic.com
- Phone: +1 (555) 123-4567

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 👥 Contributors

- **Amani Bousselidj** - Lead Developer

## 🎉 Acknowledgments

- Django and Django REST Framework teams
- Next.js and Vercel teams
- Tailwind CSS community
- Our valued patients and staff

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅

Built with ❤️ for Future Smile Clinic

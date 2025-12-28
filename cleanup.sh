#!/bin/bash
# Future Smile Clinic - Professional Rebuild Phase 1
# This script prepares the repository for clean rebuild

echo "🧹 Starting cleanup process..."
echo "⚠️  Warning: This will remove all old code but preserve git history and deployment configs"

# Step 1: Keep deployment configs and important files
echo "📦 Backing up deployment configs..."
mkdir -p .rebuild_backup
cp vercel.json .rebuild_backup/ 2>/dev/null || true
cp next.config.mjs .rebuild_backup/ 2>/dev/null || true
cp package.json .rebuild_backup/ 2>/dev/null || true
cp tsconfig.json .rebuild_backup/ 2>/dev/null || true
cp tailwind.config.ts .rebuild_backup/ 2>/dev/null || true
cp postcss.config.mjs .rebuild_backup/ 2>/dev/null || true
cp .env.example .rebuild_backup/ 2>/dev/null || true

# Keep backend deployment configs
cp backend/render.yaml .rebuild_backup/ 2>/dev/null || true
cp backend/Procfile .rebuild_backup/ 2>/dev/null || true
cp backend/requirements.txt .rebuild_backup/ 2>/dev/null || true
cp backend/runtime.txt .rebuild_backup/ 2>/dev/null || true

# Step 2: Remove old source code but keep structure
echo "🗑️  Removing old frontend code..."
rm -rf src/
mkdir -p src

echo "🗑️  Removing old backend code..."
rm -rf backend/clinic/
mkdir -p backend/clinic

echo "🗑️  Removing database..."
rm -f backend/db.sqlite3

# Step 3: Clean node_modules and build
echo "🗑️  Cleaning build artifacts..."
rm -rf .next/
rm -rf node_modules/
rm -rf backend/__pycache__/
rm -f package-lock.json

# Step 4: Clean test and log files
echo "🗑️  Cleaning test and log files..."
rm -f *.log *.txt 2>/dev/null || true
rm -rf test_results/ 2>/dev/null || true

# Step 5: Remove old documentation
echo "🗑️  Cleaning old documentation..."
rm -f PHASE_*.md FINAL_*.md IMPLEMENTATION_*.md PROJECT_*.md README_*.md TEST_*.md FIXES_*.md
rm -f *SUMMARY.md *SUMMARY.txt SETUP.md ADMIN_*.md ADVANCED_*.md APPOINTMENTS_*.md CONNECTION_*.md
rm -f DEPLOYMENT.md *DEPLOYMENT.md DIGITALOCEAN_*.md *SETUP.md UI_SHOWCASE.md VERCEL_*.md

# Step 6: Keep only essential documentation
echo "📝 Keeping essential files..."
# Keep README.md for fresh start
cat > README.md << 'EOF'
# Future Smile Clinic - Professional Rebuild

A modern, enterprise-grade dental clinic management system built with Next.js 14 and Django 5.0.

## Project Status
🔨 **Under Reconstruction** - Professional rebuild in progress

## Technology Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Hook Form
- **Backend:** Django 5.0, Django REST Framework, PostgreSQL
- **Deployment:** Vercel (Frontend), Render (Backend)

## Setup Instructions
Coming soon...

## Documentation
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Setup Guide](docs/SETUP.md)
- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
EOF

# Step 7: Initialize fresh .gitignore
echo "🔧 Setting up .gitignore..."
cat > .gitignore << 'EOF'
# Frontend
node_modules/
.next/
.env.local
.env.*.local
out/
dist/
build/

# Backend
__pycache__/
*.pyc
*.pyo
*.egg-info/
.venv/
venv/
env/
db.sqlite3
/static/
/media/
.env

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
.env.example.bak

# Logs
*.log
npm-debug.log*
yarn-debug.log*

# Rebuild backup
.rebuild_backup/
EOF

# Step 8: Initialize git status check
echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Repository status:"
git status
echo ""
echo "📦 Backed up files in .rebuild_backup/"
ls -la .rebuild_backup/ 2>/dev/null | tail -n +4 || echo "No backups"
echo ""
echo "🚀 Ready for Phase 2: Frontend Setup"

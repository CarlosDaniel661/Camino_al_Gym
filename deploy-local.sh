#!/bin/bash
# deploy-local.sh - Local production-like testing before cloud deployment

set -e  # Exit on error

echo "=== Camino al Gym - Local Production Deploy Test ==="
echo ""

# Backend setup
echo "1. Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Edit backend/.env with your values!"
    exit 1
fi

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo "Checking Python syntax..."
python -m py_compile app.py config.py models.py wsgi.py
echo "✓ Python syntax OK"

cd ..

# Frontend setup
echo ""
echo "2. Setting up frontend..."
cd frontend

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "✓ Frontend build OK"

cd ..

echo ""
echo "=== Local Production Setup Complete ==="
echo ""
echo "To test locally before deploying:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source .venv/bin/activate  # or .venv\Scripts\activate on Windows"
echo "  gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app"
echo ""
echo "Terminal 2 (Frontend - optional, for serving build):"
echo "  cd frontend"
echo "  npx serve -s build"
echo ""
echo "Then open: http://localhost:5000 (or http://localhost:3000 if using npm start)"
echo ""

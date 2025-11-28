CAMINO AL GYM Full Project
=====================

Contenido:
- backend/ : Flask API server (includes S3 and YouTube upload hooks, simple admin session auth using ENV vars)
- frontend/: React SPA that consumes backend API

Quick start (local dev)
-----------------------
1) Backend
   cd backend
   python -m venv venv
   source venv/bin/activate    # windows: venv\Scripts\activate
   pip install -r requirements.txt
   # set env vars:
   export ADMIN_USERNAME='admin'
   export ADMIN_PASSWORD='yourpassword'
   # optional: AWS and YouTube env vars (see backend/README_BACKEND.md)
   python app.py

2) Frontend
   cd frontend
   npm install
   npm start

Important notes
---------------
- Admin protection is simple (USERNAME/PASSWORD in env). For production use stronger auth (Flask-Login + DB or OAuth).
- YouTube uploads require Google API credentials and an offline refresh token. See backend/README_BACKEND.md for guidance.
- S3 uploads require AWS credentials with write access.


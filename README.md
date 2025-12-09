CAMINO AL GYM Full Project
=====================

Plataforma de fitness con blog, reservas, y panel administrativo. Backend con Flask + SQLAlchemy, Frontend con React 18.

## Contenido
- **backend/** — Flask API server con autenticación admin, uploads a S3, y webhooks YouTube
- **frontend/** — React SPA (Single Page Application) con dark/light mode y responsive design

---

## Quick Start (Local Development)

### 1) Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with your variables (copy from .env.example)
cp .env.example .env
# Edit .env with your SECRET_KEY, ADMIN_USERNAME, ADMIN_PASSWORD

# Run development server
python app.py
# Server runs on http://localhost:5000
```

### 2) Frontend
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

---

## Deployment (Production)

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git
- Cloud provider account (Heroku, Railway, AWS, Vercel, etc.)

### Option 1: Deploy to Heroku (Recommended for beginners)

#### Backend (Heroku)
```bash
# Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

cd backend

# Login to Heroku
heroku login

# Create new app
heroku create your-app-name

# Set environment variables
heroku config:set FLASK_ENV=production
heroku config:set SECRET_KEY="your-super-secret-key-here"
heroku config:set ADMIN_USERNAME="admin"
heroku config:set ADMIN_PASSWORD="your-strong-password"
heroku config:set DATABASE_URL="your-postgresql-uri"  # Optional, Heroku can provide

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

#### Frontend (Vercel or Netlify)
- **Vercel (easiest)**: 
  ```bash
  npm install -g vercel
  cd frontend
  vercel
  ```
  - Set environment variable: `REACT_APP_API_URL=https://your-app-name.herokuapp.com`

- **Netlify**:
  - Connect GitHub repo
  - Build command: `npm run build`
  - Publish directory: `build`
  - Environment: `REACT_APP_API_URL=https://your-backend-url`

### Option 2: Deploy to Railway.app (Modern alternative)
```bash
# Login and deploy
# https://railway.app/
railway login
railway link

# Set variables in Railway dashboard and deploy
railway up
```

### Option 3: Deploy to AWS
- **Backend**: AWS Elastic Beanstalk or AWS App Runner
- **Frontend**: AWS S3 + CloudFront
- **Database**: AWS RDS (PostgreSQL)

See detailed AWS guide in `docs/deploy-aws.md` (create if needed)

---

## Environment Variables

### Backend (.env file)
Copy `backend/.env.example` to `backend/.env` and fill in:

```env
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-change-this
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-strong-password

# Optional: Database (defaults to SQLite)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Optional: AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
AWS_REGION=us-east-1

# Optional: YouTube uploads
YT_CLIENT_SECRETS_FILE=/path/to/client_secrets.json
YT_REFRESH_TOKEN=your-token
```

### Frontend (.env file in frontend/)
```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## Database Setup for Production

### Using PostgreSQL (Recommended)
```bash
# Create database
createdb gym_production

# Set DATABASE_URL env var
export DATABASE_URL="postgresql://user:password@localhost/gym_production"

# Run migrations (if using alembic, otherwise tables created automatically)
python -c "from app import create_app; app = create_app(); app.app_context().push(); db.create_all()"
```

---

## Testing

### Backend
```bash
cd backend
.venv\Scripts\python -m pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## Project Structure

```
camino_al_gym_full_project/
├── backend/
│   ├── app.py              # Main Flask app
│   ├── config.py           # Configuration (dev, prod, test)
│   ├── models.py           # Database models
│   ├── wsgi.py             # WSGI entry point for production
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example        # Environment template
│   ├── Procfile            # Heroku/Railway deployment
│   └── runtime.txt         # Python version
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── index.css       # Tailwind + CSS variables for themes
│   │   ├── components/     # React components
│   │   └── index.js
│   ├── package.json
│   ├── public/
│   │   └── index.html      # HTML entry point
│   └── tailwind.config.js
├── README.md               # This file
└── .gitignore
```

---

## Key Features

✅ **Responsive Design** — Mobile, tablet, desktop  
✅ **Dark/Light Mode** — Theme toggle with localStorage persistence  
✅ **Admin Panel** — Simple username/password auth  
✅ **Blog/Posts** — Create, edit, delete posts with images/videos  
✅ **Reservations** — Booking system for services  
✅ **Contact Form** — Email notifications (optional)  
✅ **File Uploads** — Local storage or AWS S3  
✅ **YouTube Integration** — Upload videos to YouTube (optional)  

---

## Important Security Notes

⚠️ **Before Production Deployment:**

1. **Change SECRET_KEY** — Use a strong random string
   ```python
   import secrets
   secrets.token_urlsafe(32)  # Generate a key
   ```

2. **Use strong ADMIN_PASSWORD** — At least 16 characters with mixed case, numbers, symbols

3. **Enable HTTPS** — Your hosting provider should handle this automatically

4. **Use PostgreSQL** — Don't use SQLite in production

5. **Restrict CORS** — Update CORS_ORIGINS to only your frontend domain

6. **Implement rate limiting** — Add `Flask-Limiter` to prevent brute force attacks

7. **Secure cookies** — SESSION_COOKIE_SECURE=True (done in ProductionConfig)

---

## Troubleshooting

### Frontend can't connect to backend
- Check REACT_APP_API_URL environment variable
- Verify backend is running on correct port
- Check CORS settings in `config.py`
- Browser console should show network errors

### Database not found
- Ensure DATABASE_URL is set correctly
- For local: `sqlite:///gym.db` should be auto-created
- For PostgreSQL: Create database first

### Admin login fails
- Check ADMIN_USERNAME and ADMIN_PASSWORD env vars
- Ensure .env file exists in backend folder
- Clear browser cookies and try again

---

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add my feature'`
3. Push: `git push origin feature/my-feature`
4. Create Pull Request

---

## License

MIT License - see LICENSE file

---

## Support

For issues or questions:
- Backend: See `backend/README_BACKEND.md`
- Frontend: Check browser console (F12 → Network tab)
- Email: contact@caminoalgym.com

---

## Deployment Checklist

- [ ] SECRET_KEY set to strong random value
- [ ] ADMIN_PASSWORD changed from default
- [ ] Database configured (PostgreSQL for production)
- [ ] AWS S3 credentials set (if using S3)
- [ ] Frontend REACT_APP_API_URL points to backend
- [ ] CORS_ORIGINS updated to frontend domain
- [ ] HTTPS enabled
- [ ] Error logging configured
- [ ] Database backups scheduled
- [ ] Monitoring/alerting set up

Happy deploying! 🚀


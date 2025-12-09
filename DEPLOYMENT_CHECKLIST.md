# Deployment Checklist - Camino al Gym

Use this checklist before deploying to production.

## ✅ Security

- [ ] **SECRET_KEY** changed from default
  ```bash
  python -c "import secrets; print(secrets.token_urlsafe(32))"
  ```
  - Copy output to `FLASK_ENV=production` .env

- [ ] **ADMIN_PASSWORD** is strong (16+ chars, mixed case, numbers, symbols)
  - Example: `Secure@Gym2024!Pass`

- [ ] **.env file NOT committed to git**
  - Verify in `.gitignore`
  - Never share .env file

- [ ] **CORS_ORIGINS** set to only your frontend domain
  - Don't use wildcard `*` in production

- [ ] **DATABASE credentials** use strong passwords
  - PostgreSQL user != root or admin

- [ ] **HTTPS enabled** on frontend domain
  - Use Let's Encrypt or AWS ACM (free)

- [ ] **AWS credentials** have minimal permissions
  - S3: only `s3:PutObject` and `s3:GetObject` on your bucket
  - RDS: only database creation/access roles

---

## ✅ Backend Configuration

- [ ] `FLASK_ENV=production` set
- [ ] `DATABASE_URL` points to PostgreSQL (not SQLite)
- [ ] Gunicorn installed (`pip install gunicorn`)
- [ ] `requirements.txt` updated with production packages
  - `gunicorn`
  - `psycopg2-binary` (if using PostgreSQL)
- [ ] `wsgi.py` created and tested
- [ ] `Procfile` created (if deploying to Heroku/Railway)
- [ ] Database migrations run (if using alembic)
  - Or tables auto-created: `python -c "from app import create_app; app = create_app(); app.app_context().push(); db.create_all()"`
- [ ] Admin profile initialized in database
- [ ] Upload folder writable (or use S3)

---

## ✅ Frontend Configuration

- [ ] Build passes without errors
  ```bash
  npm run build
  # Should create frontend/build/ directory
  ```

- [ ] Environment variables set
  - `REACT_APP_API_URL=https://your-backend-url`
  - No sensitive data in env vars

- [ ] API proxy updated (if needed)
  - `package.json` proxy removed or updated

- [ ] Service worker configured (for PWA, optional)

- [ ] Analytics/tracking codes added (if desired)

- [ ] Favicon and meta tags verified
  - `public/index.html`

---

## ✅ Integrations (if used)

- [ ] **AWS S3**
  - [ ] Bucket created
  - [ ] Public read access (if needed)
  - [ ] Credentials in .env
  - [ ] Region matches bucket

- [ ] **YouTube**
  - [ ] OAuth credentials set up
  - [ ] Refresh token obtained
  - [ ] client_secrets.json path in .env

- [ ] **Email notifications** (if sending contact form emails)
  - [ ] SMTP credentials set
  - [ ] Email templates tested

---

## ✅ Deployment Platform

### For Heroku
- [ ] Heroku account created
- [ ] Heroku CLI installed
- [ ] `Procfile` in backend/
- [ ] `runtime.txt` in backend/ (Python version)
- [ ] Config variables set via `heroku config:set`
- [ ] Build and deployment tested

### For Railway
- [ ] Railway account created
- [ ] GitHub repo linked
- [ ] Environment variables set in Railway dashboard
- [ ] Build command configured
- [ ] Start command configured

### For AWS
- [ ] RDS PostgreSQL created
- [ ] EC2/App Runner instance created
- [ ] S3 bucket created
- [ ] IAM roles configured
- [ ] Security groups allow traffic
- [ ] Domain DNS pointed to load balancer

---

## ✅ Testing Before Deploy

### Backend
```bash
# Start in production mode
export FLASK_ENV=production
export DATABASE_URL="postgresql://..." 
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app

# Test endpoints
curl http://localhost:5000/api/posts      # Should return JSON
curl http://localhost:5000/api/profile    # Should return profile
```

### Frontend
```bash
# Build and test
npm run build
npx serve -s build

# Open http://localhost:3000 and test:
# - [ ] Theme toggle works
# - [ ] All pages load
# - [ ] Sidebar appears on desktop
# - [ ] Responsive on mobile
# - [ ] API calls reach backend
# - [ ] Login form works
# - [ ] Admin dashboard accessible
```

### Full integration
- [ ] Frontend talks to backend API
- [ ] Image uploads work
- [ ] Admin login works
- [ ] Blog posts display
- [ ] Reservations submit
- [ ] Contact form submits
- [ ] Dark/light mode toggles
- [ ] Responsive design verified

---

## ✅ Monitoring & Logging

- [ ] Error logging configured
  - Backend: CloudWatch/Sentry/Papertrail
  - Frontend: Sentry or similar

- [ ] Health check endpoint created
  - `GET /health` or similar

- [ ] Uptime monitoring set
  - UptimeRobot.com (free)
  - StatusCake

- [ ] Database backups automated
  - RDS automatic snapshots enabled
  - S3 versioning enabled

- [ ] Alerts configured
  - Email on errors
  - Slack on deployment

---

## ✅ Post-Deployment

- [ ] Verify app is running
  ```bash
  curl https://your-domain.com/
  ```

- [ ] Check database connection
  - Admin panel should load
  - Posts should display

- [ ] Test file uploads
  - Admin can upload images

- [ ] Verify HTTPS
  - No mixed content warnings
  - Certificate valid

- [ ] Check logs for errors
  - No 500 errors
  - No database connection errors

- [ ] Set up monitoring
  - CloudWatch alarms
  - Uptime monitoring
  - Log aggregation

- [ ] Schedule maintenance window
  - Database backups
  - Log cleanup
  - Security updates

---

## 🎉 Deployment Complete!

Your app is live. Monitor it closely for the first 24-48 hours.

### Immediate Next Steps
1. Share URL with users
2. Test with real data
3. Gather feedback
4. Monitor error logs daily
5. Set up automated backups

### Long-term Maintenance
- Monthly security updates
- Quarterly dependency updates
- Monitor and analyze logs
- Keep database optimized
- Document any customizations

---

## Emergency Procedures

### If app goes down
1. Check logs: `heroku logs --tail` or cloud provider
2. Restart: `heroku restart` or redeploy
3. Rollback last deploy if necessary
4. Notify users

### If database is corrupted
1. Restore from latest backup
2. Check error logs for cause
3. Implement additional safeguards

### If hacked/compromised
1. Change all passwords immediately
2. Review access logs
3. Update security groups
4. Enable 2FA
5. Rotate credentials

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**: 


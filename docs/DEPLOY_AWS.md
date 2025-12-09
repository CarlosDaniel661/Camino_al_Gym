# Deployment Guide - AWS

This guide covers deploying Camino al Gym to AWS.

## Architecture

```
User
  ↓
CloudFront (CDN for frontend)
  ↓ (backend API calls)
API Gateway / Application Load Balancer
  ↓
EC2 / App Runner (Backend Flask + Gunicorn)
  ↓
RDS PostgreSQL (Database)
  ↓
S3 (File uploads)
```

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker (optional, for ECS)

## Option 1: Simple Deployment (EC2 + RDS + S3)

### 1. Create RDS PostgreSQL Database

```bash
# Via AWS Console or CLI
aws rds create-db-instance \
  --db-instance-identifier gym-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password YourStrongPassword \
  --allocated-storage 20
```

### 2. Create EC2 Instance

```bash
# Launch Ubuntu 20.04 LTS instance (t2.micro eligible for free tier)
# Security Group: Allow SSH (22), HTTP (80), HTTPS (443)

# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y python3.11 python3.11-venv python3-pip nginx git

# Clone your repo
git clone https://github.com/yourusername/camino_al_gym.git
cd camino_al_gym/backend

# Create virtualenv
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Setup environment
nano .env
# Add your variables here
export $(cat .env | xargs)

# Test backend
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app

# Ctrl+C to stop
```

### 3. Create S3 Bucket

```bash
aws s3api create-bucket \
  --bucket camino-al-gym-uploads \
  --region us-east-1

# Block public access (if not needed)
aws s3api put-public-access-block \
  --bucket camino-al-gym-uploads \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 4. Configure Nginx Reverse Proxy

```bash
# Create nginx config
sudo nano /etc/nginx/sites-available/camino-al-gym

# Add this:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /static {
        alias /home/ubuntu/camino_al_gym/frontend/build;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/camino-al-gym /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. Create Systemd Service for Backend

```bash
sudo nano /etc/systemd/system/camino-al-gym.service

# Add:
[Unit]
Description=Camino al Gym Backend
After=network.target

[Service]
Type=notify
User=ubuntu
WorkingDirectory=/home/ubuntu/camino_al_gym/backend
Environment="PATH=/home/ubuntu/camino_al_gym/backend/.venv/bin"
EnvironmentFile=/home/ubuntu/camino_al_gym/backend/.env
ExecStart=/home/ubuntu/camino_al_gym/backend/.venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 wsgi:app
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target

# Enable and start
sudo systemctl enable camino-al-gym
sudo systemctl start camino-al-gym
sudo systemctl status camino-al-gym
```

---

## Option 2: AWS App Runner (Easiest, Container-Based)

### 1. Create ECR Repository

```bash
aws ecr create-repository --repository-name camino-al-gym
```

### 2. Build and Push Docker Image

```bash
# In backend/ directory
docker build -t camino-al-gym:latest .
docker tag camino-al-gym:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/camino-al-gym:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/camino-al-gym:latest
```

### 3. Deploy to App Runner

```bash
aws apprunner create-service \
  --service-name camino-al-gym \
  --source-configuration ImageRepository={ImageIdentifier=123456789.dkr.ecr.us-east-1.amazonaws.com/camino-al-gym:latest,RepositoryType=ECR},AutoDeploymentsEnabled=true \
  --instance-configuration InstanceRoleArn=arn:aws:iam::123456789:role/AppRunnerECRAccessRole
```

---

## Option 3: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 camino-al-gym

# Create environment
eb create camino-al-gym-env

# Set environment variables
eb setenv FLASK_ENV=production SECRET_KEY=... ADMIN_USERNAME=... ADMIN_PASSWORD=...

# Deploy
eb deploy

# Open in browser
eb open
```

---

## Monitoring & Logs

### CloudWatch Logs

```bash
# View logs
aws logs tail /aws/ec2/camino-al-gym

# Or via console: CloudWatch → Logs
```

### Health Checks

```bash
# Test backend
curl https://your-domain.com/api/posts

# Should return JSON
```

---

## Database Backups

```bash
# Automated snapshots (AWS console)
# Manual backup
aws rds create-db-snapshot \
  --db-instance-identifier gym-db \
  --db-snapshot-identifier gym-db-backup-$(date +%s)
```

---

## Troubleshooting

### Backend not responding
- Check security groups (port 5000, 80, 443)
- View systemd logs: `sudo journalctl -u camino-al-gym -f`
- Check nginx: `sudo systemctl status nginx`

### Database connection failed
- Verify RDS endpoint in .env
- Check security group allows inbound on port 5432
- Test connection: `psql -h your-rds-endpoint -U admin -d postgres`

### S3 uploads failing
- Verify AWS credentials in .env
- Check bucket permissions
- Ensure bucket is in same region

---

## Cost Estimation (Monthly)

- EC2 t2.micro (free tier eligible): $0
- RDS PostgreSQL t3.micro: ~$15
- S3 storage (1GB): ~$0.02
- Data transfer: ~$0.09/GB
- **Total**: ~$20-50/month

---

## Production Checklist

- [ ] Database automated backups enabled
- [ ] SSL certificate valid
- [ ] Security groups restrictive
- [ ] IAM roles with least privilege
- [ ] CloudWatch alarms set
- [ ] Error logging configured
- [ ] Secrets not in code (all in .env)
- [ ] Domain DNS pointed to load balancer
- [ ] Frontend deployed to CloudFront
- [ ] Rate limiting configured


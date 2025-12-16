import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

# For production (Fly.io), use /app/data directory for persistent storage
DATA_DIR = Path(os.environ.get('DATABASE_DIR', str(BASE_DIR)))
if os.environ.get('FLASK_ENV') == 'production':
    DATA_DIR = Path('/app/data')
    DATA_DIR.mkdir(parents=True, exist_ok=True)

class Config:
    """Base configuration"""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-this')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL', 
        f"sqlite:///{DATA_DIR / 'gimnasio.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", str(BASE_DIR / "static" / "uploads"))
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 200 MB

    # Admin credentials (simple protection - use strong passwords in production)
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "changeme")

    # AWS S3 (for cloud file storage)
    AWS_S3_BUCKET = os.environ.get("AWS_S3_BUCKET")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

    # YouTube uploads via API
    YT_CLIENT_SECRETS_FILE = os.environ.get("YT_CLIENT_SECRETS_FILE")
    YT_REFRESH_TOKEN = os.environ.get("YT_REFRESH_TOKEN")

    # CORS configuration
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000,http://localhost:5000").split(",")

    # Logging
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    TESTING = False
    # Force HTTPS in production
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'None'

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    SESSION_COOKIE_SECURE = False

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    DEBUG = True


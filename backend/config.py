import os
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"sqlite:///{BASE_DIR / 'gimnasio.db'}")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", str(BASE_DIR / "static" / "uploads"))
    MAX_CONTENT_LENGTH = 200 * 1024 * 1024  # 200 MB

    # Admin credentials (simple protection)
    ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "changeme")  # reemplaza en producción

    # AWS S3 (para media)
    AWS_S3_BUCKET = os.environ.get("AWS_S3_BUCKET")
    AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")

    # YouTube uploads via API: path to credentials JSON y refresh token en env
    YT_CLIENT_SECRETS_FILE = os.environ.get("YT_CLIENT_SECRETS_FILE")  # e.g. '/path/to/client_secrets.json'
    YT_REFRESH_TOKEN = os.environ.get("YT_REFRESH_TOKEN")

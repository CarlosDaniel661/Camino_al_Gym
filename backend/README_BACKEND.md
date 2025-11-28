Backend (Flask) README
----------------------

1) Create virtualenv and install:
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt

2) Environment variables (recommended):
   export SECRET_KEY='...'
   export ADMIN_USERNAME='admin'
   export ADMIN_PASSWORD='strongpassword'
   # AWS (optional, for S3 media)
   export AWS_ACCESS_KEY_ID='...'
   export AWS_SECRET_ACCESS_KEY='...'
   export AWS_S3_BUCKET='your-bucket-name'
   export AWS_REGION='us-east-1'
   # YouTube (optional)
   export YT_CLIENT_SECRETS_FILE='/full/path/to/client_secrets.json'
   export YT_REFRESH_TOKEN='your-refresh-token'

3) Run:
   python app.py

Notes:
- Admin protection uses a simple username/password stored in env. Sessions are used to keep admin logged in.
- For YouTube uploads you must configure Google OAuth2 offline access and save refresh token to YT_REFRESH_TOKEN.
- For S3 uploads, make sure the bucket exists and credentials are set; uploaded objects are set public-read in this example.

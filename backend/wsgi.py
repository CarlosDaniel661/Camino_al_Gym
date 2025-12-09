"""
WSGI entry point for production deployments (Heroku, Railway, AWS, etc.)
Use with: gunicorn -w 4 -b 0.0.0.0:$PORT wsgi:app
"""
import os
from app import create_app

# Create Flask app instance
app = create_app()

# For Gunicorn/production server
if __name__ == "__main__":
    # Only used for local testing; production uses gunicorn
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)

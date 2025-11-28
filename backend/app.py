import os
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, session
from config import Config
from models import db, Post, Reservation, ContactMessage
from pathlib import Path
from werkzeug.utils import secure_filename
from flask_cors import CORS
import boto3
import json
import logging

# Corrección: lista de extensiones permitidas (quitado el typo)
ALLOWED_IMAGE = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
ALLOWED_VIDEO = {'mp4', 'webm', 'ogg', 'mov'}

def create_app():
    app = Flask(__name__, static_folder="static")
    app.config.from_object(Config)

    # CORS: permitimos conexiones desde el front y credenciales para la sesión admin
    # Si tu frontend está en otro origen, ajusta `origins` o usa "*" en dev.
    CORS(app, supports_credentials=True)

    # Asegurar carpeta de uploads
    Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)

    # Inicializar DB (SQLAlchemy)
    db.init_app(app)
    with app.app_context():
        db.create_all()

    # --- Helpers ---
    def allowed_file(filename, allowed):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed

    def is_admin_logged_in():
        return session.get('admin') == True

    # --- Basic health check ---
    @app.route('/api/ping', methods=['GET'])
    def ping():
        return jsonify({"ok": True})

    # --- Public API ---
    @app.route('/api/posts', methods=['GET'])
    def api_posts():
        # Retorna TODOS los posts (aún mantenido para compatibilidad)
        posts = Post.query.order_by(Post.pinned.desc(), Post.created_at.desc()).all()
        return jsonify([p.to_dict() for p in posts])

    @app.route('/api/posts/<int:post_id>', methods=['GET'])
    def api_post(post_id):
        p = Post.query.get_or_404(post_id)
        return jsonify(p.to_dict())

    @app.route('/api/like/<int:post_id>', methods=['POST'])
    def api_like(post_id):
        p = Post.query.get_or_404(post_id)
        p.likes = (p.likes or 0) + 1
        db.session.commit()
        return jsonify({"likes": p.likes})

    # Paginación para feed / scroll infinito
    @app.route('/api/posts/page/<int:page>', methods=['GET'])
    def api_posts_page(page):
        PER_PAGE = 5  # Ajustable
        posts = Post.query.order_by(Post.pinned.desc(), Post.created_at.desc()) \
                          .paginate(page=page, per_page=PER_PAGE, error_out=False)
        return jsonify({
            "items": [p.to_dict() for p in posts.items],
            "has_next": posts.has_next
        })

    @app.route('/api/reserve', methods=['POST'])
    def api_reserve():
        data = request.get_json() or request.form
        name = data.get('name')
        service = data.get('service')
        date = data.get('date')
        contact = data.get('contact')
        notes = data.get('notes')
        if not name or not service or not date:
            return jsonify({"error": "missing_fields"}), 400
        r = Reservation(name=name, service=service, date=date, contact=contact, notes=notes)
        db.session.add(r); db.session.commit()
        return jsonify({"ok": True, "id": r.id})

    @app.route('/api/contact', methods=['POST'])
    def api_contact():
        data = request.get_json() or request.form
        name = data.get('name')
        message = data.get('message')
        email = data.get('email')
        if not name or not message:
            return jsonify({"error": "missing_fields"}), 400
        m = ContactMessage(name=name, email=email, message=message)
        db.session.add(m); db.session.commit()
        return jsonify({"ok": True, "id": m.id})

    # --- Admin simple auth ---
    @app.route('/api/admin/login', methods=['POST'])
    def admin_login():
        data = request.get_json() or {}
        username = data.get('username')
        password = data.get('password')

        # Seguridad mínima: comparar con config (puedes cambiar con variables de entorno)
        if username == app.config['ADMIN_USERNAME'] and password == app.config['ADMIN_PASSWORD']:
            session['admin'] = True
            return jsonify({"ok": True})
        return jsonify({"ok": False}), 401

    @app.route('/api/admin/logout', methods=['POST'])
    def admin_logout():
        session.pop('admin', None)
        return jsonify({"ok": True})

    # --- Admin protected endpoints ---
    @app.route('/api/admin/posts', methods=['POST'])
    def admin_create_post():
        if not is_admin_logged_in():
            return jsonify({"error": "unauthorized"}), 401

        title = request.form.get('title')
        body = request.form.get('body')
        media_type = request.form.get('media_type', 'none')
        pinned = bool(request.form.get('pinned'))
        media_url = None

        # handle file upload and optional S3 upload
        if 'media' in request.files:
            f = request.files['media']
            if f and f.filename:
                filename = secure_filename(f.filename)
                ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
                local_path = Path(app.config['UPLOAD_FOLDER']) / filename
                f.save(local_path)

                # If configured, upload to S3; else serve locally
                if app.config.get('AWS_S3_BUCKET'):
                    try:
                        s3 = boto3.client('s3')
                        s3_key = f"media/{filename}"
                        s3.upload_file(str(local_path), app.config['AWS_S3_BUCKET'], s3_key, ExtraArgs={'ACL': 'public-read'})
                        region = app.config.get('AWS_REGION') or 'us-east-1'
                        media_url = f"https://{app.config['AWS_S3_BUCKET']}.s3.{region}.amazonaws.com/{s3_key}"
                    except Exception:
                        app.logger.exception('S3 upload failed')
                        media_url = f"/static/uploads/{filename}"
                else:
                    media_url = f"/static/uploads/{filename}"

        # embed support (YouTube or other URL)
        if media_type == 'embed':
            media_url = request.form.get('embed_url')

        post = Post(title=title, body=body, media_type=media_type, media_url=media_url, pinned=pinned)
        db.session.add(post); db.session.commit()
        return jsonify({"ok": True, "post": post.to_dict()})

    @app.route('/api/admin/posts/<int:post_id>', methods=['DELETE'])
    def admin_delete_post(post_id):
        if not is_admin_logged_in():
            return jsonify({"error": "unauthorized"}), 401
        p = Post.query.get_or_404(post_id)

        # If local media file exists, attempt deletion
        if p.media_url and p.media_url.startswith('/static/uploads/'):
            try:
                fp = p.media_url.lstrip('/')
                full = os.path.join(app.root_path, fp)
                if os.path.exists(full):
                    os.remove(full)
            except Exception:
                app.logger.exception("Failed to remove media file")

        db.session.delete(p); db.session.commit()
        return jsonify({"ok": True})

    # --- YouTube upload endpoint (server-side) ---
    @app.route('/api/admin/upload/youtube', methods=['POST'])
    def upload_youtube():
        if not is_admin_logged_in():
            return jsonify({"error": "unauthorized"}), 401

        # This endpoint expects the server to have CLIENT_SECRETS JSON path and a refresh token in env.
        # It uploads an already-received file (multipart form 'video') to YouTube via resumable upload.
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload

        client_secrets = app.config.get('YT_CLIENT_SECRETS_FILE')
        refresh_token = app.config.get('YT_REFRESH_TOKEN')
        if not client_secrets or not refresh_token:
            return jsonify({"error": "youtube_not_configured"}), 400

        # load client secrets to get client_id and client_secret
        with open(client_secrets, 'r') as fh:
            data = json.load(fh)
        client_id = data['installed']['client_id'] if 'installed' in data else data['web']['client_id']
        client_secret = data['installed']['client_secret'] if 'installed' in data else data['web']['client_secret']

        creds = Credentials(
            token=None,
            refresh_token=refresh_token,
            client_id=client_id,
            client_secret=client_secret,
            token_uri='https://oauth2.googleapis.com/token'
        )
        try:
            service = build('youtube', 'v3', credentials=creds)
        except Exception:
            app.logger.exception('YouTube build failed')
            return jsonify({"error": "youtube_build_failed"}), 500

        if 'video' not in request.files:
            return jsonify({"error": "no_video"}), 400

        vid = request.files['video']
        filename = secure_filename(vid.filename)
        local_path = Path(app.config['UPLOAD_FOLDER']) / filename
        vid.save(local_path)

        body = {
            'snippet': {
                'title': request.form.get('title') or filename,
                'description': request.form.get('description') or '',
                'tags': request.form.get('tags', '').split(','),
                'categoryId': '22'  # people & blogs default
            },
            'status': {
                'privacyStatus': request.form.get('privacyStatus', 'public')
            }
        }
        media = MediaFileUpload(str(local_path), chunksize=-1, resumable=True, mimetype='video/*')
        try:
            request_upload = service.videos().insert(part=','.join(body.keys()), body=body, media_body=media)
            response = None
            while response is None:
                status, response = request_upload.next_chunk()
                if status:
                    app.logger.info("Upload %d%%." % int(status.progress() * 100))
            # delete local file after upload
            try:
                os.remove(local_path)
            except Exception:
                pass
            # response contains 'id' for the uploaded video
            video_id = response.get('id')
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            return jsonify({"ok": True, "video_url": video_url})
        except Exception:
            app.logger.exception('YouTube upload failed')
            return jsonify({"error": "upload_failed"}), 500

    # Serve static (for local media)
    @app.route('/static/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

if __name__ == '__main__':
    app = create_app()
    # session secret for simple admin session handling
    app.secret_key = app.config.get('SECRET_KEY', 'dev-secret-key')
    # Ejecutar app
    app.run(debug=True, host='0.0.0.0', port=5000)

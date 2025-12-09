# backend/app.py
import os
from flask import Flask, request, jsonify, send_from_directory, redirect, url_for, session
from config import Config
from models import db, Post, Reservation, ContactMessage, Service, AdminProfile
from pathlib import Path
from werkzeug.utils import secure_filename
from flask_cors import CORS
import boto3
import json
import logging

ALLOWED_IMAGE = {'png','jpg','jpeg','gif','webp'}
ALLOWED_VIDEO = {'mp4','webm','ogg','mov'}

def create_app():
    app = Flask(__name__, static_folder="static")
    app.config.from_object(Config)
    app.secret_key = app.config.get('SECRET_KEY','dev-secret-key')
    CORS(app, supports_credentials=True)
    Path(app.config['UPLOAD_FOLDER']).mkdir(parents=True, exist_ok=True)
    db.init_app(app)

    with app.app_context():
        db.create_all()
        # Ensure a single AdminProfile row exists
        if AdminProfile.query.first() is None:
            ap = AdminProfile(profile_main_url=None, profile_owner_url=None, visits=0)
            db.session.add(ap)
            db.session.commit()

    # --- Helpers ---
    def allowed_file(filename, allowed):
        return '.' in filename and filename.rsplit('.',1)[1].lower() in allowed

    def is_admin_logged_in():
        return session.get('admin') == True

    def save_file_and_get_url(file):
        filename = secure_filename(file.filename)
        local_path = Path(app.config['UPLOAD_FOLDER']) / filename
        file.save(local_path)
        if app.config.get('AWS_S3_BUCKET'):
            try:
                s3 = boto3.client('s3', region_name=app.config.get('AWS_REGION'))
                s3_key = f"media/{filename}"
                s3.upload_file(str(local_path), app.config['AWS_S3_BUCKET'], s3_key, ExtraArgs={'ACL':'public-read'})
                region = app.config.get('AWS_REGION') or 'us-east-1'
                return f"https://{app.config['AWS_S3_BUCKET']}.s3.{region}.amazonaws.com/{s3_key}"
            except Exception:
                app.logger.exception("S3 upload failed, falling back to local")
                return f"/static/uploads/{filename}"
        else:
            return f"/static/uploads/{filename}"

    # --- Public API ---
    @app.route('/api/posts', methods=['GET'])
    def api_posts():
        posts = Post.query.order_by(Post.pinned.desc(), Post.created_at.desc()).all()
        return jsonify([p.to_dict() for p in posts])

    @app.route('/api/posts/<int:post_id>', methods=['GET'])
    def api_post(post_id):
        p = Post.query.get_or_404(post_id)
        return jsonify(p.to_dict())

    @app.route('/api/like/<int:post_id>', methods=['POST'])
    def api_like(post_id):
        """
        Toggle like per user (tracked in session).
        If post already liked by this session -> unlike (decrement).
        Else -> like (increment).
        """
        p = Post.query.get_or_404(post_id)
        liked = session.get('liked_posts', [])
        if not isinstance(liked, list):
            liked = list(liked)
        if post_id in liked:
            # unlike
            p.likes = p.likes - 1 if p.likes and p.likes > 0 else 0
            try:
                liked.remove(post_id)
            except ValueError:
                pass
            action = "unliked"
        else:
            p.likes = (p.likes or 0) + 1
            liked.append(post_id)
            action = "liked"
        session['liked_posts'] = liked
        db.session.commit()
        return jsonify({"likes": p.likes, "action": action})

    @app.route('/api/posts/page/<int:page>', methods=['GET'])
    def api_posts_page(page):
        PER_PAGE = 5
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
            return jsonify({"error":"missing_fields"}), 400
        r = Reservation(name=name, service=service, date=date, contact=contact, notes=notes)
        db.session.add(r); db.session.commit()
        return jsonify({"ok": True, "id": r.id})

    @app.route('/api/contact', methods=['POST'])
    def api_contact():
        data = request.get_json() or request.form
        name = data.get('name'); message = data.get('message')
        email = data.get('email')
        if not name or not message:
            return jsonify({"error":"missing_fields"}), 400
        m = ContactMessage(name=name, email=email, message=message)
        db.session.add(m); db.session.commit()
        return jsonify({"ok": True, "id": m.id})

    # --- Admin simple auth ---
    @app.route('/api/admin/login', methods=['POST'])
    def admin_login():
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
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
            return jsonify({"error":"unauthorized"}), 401
        title = request.form.get('title')
        body = request.form.get('body')
        media_type = request.form.get('media_type', 'none')
        pinned = bool(request.form.get('pinned'))
        media_url = None

        if 'media' in request.files:
            f = request.files['media']
            if f and f.filename:
                ext = f.filename.rsplit('.',1)[-1].lower()
                if media_type == 'image' and ext not in ALLOWED_IMAGE:
                    return jsonify({"error":"invalid_image_type"}), 400
                if media_type == 'video' and ext not in ALLOWED_VIDEO:
                    return jsonify({"error":"invalid_video_type"}), 400
                media_url = save_file_and_get_url(f)

        if media_type == 'embed':
            media_url = request.form.get('embed_url')

        post = Post(title=title, body=body, media_type=media_type, media_url=media_url, pinned=pinned)
        db.session.add(post); db.session.commit()
        return jsonify({"ok": True, "post": post.to_dict()})

    @app.route('/api/admin/posts/<int:post_id>', methods=['DELETE'])
    def admin_delete_post(post_id):
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        p = Post.query.get_or_404(post_id)
        if p.media_url and p.media_url.startswith('/static/uploads/'):
            try:
                fp = p.media_url.lstrip('/')
                full = os.path.join(app.root_path, fp)
                if os.path.exists(full):
                    os.remove(full)
            except Exception:
                pass
        db.session.delete(p); db.session.commit()
        return jsonify({"ok": True})

    # --- Services CRUD ---
    @app.route('/api/services', methods=['GET'])
    def get_services():
        svs = Service.query.order_by(Service.created_at.desc()).all()
        return jsonify([s.to_dict() for s in svs])

    @app.route('/api/admin/services', methods=['POST'])
    def create_service():
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        data = request.form or request.get_json() or {}
        title = data.get('title')
        description = data.get('description')
        price = data.get('price')
        if not title:
            return jsonify({"error":"missing_title"}), 400
        s = Service(title=title, description=description, price=price)
        db.session.add(s); db.session.commit()
        return jsonify({"ok": True, "service": s.to_dict()})

    @app.route('/api/admin/services/<int:sid>', methods=['PUT'])
    def update_service(sid):
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        s = Service.query.get_or_404(sid)
        data = request.form or request.get_json() or {}
        s.title = data.get('title', s.title)
        s.description = data.get('description', s.description)
        s.price = data.get('price', s.price)
        db.session.commit()
        return jsonify({"ok": True, "service": s.to_dict()})

    @app.route('/api/admin/services/<int:sid>', methods=['DELETE'])
    def delete_service(sid):
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        s = Service.query.get_or_404(sid)
        db.session.delete(s); db.session.commit()
        return jsonify({"ok": True})

    # --- Admin profile (profile images) ---
    @app.route('/api/admin/profile', methods=['GET'])
    def get_profile():
        prof = AdminProfile.query.first()
        return jsonify(prof.to_dict() if prof else {})

    @app.route('/api/admin/profile', methods=['POST'])
    def update_profile():
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        prof = AdminProfile.query.first()
        if not prof:
            prof = AdminProfile()
            db.session.add(prof)
        # handle uploads
        if 'profile_main' in request.files:
            f = request.files['profile_main']
            prof.profile_main_url = save_file_and_get_url(f)
        if 'profile_owner' in request.files:
            f = request.files['profile_owner']
            prof.profile_owner_url = save_file_and_get_url(f)
        # optional fields via form
        db.session.commit()
        return jsonify({"ok": True, "profile": prof.to_dict()})

    # --- Visits counter (simple) ---
    @app.route('/api/visit', methods=['POST'])
    def add_visit():
        prof = AdminProfile.query.first()
        if not prof:
            prof = AdminProfile()
            db.session.add(prof)
        prof.visits = (prof.visits or 0) + 1
        db.session.commit()
        return jsonify({"visits": prof.visits})

    # --- YouTube upload endpoint (server-side) ---
    @app.route('/api/admin/upload/youtube', methods=['POST'])
    def upload_youtube():
        if not is_admin_logged_in():
            return jsonify({"error":"unauthorized"}), 401
        from google.oauth2.credentials import Credentials
        from googleapiclient.discovery import build
        from googleapiclient.http import MediaFileUpload

        client_secrets = app.config.get('YT_CLIENT_SECRETS_FILE')
        refresh_token = app.config.get('YT_REFRESH_TOKEN')
        if not client_secrets or not refresh_token:
            return jsonify({"error":"youtube_not_configured"}), 400

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
        except Exception as e:
            app.logger.exception('YouTube build failed')
            return jsonify({"error":"youtube_build_failed"}), 500

        if 'video' not in request.files:
            return jsonify({"error":"no_video"}), 400
        vid = request.files['video']
        filename = secure_filename(vid.filename)
        local_path = Path(app.config['UPLOAD_FOLDER']) / filename
        vid.save(local_path)

        body = {
            'snippet': {
                'title': request.form.get('title') or filename,
                'description': request.form.get('description') or '',
                'tags': request.form.get('tags','').split(','),
                'categoryId': '22'
            },
            'status': {
                'privacyStatus': request.form.get('privacyStatus','public')
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
            try:
                os.remove(local_path)
            except:
                pass
            video_id = response.get('id')
            video_url = f"https://www.youtube.com/watch?v={video_id}"
            return jsonify({"ok": True, "video_url": video_url})
        except Exception as e:
            app.logger.exception('YouTube upload failed')
            return jsonify({"error":"upload_failed"}), 500

    # Serve static (for local media)
    @app.route('/static/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

# backend/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    body = db.Column(db.Text)
    media_type = db.Column(db.String(32), default='none')  # image | video | embed | none
    media_url = db.Column(db.String(1024))
    likes = db.Column(db.Integer, default=0)
    pinned = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "media_type": self.media_type,
            "media_url": self.media_url,
            "likes": self.likes,
            "pinned": self.pinned,
            "created_at": self.created_at.isoformat()
        }

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    service = db.Column(db.String(255))
    date = db.Column(db.String(255))
    contact = db.Column(db.String(255))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    email = db.Column(db.String(255))
    message = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    price = db.Column(db.String(128))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "created_at": self.created_at.isoformat()
        }

class AdminProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    profile_main_url = db.Column(db.String(1024))   # imagen del proyecto / inicio
    profile_owner_url = db.Column(db.String(1024))  # imagen del dueño (About)
    visits = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "profile_main_url": self.profile_main_url,
            "profile_owner_url": self.profile_owner_url,
            "visits": self.visits
        }

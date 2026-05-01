from app import db
from datetime import datetime

class Device(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    mac_address = db.Column(db.String(17), unique=True, nullable=False)  # Format: AA:BB:CC:DD:EE:FF
    ip_address = db.Column(db.String(45), nullable=True)  # IPv4 or IPv6
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationship
    user = db.relationship('User', backref=db.backref('devices', lazy=True))

    def __repr__(self):
        return f'<Device {self.mac_address} for User {self.user_id}>'
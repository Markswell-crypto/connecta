from app import db
from datetime import datetime

class Voucher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), unique=True, nullable=False)
    value = db.Column(db.Float, nullable=False)  # in currency units or data MB, etc.
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    used_at = db.Column(db.DateTime, nullable=True)
    used_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    # Relationship
    used_by = db.relationship('User', backref=db.backref('vouchers_used', lazy=True))

    def __repr__(self):
        return f'<Voucher {self.code}>'
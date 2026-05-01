from app import db
from datetime import datetime

class Subscription(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    package_id = db.Column(db.Integer, db.ForeignKey('package.id'), nullable=False)
    status = db.Column(db.String(20), default='active')  # active, expired, cancelled, suspended
    start_time = db.Column(db.DateTime, default=datetime.utcnow)
    end_time = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    user = db.relationship('User', backref=db.backref('subscriptions', lazy=True))
    package = db.relationship('Package', backref=db.backref('subscriptions', lazy=True))

    def __repr__(self):
        return f'<Subscription {self.id} for User {self.user_id}>'
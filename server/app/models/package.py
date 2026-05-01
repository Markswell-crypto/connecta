from app import db
from datetime import datetime

class Package(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    price = db.Column(db.Float, nullable=False)
    time_limit = db.Column(db.Integer, nullable=True)  # in minutes
    data_limit = db.Column(db.Integer, nullable=True)  # in MB
    speed_limit = db.Column(db.Integer, nullable=True)  # in Mbps

    def __repr__(self):
        return f'<Package {self.name}>'
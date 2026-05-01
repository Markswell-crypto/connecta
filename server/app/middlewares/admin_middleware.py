from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            if not current_user or current_user.role != 'admin':
                return jsonify({'message': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
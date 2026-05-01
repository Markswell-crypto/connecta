from app.models import User, db
from flask import request, jsonify

def get_all_users():
    users = User.query.all()
    result = []
    for u in users:
        result.append({
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'is_active': u.is_active,
            'created_at': u.created_at.isoformat() if u.created_at else None
        })
    return jsonify({'users': result}), 200

def suspend_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Prevent suspending oneself? Optional, but we'll allow it for now.
    user.is_active = False

    try:
        db.session.commit()
        return jsonify({
            'message': 'User suspended successfully',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role,
                'is_active': user.is_active
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to suspend user', 'error': str(e)}), 500

def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Optionally, check if the user has active subscriptions, etc. and prevent deletion?
    # For simplicity, we'll allow deletion.

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete user', 'error': str(e)}), 500
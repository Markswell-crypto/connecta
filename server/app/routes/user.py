from flask import Blueprint
from app.controllers.user_controller import get_all_users, suspend_user, delete_user
from app.middlewares.admin_middleware import admin_required
from flask_jwt_extended import jwt_required

user_bp = Blueprint('user', __name__)

user_bp.route('', methods=['GET'])(jwt_required()(admin_required()(get_all_users)))
user_bp.route('/<int:user_id>/suspend', methods=['POST'])(jwt_required()(admin_required()(suspend_user)))
user_bp.route('/<int:user_id>', methods=['DELETE'])(jwt_required()(admin_required()(delete_user)))
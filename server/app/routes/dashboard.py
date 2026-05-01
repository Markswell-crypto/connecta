from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.middlewares.admin_middleware import admin_required
from app.controllers.dashboard_controller import get_dashboard_stats

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required()
def get_dashboard_stats_route():
    stats = get_dashboard_stats()
    return jsonify(stats), 200
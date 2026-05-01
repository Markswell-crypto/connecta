from flask import Blueprint, request, jsonify
from app.controllers.voucher_controller import generate_vouchers, redeem_voucher
from app.middlewares.admin_middleware import admin_required
from flask_jwt_extended import jwt_required

voucher_bp = Blueprint('voucher', __name__)

@voucher_bp.route('/generate', methods=['POST'])
@jwt_required()
@admin_required()
def generate_vouchers_route():
    data = request.get_json()
    count = data.get('count', 1)
    value = data.get('value')
    expires_at_str = data.get('expires_at')
    
    if not value or not expires_at_str:
        return jsonify({'message': 'Value and expires_at are required'}), 400
    
    try:
        from datetime import datetime
        expires_at = datetime.fromisoformat(expires_at_str.replace('Z', '+00:00'))
        vouchers = generate_vouchers(count, value, expires_at)
        return jsonify({'vouchers': vouchers}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to generate vouchers', 'error': str(e)}), 500

@voucher_bp.route('/redeem', methods=['POST'])
@jwt_required()
def redeem_voucher_route():
    data = request.get_json()
    code = data.get('code')
    
    if not code:
        return jsonify({'message': 'Voucher code is required'}), 400
    
    # Get user_id from JWT
    from flask_jwt_extended import get_jwt_identity
    user_id = get_jwt_identity()
    
    result, status_code = redeem_voucher(code, user_id)
    return jsonify(result), status_code
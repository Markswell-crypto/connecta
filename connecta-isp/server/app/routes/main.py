from flask import Blueprint

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return {'message': 'Welcome to Connecta ISP API'}

@main_bp.route('/health')
def health():
    return {'status': 'OK'}
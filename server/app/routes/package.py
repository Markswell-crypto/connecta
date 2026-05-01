from flask import Blueprint
from app.controllers.package_controller import create_package, get_all_packages, update_package, delete_package
from app.middlewares.admin_middleware import admin_required
from flask_jwt_extended import jwt_required

package_bp = Blueprint('package', __name__)

package_bp.route('', methods=['POST'])(jwt_required()(admin_required()(create_package)))
package_bp.route('', methods=['GET'])(jwt_required()(get_all_packages))
package_bp.route('/<int:package_id>', methods=['PUT'])(jwt_required()(admin_required()(update_package)))
package_bp.route('/<int:package_id>', methods=['DELETE'])(jwt_required()(admin_required()(delete_package)))
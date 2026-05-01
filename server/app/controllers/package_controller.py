from app.models import Package, db
from flask import request, jsonify

def create_package():
    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    time_limit = data.get('time_limit')
    data_limit = data.get('data_limit')
    speed_limit = data.get('speed_limit')

    if not name or price is None:
        return jsonify({'message': 'Name and price are required'}), 400

    if Package.query.filter_by(name=name).first():
        return jsonify({'message': 'Package with this name already exists'}), 409

    package = Package(
        name=name,
        price=price,
        time_limit=time_limit,
        data_limit=data_limit,
        speed_limit=speed_limit
    )

    try:
        db.session.add(package)
        db.session.commit()
        return jsonify({
            'message': 'Package created successfully',
            'package': {
                'id': package.id,
                'name': package.name,
                'price': package.price,
                'time_limit': package.time_limit,
                'data_limit': package.data_limit,
                'speed_limit': package.speed_limit
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to create package', 'error': str(e)}), 500

def get_all_packages():
    packages = Package.query.all()
    result = []
    for p in packages:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'time_limit': p.time_limit,
            'data_limit': p.data_limit,
            'speed_limit': p.speed_limit
        })
    return jsonify({'packages': result}), 200

def update_package(package_id):
    package = Package.query.get(package_id)
    if not package:
        return jsonify({'message': 'Package not found'}), 404

    data = request.get_json()
    name = data.get('name')
    price = data.get('price')
    time_limit = data.get('time_limit')
    data_limit = data.get('data_limit')
    speed_limit = data.get('speed_limit')

    if name:
        # Check if another package has this name
        existing = Package.query.filter_by(name=name).first()
        if existing and existing.id != package_id:
            return jsonify({'message': 'Package with this name already exists'}), 409
        package.name = name

    if price is not None:
        package.price = price
    if time_limit is not None:
        package.time_limit = time_limit
    if data_limit is not None:
        package.data_limit = data_limit
    if speed_limit is not None:
        package.speed_limit = speed_limit

    try:
        db.session.commit()
        return jsonify({
            'message': 'Package updated successfully',
            'package': {
                'id': package.id,
                'name': package.name,
                'price': package.price,
                'time_limit': package.time_limit,
                'data_limit': package.data_limit,
                'speed_limit': package.speed_limit
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to update package', 'error': str(e)}), 500

def delete_package(package_id):
    package = Package.query.get(package_id)
    if not package:
        return jsonify({'message': 'Package not found'}), 404

    try:
        db.session.delete(package)
        db.session.commit()
        return jsonify({'message': 'Package deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'Failed to delete package', 'error': str(e)}), 500
from app.models import Voucher, User, Subscription, Package, Payment, db
from datetime import datetime, timedelta
import random
import string

def generate_voucher_code(length=10):
    """Generate a random voucher code"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

def generate_vouchers(count, value, expires_at):
    """Generate multiple vouchers in bulk"""
    vouchers = []
    for _ in range(count):
        while True:
            code = generate_voucher_code()
            # Ensure code is unique
            if not Voucher.query.filter_by(code=code).first():
                break
        
        voucher = Voucher(
            code=code,
            value=value,
            expires_at=expires_at,
            is_used=False
        )
        vouchers.append(voucher)
    
    try:
        db.session.bulk_save_objects(vouchers)
        db.session.commit()
        return [{'code': v.code, 'value': v.value, 'expires_at': v.expires_at.isoformat()} for v in vouchers]
    except Exception as e:
        db.session.rollback()
        raise e

def redeem_voucher(code, user_id):
    """Redeem a voucher for a user"""
    voucher = Voucher.query.filter_by(code=code, is_used=False).first()
    
    if not voucher:
        return {'message': 'Invalid voucher code'}, 404
    
    if voucher.expires_at < datetime.utcnow():
        return {'message': 'Voucher has expired'}, 400
    
    # Mark voucher as used
    voucher.is_used = True
    voucher.used_at = datetime.utcnow()
    voucher.used_by_id = user_id
    
    try:
        # Apply voucher value to user's subscription
        # Find user's active subscription
        active_subscription = Subscription.query.filter_by(
            user_id=user_id, 
            status='active'
        ).first()
        
        if active_subscription:
            # Get the package details
            package = Package.query.get(active_subscription.package_id)
            if package:
                # Calculate extension days based on voucher value
                # Assuming package.price is monthly cost
                if package.price > 0:
                    extension_days = (voucher.value / package.price) * 30
                    # Extend the subscription
                    if active_subscription.end_time:
                        active_subscription.end_time += timedelta(days=extension_days)
                    else:
                        # If no end time, set it from now
                        active_subscription.end_time = datetime.utcnow() + timedelta(days=extension_days)
        
        # Create a payment record for tracking
        payment = Payment(
            user_id=user_id,
            amount=voucher.value,
            transaction_id=f"VOUCHER-{voucher.code}",
            status='completed'
        )
        db.session.add(payment)
        
        db.session.commit()
        
        return {
            'message': 'Voucher redeemed successfully',
            'voucher': {
                'code': voucher.code,
                'value': voucher.value,
                'used_at': voucher.used_at.isoformat()
            }
        }, 200
    except Exception as e:
        db.session.rollback()
        return {'message': 'Failed to redeem voucher', 'error': str(e)}, 500
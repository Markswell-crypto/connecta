from app.models import User, Package, Payment, Session
from app import db
from datetime import datetime, timedelta
from sqlalchemy import func

def get_dashboard_stats():
    # Total users
    total_users = User.query.count()
    
    # Active users (with active subscription)
    active_users = db.session.query(User.id).join(Subscription).filter(
        Subscription.status == 'active',
        Subscription.end_time > datetime.utcnow()
    ).distinct().count()
    
    # Active sessions
    active_sessions = Session.query.filter(Session.end_time.is_(None)).count()
    
    # Revenue (completed payments)
    revenue_result = db.session.query(func.sum(Payment.amount)).filter(
        Payment.status == 'completed'
    ).scalar()
    revenue = float(revenue_result) if revenue_result else 0.0
    
    # Total packages
    total_packages = Package.query.count()
    
    # Recent payments (last 5)
    recent_payments = Payment.query.order_by(Payment.created_at.desc()).limit(5).all()
    recent_payments_data = []
    for p in recent_payments:
        recent_payments_data.append({
            'id': p.id,
            'user_name': p.user.name if p.user else 'Unknown',
            'amount': p.amount,
            'transaction_id': p.transaction_id,
            'status': p.status,
            'created_at': p.created_at.isoformat() if p.created_at else None
        })
    
    # Active sessions detail
    active_sessions_detail = Session.query.filter(Session.end_time.is_(None)).all()
    active_sessions_data = []
    for s in active_sessions_detail:
        active_sessions_data.append({
            'id': s.id,
            'user_name': s.user.name if s.user else 'Unknown',
            'start_time': s.start_time.isoformat() if s.start_time else None,
            'data_used': s.data_used
        })
    
    # Users list (limited)
    users_list = User.query.limit(10).all()
    users_data = []
    for u in users_list:
        users_data.append({
            'id': u.id,
            'name': u.name,
            'email': u.email,
            'role': u.role,
            'is_active': u.is_active,
            'created_at': u.created_at.isoformat() if u.created_at else None
        })
    
    return {
        'total_users': total_users,
        'active_users': active_users,
        'active_sessions': active_sessions,
        'revenue': revenue,
        'total_packages': total_packages,
        'recent_payments': recent_payments_data,
        'active_sessions_detail': active_sessions_data,
        'users_list': users_data
    }
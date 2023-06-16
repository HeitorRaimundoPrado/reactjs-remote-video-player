import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, get_jwt_identity, unset_jwt_cookies, get_jwt, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timezone, timedelta
from models import User # type: ignore
from __init__ import db

bp = Blueprint('auth', __name__)

@bp.route('/api/auth/signup', methods=["POST"])
def signup_user():
    email = request.get_json().get('email')
    username = request.get_json().get('name')
    password = request.get_json().get('password')
    if email is None or username is None or password is None:
        return {}

    user = User.query.filter_by(email=email).first()

    if user:
        return {'user': 'exists'}

    new_user = User(email=email, name=username, password=generate_password_hash(password, method='sha256'))
    db.session.add(new_user)
    db.session.commit()

    return {'user': 'created'}

@bp.route('/api/auth/token', methods=["POST"])
def create_token():
    email = request.get_json().get('email', None)
    password = request.get_json().get('password', None)
    print(request.form)

    if email is None or password is None:
        return {}

    access_token = create_access_token(identity=email)

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return ['denied']

    response = {'access_token': access_token}
    return response

@bp.route('/logout', methods=["POST"])
def logout():
    response = jsonify({'msg': 'sucess'})
    unset_jwt_cookies(response)
    return response

@bp.after_app_request
def refresh_expriring_jwts(response):
    try:
        exp_timestamp = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30)) # expiry time = 30min
        if target_timestamp > exp_timestamp:
            acess_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data['acess_token'] = acess_token
                response.data = json.dumps(data)

        return response

    except (RuntimeError, KeyError): # there is no valid JWT
        return response


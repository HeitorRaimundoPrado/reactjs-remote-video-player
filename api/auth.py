import json
import os
from flask import Blueprint, request, jsonify, current_app, session
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

    try:
        private_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], "private")
        os.makedirs(os.path.join(private_dir, str(new_user.id)))

    except OSError:
        pass

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
    response = jsonify({'msg': 'success'})
    unset_jwt_cookies(response)
    return response

def refresh_token():
    current_user = get_jwt_identity()
    new_token = create_access_token(identity=current_user)
    response = jsonify({'token': new_token})
    response.set_cookie('token', new_token)  # Update the token in the client-side cookie
    return response

@bp.after_app_request
def refresh_expring_jwt(response):
    if response.status_code == 200 and 'token' in request.cookies:
        refresh_token()
    return response


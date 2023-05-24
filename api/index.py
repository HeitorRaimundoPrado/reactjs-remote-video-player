from flask import Blueprint

bp = Blueprint('react', __name__)

@bp.route('/hello')
def index():
    return {
            'testing': 'test'
    }

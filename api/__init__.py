from flask import Flask

def create_app(deployment: bool):
    app = Flask(__name__)
    if deployment == False:
        from flask_cors import CORS # remove on deployment
        CORS(app)
    from index import bp
    app.register_blueprint(bp)
    return app

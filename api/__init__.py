from flask import Flask
import os

UPLOAD_DIRECTORY = 'upload'

def create_app(deployment: bool):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev', # change on deployment
        UPLOAD_DIRECTORY=os.path.join(app.instance_path, UPLOAD_DIRECTORY)
        )

    if deployment == False:
        from flask_cors import CORS # remove on deployment
        CORS(app)

    import music
    import index
    import youtube
    app.register_blueprint(index.bp)
    app.register_blueprint(music.bp)
    app.register_blueprint(youtube.bp)

    return app

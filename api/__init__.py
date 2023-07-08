from flask import Flask
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import os

UPLOAD_DIRECTORY = 'upload'

db = SQLAlchemy()

def create_app(debug=False):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='change-in-deployment', # change on deployment
        UPLOAD_DIRECTORY=os.path.join(app.instance_path, UPLOAD_DIRECTORY),
        JWT_SECRET_KEY='change-in-deployment',
        # JWT_TOKEN_LOCATION=['cookies'],
        JWT_ACESS_TOKEN_EXPIRES=timedelta(hours=24),
        SQLALCHEMY_DATABASE_URI='sqlite:///db.sqlite'
        )

    # if debug == True:
    from flask_cors import CORS # remove on deployment
    CORS(app, supports_credentials=True, expose_headers="Authorization")
 
    jwt = JWTManager(app)
    # app.config['CORS_HEADERS'] = 'Content-Type'
    db.init_app(app)

    import models # type: ignore
    with app.app_context():
        db.create_all()

    private_dir = os.path.join(app.config["UPLOAD_DIRECTORY"], "private")
    music_dir = os.path.join(app.config["UPLOAD_DIRECTORY"], "music")
    playlist_dir = os.path.join(app.config["UPLOAD_DIRECTORY"], "playlists")
    video_dir = os.path.join(app.config['UPLOAD_DIRECTORY'], 'video')
    tmp_dir = os.path.join(app.config['UPLOAD_DIRECTORY'], 'temp')

    dirs_to_create = [app.instance_path, app.config["UPLOAD_DIRECTORY"], private_dir, music_dir, playlist_dir, video_dir, tmp_dir]

    for dir in dirs_to_create:
        try:
            os.makedirs(dir)

        except OSError:
            print("directory already exists...")
            print("skipping creation\n")


    import music
    import index
    import youtube
    import auth
    import video
    import upload
    app.register_blueprint(index.bp)
    app.register_blueprint(music.bp)
    app.register_blueprint(youtube.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(video.bp)
    app.register_blueprint(upload.bp)


    return app

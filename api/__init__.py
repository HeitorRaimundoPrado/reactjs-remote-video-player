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
        JWT_ACESS_TOKEN_EXPIRES=timedelta(hours=1),
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

    dirs_to_create = [app.instance_path, app.config["UPLOAD_DIRECTORY"], private_dir, music_dir, playlist_dir]

    for dir in dirs_to_create:
        try:
            os.makedirs(dir)

        except OSError:
            print("directory already exists...")
            print("skipping creation\n")



    return app

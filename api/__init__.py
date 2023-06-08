from flask import Flask
import os

UPLOAD_DIRECTORY = 'upload'

def create_app(debug=False):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='dev', # change on deployment
        UPLOAD_DIRECTORY=os.path.join(app.instance_path, UPLOAD_DIRECTORY)
        )

    # if debug == True:
    from flask_cors import CORS # remove on deployment
    CORS(app)
    # app.config['CORS_HEADERS'] = 'Content-Type'

    try:
        os.makedirs(app.instance_path)
        os.makedirs(app.config["UPLOAD_DIRECTORY"])

    except OSError:
        pass

    return app

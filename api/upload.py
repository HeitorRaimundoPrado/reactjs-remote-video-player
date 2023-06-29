from flask import Blueprint, redirect, url_for, request, session, current_app
import os
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm3u', 'txt', 'mp4']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/api/upload', methods=["POST"])
def upload_file():

    private = request.form.get('private')
    private = 0 if private is None else int(private)

    song_name = str(request.form.get('song_name'))
    artist = str(request.form.get('artist'))

    access_token = None
    print('private == ' + str(private))

    if private != 0:
        auth_header = request.headers.get('Authorization')
        print('entering if private != 0')
        if not auth_header:
            return 'Unauthorized', 401

        access_token = auth_header.split()[1]


    if 'file' not in request.files:
        return "No file Identified"

    file = request.files['file']

    if file.filename == '':
        return "No file Identified"

    if not file or not allowed_file(file.filename):
        return "No allowed file Identified"

    if file.filename is None:
        return "No file Identified"



    filename = secure_filename(file.filename)
    
    temp_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'temp')
    file.save(os.path.join(temp_dir, filename))
            

    from models import File
    n_file = File(name=song_name, file=filename, artist=artist)
    from __init__ import db
    db.session.add(n_file)
    db.session.commit()


    if filename.split('.')[1] == 'mp4':
        response = redirect(url_for('video.upload_video_file', private=private, file_name=filename), code=307)

    else:
        response = redirect(url_for('music.upload_music_file', private=private, file_name=filename), code=307)

    if private != 0 and access_token is not None:
        response.headers['Authorization'] = 'Bearer ' + access_token

    return response


from flask import Blueprint, redirect, url_for, request, session, current_app
import os
from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.utils import secure_filename

bp = Blueprint('upload', __name__)

ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm3u', 'txt', 'mp4']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/api/upload', methods=["POST"])
@jwt_required(optional=True)
def upload_file():
    private = request.form.get('private')
    private = 0 if private is None else int(private)

    song_name = str(request.form.get('song_name'))
    artist = str(request.form.get('artist'))


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
            
    if private:
        from models import User, File
        user_email = get_jwt_identity()
        print('user_email = ')
        print(user_email)

        cur_user = User.query.filter_by(email=user_email).first()

        print('cur user = ')
        print(cur_user)

        n_file = File(name=song_name, file=filename, artist=artist, private=private, user_own=cur_user.id)

        cur_user.private_files.append(n_file)

    else:
        from models import File
        n_file = File(name=song_name, file=filename, artist=artist, private=private, user_own=None)

    from __init__ import db
    db.session.add(n_file)
    db.session.commit()


    if filename.split('.')[1] == 'mp4':
        response = redirect(url_for('video.upload_video_file', private=private, file_name=filename), code=307)

    else:
        response = redirect(url_for('music.upload_music_file', private=private, file_name=filename), code=307)

    if 'Authorization' in request.headers:
        response.headers['Authorization'] = str(request.headers.get('Authorization'))

    return response


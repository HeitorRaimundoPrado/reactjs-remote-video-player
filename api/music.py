from flask import Blueprint, Response, current_app, redirect, request, send_from_directory, jsonify, url_for
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import mimetypes

ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm3u', 'txt']
CHANNELS = 2
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 5


bp = Blueprint('music', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@bp.route('/api/music/delete/<string:filename>')
@jwt_required(True)
def delete_song(filename: str):
    private = request.args.get('private')
    private = 0 if private is None else int(private)

    if private:
        private_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'private')

        from models import User
        
        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        user_dir = os.path.join(private_dir, str(user.id))

        file_path = os.path.join(user_dir, filename)

    else:
        music_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music')
        file_path = os.path.join(music_dir, filename)

    os.remove(file_path)

    return {}

@bp.route('/api/private/music/delete/<string:filename>', methods=["POST"])
@jwt_required(False)
def delete_private_file(filename: str):
    return redirect(url_for('music.delete_song', filename=filename, private=1))

# returns all music files in UPLOAD_DIRECTORY/music
@bp.route('/api/music')
def get_all_music():
    return os.listdir(os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music'))


# returns an audio file as attachment
@bp.route('/api/music/<string:filename>')
@jwt_required(True)
def get_music_file(filename: str):
    private = request.args.get('private')
    private = 0 if private is None else int(private)

    music_upload_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'music')

    if private:
        private_upload_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'private')

        from models import User

        user_email = get_jwt_identity()

        if user_email is None:
            return "unauthorized", 301

        user = User.query.filter_by(email=user_email).first()
        user_dir = os.path.join(private_upload_dir, str(user.id))

        file_path = os.path.join(user_dir, filename)

    else:
        file_path = os.path.join(music_upload_dir, filename)


    def generate():
        with open(file_path, 'rb') as audio_file:
            start = 0
            audio_file.seek(start)

            range_header = request.headers.get('Range')
            if range_header and range_header.startswith('bytes='):
                start_range, end_range = range_header.split('=')[1].split('-')
                start = int(start_range) if start_range else 0
                audio_file.seek(start)

                if end_range:
                    end = int(end_range)
                    length = end - start + 1
                    response_headers = {
                        'Content-Range': f'bytes {start}-{end}/{os.path.getsize(file_path)}',
                        'Content-Length': str(length),
                        'Accept-Ranges': 'bytes',
                    }
                    response = Response(audio_file.read(length), status=206, headers=response_headers)
                    return response

            response_headers = {
                'Content-Length': str(os.path.getsize(file_path)),
                'Accept-Ranges': 'bytes',
            }
            response = Response(audio_file.read(), status=200, headers=response_headers)
            return response

    return generate()


@bp.route('/api/private/music/<string:filename>')
@jwt_required(False)
def get_private_music(filename: str):
    return redirect(url_for('music.get_music_file', filename=filename, private=1))

# returns an array with all playlists in UPLOAD_DIRECTORY/playlists
@bp.route('/api/playlists')
def get_all_playlists():
    return os.listdir(os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'playlists'))

# returns the text file that corresponds to <filename> playlist
@bp.route('/api/playlists/<string:filename>')
def get_playlist(filename: str):
    playlists_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'playlists')
    with open(os.path.join(playlists_dir, filename)) as f:
        return f.read().split('\n')

# uploads an audio file
@bp.route('/api/upload/music/', methods=["POST"])
@jwt_required(True)
def upload_music_file():

    private = request.form.get('private')
    private = 0 if private is None else int(private)

    if 'file' not in request.files:
        return "No file Identified"

    file = request.files['file']

    if file.filename == '':
        return "No file Identified"

    if file and allowed_file(file.filename):
        if file.filename is None:
            return "NO file Identified"
        filename = secure_filename(file.filename)

        music_upload_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music')
        private_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'private')


        
        try:
            os.makedirs(music_upload_dir)

        except OSError:
            pass
        
        if not private:
            file.save(os.path.join(music_upload_dir, filename))

        else:
            from models import User

            user_email = get_jwt_identity()
            user = User.query.filter_by(email=user_email).first()

            user_dir = os.path.join(private_dir, str(user.id))
            file.save(os.path.join(user_dir, filename))

    return {}

# uploads a text playlist
@bp.route('/api/upload/playlist/', methods=["POST"])
def upload_text_playlis():
    print()
    print(request.files)
    print(request.form)
    print()

    if 'file' not in request.files:
        return "No file Identified"

    file = request.files['file']
    file_name = request.form['filename']

    if file.filename == '':
        return "No file Identified"

    if file.filename == 'blob':
        file.filename = file_name


    if file and allowed_file(file.filename):
        if file.filename is None:
            return "NO file Identified"

        filename = secure_filename(file.filename)

        playlist_upload_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'playlists')
        try:
            os.makedirs(playlist_upload_dir)

        except OSError:
            pass

        print()
        print(os.path.join(playlist_upload_dir, filename))
        print()
        file.save(os.path.join(playlist_upload_dir, filename))

    return 'saved'

@bp.route('/api/delete/playlist')
def delete_playlist():
    playlist_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'playlists')
    playlist_to_delete = os.path.join(playlist_dir, request.args['playlist'])
    if os.path.exists(playlist_to_delete):
        os.remove(playlist_to_delete)

    return 'deleted'

@bp.route('/api/files/private')
@jwt_required(False)
def get_private_files():
    user_email = get_jwt_identity()

    from models import User
    user = User.query.filter_by(email=user_email).first()

    all_private_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'private') 
    user_dir = os.path.join(all_private_dir, str(user.id))

    print("\n\nuser_dir = " + str(os.listdir(user_dir)) + "\n\n")

    return jsonify(os.listdir(user_dir)), 200

from flask import Blueprint, Response, current_app, request, send_from_directory
from werkzeug.utils import secure_filename
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


# returns all music files in UPLOAD_DIRECTORY/music
@bp.route('/api/music')
def get_all_music():
    return os.listdir(os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music'))


# returns an audio file as attachment
@bp.route('/api/music/<string:filename>')
def get_music_file(filename: str):
    music_upload_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'music')
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
def upload_music_file():
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
        try:
            os.makedirs(music_upload_dir)

        except OSError:
            pass
        
        file.save(os.path.join(music_upload_dir, filename))

    return ''

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

    print()
    print(file.filename)
    print()

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
        print(os.path.join(playlist_upload_dir, file.filename))
        print()
        file.save(os.path.join(playlist_upload_dir, file.filename))

    return 'saved'

@bp.route('/api/delete/playlist')
def delete_playlist():
    print()
    print(request.args)
    print(request.form)
    print(request.data)
    print()
    playlist_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'playlists')
    playlist_to_delete = os.path.join(playlist_dir, request.args['playlist'])
    if os.path.exists(playlist_to_delete):
        os.remove(playlist_to_delete)

    return 'deleted'


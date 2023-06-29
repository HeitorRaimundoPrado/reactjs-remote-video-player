from flask import Blueprint, Response, current_app, redirect, request, send_from_directory, jsonify, url_for, session
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import json

import sqlalchemy

CHANNELS = 2
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 5

ALLOWED_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm3u', 'txt', 'mp4']

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


bp = Blueprint('music', __name__)

@bp.route('/api/music/delete/<int:id>', methods=["POST"])
@jwt_required(True)
def delete_song(id: int):
    private = request.args.get('private')
    private = 0 if private is None else int(private)
    filename = request.args.get('filename')
    if filename is None:
        return '', 404

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

        from models import File

        f_to_del = File.query.filter_by(id=id).first()
        
        from __init__ import db

        db.session.delete(f_to_del)
        db.session.commit()

    os.remove(file_path)

    return {}

@bp.route('/api/private/music/delete/<string:filename>', methods=["POST"])
@jwt_required(False)
def delete_private_file(filename: str):
    return redirect(url_for('music.delete_song', filename=filename, private=1))

# returns all music files in UPLOAD_DIRECTORY/music
@bp.route('/api/music')
def get_all_music():
    from models import File

    all_songs = File.query.all()
    ret = list()
    print("\nall songs: " + str(all_songs) + '\n\n')

    for song in all_songs:
        ret.append(dict({'name': song.name,'file': song.file,'artist': song.artist}))

    return ret

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
    from models import Playlist
    from __init__ import db

    all_playlists = Playlist.query.all()
    for play in all_playlists:
        print('play.files:')
        print(type(play.files))
            # print(file)
        print()

    a = [{'id': playlist.id, 'name': playlist.name, 'files': [{'name': file.name, 'file': file.file, 'id': file.id, 'artist': file.artist} for file in playlist.files]} for playlist in all_playlists]
    print(str(a))
    return a

# uploads an audio file
@bp.route('/api/upload/music/', methods=["POST"])
def upload_music_file():

    private = request.form.get('private')
    private = 0 if private is None else int(private)
    filename = str(request.args.get('file_name'))


    temp_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'temp')
    file = open(os.path.join(temp_dir, filename), 'rb')

    
    if file.name is None:
        return "No filename specified"


    music_upload_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music')
    private_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'private')


    
    try:
        os.makedirs(music_upload_dir)

    except OSError:
        pass
    
    if not private:
        with open(os.path.join(music_upload_dir, filename), 'wb+') as f:
            f.write(file.read())

    else:
        from models import User

        user_email = get_jwt_identity()
        user = User.query.filter_by(email=user_email).first()

        user_dir = os.path.join(private_dir, str(user.id))
        with open(os.path.join(user_dir, filename), 'wb+') as f:
            f.write(file.read())

    
    if os.path.exists(os.path.join(temp_dir, filename)):
        os.remove(os.path.join(temp_dir, filename))

    return {}

# uploads a text playlist
@bp.route('/api/upload/playlist/', methods=["POST"])
def upload_text_playlis():
    from models import Playlist
    from __init__ import db

    name = request.form.get('name')
    files = request.form.get('files')
    
    print('\n\nfiles = ' + str(files) + '\n\n')
    if name is None or files is None:
        return 'No name',404

    files = json.loads(files)
    
    from models import File
    new_playlist = Playlist(name=name, files=[File.query.filter_by(file=file['file']).first() for file in files])
    print('\n\nnew_playlist.files = ' + str(new_playlist.files) + '\n\n')

    db.session.add(new_playlist)
    db.session.commit()

    return 'saved'

@bp.route('/api/delete/playlist')
def delete_playlist():
    play_to_del = request.args.get('playlist')
    if play_to_del is None:
        return 'no playlist', 404

    from models import Playlist
    from __init__ import db

    play_del = Playlist.query.filter_by(id=play_to_del).first()
    db.session.delete(play_del)
    db.session.commit()


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

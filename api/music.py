from flask import Blueprint

bp = Blueprint('music', __name__)

# returns all music files in UPLOAD_DIRECTORY/music
@bp.route('/api/music')
def get_all_nmusic():
    return ['a', 'b', 'c']

# returns an audio file as attachment
@bp.route('/api/music/<string:filename>')
def get_music_file(filename: str):
    return 'filename'

# returns an array with all playlists in UPLOAD_DIRECTORY/playlists
@bp.route('/api/playlists')
def get_all_playlists():
    return []

# returns the text file that corresponds to <filename> playlist
@bp.route('/api/playlists/<string:filename>')
def get_playlist(filename: str):
    return 'file'

# uploads an audio file
@bp.route('/api/upload/music/', methods=["POST"])
def upload_music_file():
    return [200]

# uploads a text playlist
@bp.route('/api/upload/playlist/', methods=["POST"])
def upload_text_playlis():
    return [200]

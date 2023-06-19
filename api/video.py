from flask import Blueprint, current_app, send_file, request
from flask_jwt_extended import get_jwt_identity, jwt_required
import os

from werkzeug.utils import secure_filename

bp = Blueprint('video',  __name__)

# list all video files in uploads/video
@bp.route('/api/video')
def get_all_video():
    video_directory = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'video')
    return os.listdir(video_directory)

@bp.route('/api/video/<string:filename>')
def get_public_video(filename: str):
    video_directory = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'video')
    filepath = os.path.join(video_directory, filename)
    if not os.path.isfile(filepath):
        return "File not found", 404

    file_size = os.path.getsize(filepath)
    range_header = request.headers.get('Range')

    if range_header:
        start, end = parse_range_header(range_header, file_size)
        if start is None or end is None:
            return "Invalid range", 400

        length = end - start + 1
        headers = {
            'Content-Range': f'bytes {start}-{end}/{file_size}',
            'Content-Length': str(length),
            'Accept-Ranges': 'bytes',
            'Content-Type': 'video/mp4'
        }

        response = send_file(filepath, conditional=True)
        for key, value in headers.items():
            response.headers[key] = value

        return response, 206

    return send_file(filepath), 206


def parse_range_header(range_header, file_size):
    _, range_params = range_header.split('=')
    start, end = range_params.split('-')
    start = int(start) if start else 0
    end = int(end) if end else file_size - 1

    if start >= file_size or end >= file_size or start > end:
        return None, None

    return start, end



@bp.route('/api/video/upload', methods=["POST"])
def upload_video_file():
    temp_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'temp')
    filename = str(request.args.get('file_name'))
    file = open(os.path.join(temp_dir, filename), 'rb')

    if file.name is None:
        return "No identified file"


    video_upload_dir = os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'video')
    
    try:
        os.makedirs(video_upload_dir)

    except OSError:
        pass

    with open(os.path.join(video_upload_dir, filename), 'wb+') as f:
        f.write(file.read())

    if os.path.exists(os.path.join(temp_dir, filename)):
        os.remove(os.path.join(temp_dir, filename))

    return 'success', 200


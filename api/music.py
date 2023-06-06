from flask import Blueprint, Response, current_app, request
from werkzeug.utils import secure_filename
import wave
import os
import numpy as np
from scipy.io import wavfile

ALLOWED_EXTENSIONS = ['wav', 'ogg']
CHANNELS = 2
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 5


bp = Blueprint('music', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/test-current-app')
def test_current_app():
    print(current_app.config["UPLOAD_DIRECTORY"])
    return [200]

def genHeader(sampleRate, bitsPerSample, channels):
    datasize = 2000*10**6
    o = bytes("RIFF",'ascii')                                               # (4byte) Marks file as RIFF
    o += (datasize + 36).to_bytes(4,'little')                               # (4byte) File size in bytes excluding this and RIFF marker
    o += bytes("WAVE",'ascii')                                              # (4byte) File type
    o += bytes("fmt ",'ascii')                                              # (4byte) Format Chunk Marker
    o += (16).to_bytes(4,'little')                                          # (4byte) Length of above format data
    o += (1).to_bytes(2,'little')                                           # (2byte) Format type (1 - PCM)
    o += (channels).to_bytes(2,'little')                                    # (2byte)
    o += (sampleRate).to_bytes(4,'little')                                  # (4byte)
    o += (sampleRate * channels * bitsPerSample // 8).to_bytes(4,'little')  # (4byte)
    o += (channels * bitsPerSample // 8).to_bytes(2,'little')               # (2byte)
    o += (bitsPerSample).to_bytes(2,'little')                               # (2byte)
    o += bytes("data",'ascii')                                              # (4byte) Data Chunk Marker
    o += (datasize).to_bytes(4,'little')                                    # (4byte) Data size in bytes
    return o

# returns all music files in UPLOAD_DIRECTORY/music
@bp.route('/api/music')
def get_all_music():
    return ['a', 'b', 'c']


# returns an audio file as attachment
@bp.route('/api/music/<string:filename>')
def get_music_file(filename: str):
    wav_header = genHeader(44100, 16, 2)
    instance_path = current_app.config["UPLOAD_DIRECTORY"]
    file_path = os.path.join(instance_path, filename)
    print(file_path)
    def generate():
        if (os.path.exists(file_path)):
            print(f'\n\n{file_path}\n\n')

        else:
            print('\n\nDoesnt exist\n\n')
        frequency, signal = wavfile.read(file_path)

        print(f'\n\n{frequency}\n\n\n')
        slice_length = 1
        overlap = 0
        slices = np.arange(0, len(signal)/frequency, slice_length - overlap, np.int64)

        for start, end in zip(slices[:-1], slices[1:]):
            start_audio = start * frequency
            end_audio = (end + overlap) * frequency
            audio_slice = signal[int(start_audio) : int(end_audio)]

            import io

            bytes_wav = bytes()
            byte_io = io.BytesIO(bytes_wav)
            wavfile.write(byte_io, 44100, audio_slice)
            yield wav_header + byte_io.read()

    return current_app.response_class(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")

@bp.route('/test-yield')
def test_yield():
    def gen():
        for i in range(200):
            yield bytes(str(i), encoding="UTF-8")
            
    return current_app.response_class(gen(), mimetype="json")

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
    if 'file' not in request.files:
        return "No file Identified"

    file = request.files['file']

    if file.filename == '':
        return "No file Identified"

    if file and allowed_file(file.filename):
        if file.filename is None:
            return "NO file Identified"
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_DIRECTORY'], filename))

    return [200]

# uploads a text playlist
@bp.route('/api/upload/playlist/', methods=["POST"])
def upload_text_playlis():
    return [200]

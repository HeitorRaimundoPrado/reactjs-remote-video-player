from flask import Blueprint, Response, current_app, request, send_from_directory
from werkzeug.utils import secure_filename
import wave
import pydub.utils
import os
import numpy as np
from scipy.io import wavfile
import pydub

ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm3u', 'txt']
CHANNELS = 2
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 5


bp = Blueprint('music', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# Generates the .wav file header for a given set of samples and specs
def genHeader(sampleRate, bitsPerSample, channels, sampleSize):
    datasize = sampleSize * channels * bitsPerSample // 8
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
    return os.listdir(os.path.join(current_app.config['UPLOAD_DIRECTORY'], 'music'))


# returns an audio file as attachment
@bp.route('/api/music/<string:filename>')
def get_music_file(filename: str):
    music_upload_dir = os.path.join(current_app.config["UPLOAD_DIRECTORY"], 'music')
    file_path = os.path.join(music_upload_dir, filename)

    def generate():
        if (not os.path.exists(file_path)):
            return

        if file_path[-4:] == '.wav': 
            segment = pydub.AudioSegment.from_wav(file_path)

            with open(file_path, 'rb') as f:
                import io
                input_wav = f.read()
                rate, signal = wavfile.read(io.BytesIO(input_wav))


            samples = signal
            sample_rate = rate


            wav_header = genHeader(sample_rate, 16, 2, len(samples))

            slice_length = 13
            overlap = 0
            slices = np.arange(0, len(samples) / sample_rate  , slice_length - overlap)
            slices = np.append(slices, len(samples)/sample_rate)

            
            for start, end in zip(slices[:-1], slices[1:]):
                start_audio = start * sample_rate
                end_audio = (end + overlap) * sample_rate
                audio_slice = samples[int(start_audio) : int(end_audio)]

                import io

                bytes_wav = bytes()
                byte_io = io.BytesIO(bytes_wav)
                wavfile.write(byte_io, sample_rate, audio_slice)
                yield wav_header + byte_io.read()

        elif file_path[-4:] == '.mp3':
            segment = pydub.AudioSegment.from_mp3(file_path)

            samples = np.array(segment.get_array_of_samples())

            sample_rate = segment.frame_rate

            wav_header = genHeader(int(sample_rate), 16, 2, len(samples)//2)


            slice_length = 13
            overlap = 0
            slices = np.arange(0, len(samples) / sample_rate  , slice_length - overlap)
            slices = np.append(slices, len(samples)/sample_rate)

            for start, end in zip(slices[:-1], slices[1:]):
                start_audio = start * sample_rate
                end_audio = (end + overlap) * sample_rate
                audio_slice = samples[int(start_audio) : int(end_audio)]

                import io

                bytes_wav = bytes()
                byte_io = io.BytesIO(bytes_wav)
                wavfile.write(byte_io, 44100, audio_slice)

                yield wav_header + byte_io.read()

    return current_app.response_class(generate(), mimetype="audio/x-wav")

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

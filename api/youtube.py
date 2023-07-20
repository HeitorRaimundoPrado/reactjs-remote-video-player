import os
from flask import Blueprint, request, send_from_directory, send_file, after_this_request, current_app
import yt_dlp
import json
import tempfile
import shutil
import scrapetube


bp = Blueprint('youtube', __name__)

# get the true urls for video and audio in <url>
@bp.route('/api/youtube/get/')
def youtube_get():
    url = request.args['url']
    ret_json = dict()

    ydl_opts = {}

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=False)

    video_resolutions = []
    audio_streams = []

    res_set = set()
    info = ydl.sanitize_info(info)

    if info is None:
        return {}


    for stream in [(format["url"], format["resolution"], format['abr'], format['video_ext']) for format in info["formats"]]: #type:ignore
        if stream[1] not in res_set and stream[1] != "audio only":

            if stream[3] == 'mp4':
                video_resolutions.append({'url': stream[0], 'resolution': stream[1]})
                res_set.add(stream[1])

        elif stream[1] == 'audio only' and stream[2] != None:
            audio_streams.append(stream)

    print(json.dumps(audio_streams, indent=1))
    ret_json = [video_resolutions, max(audio_streams, key=lambda x: x[2])[0]] 
    return ret_json

# use youtube data api to retrieve the results from <search>
@bp.route('/api/youtube/search/') # type: ignore
def youtube_search():
    term = request.args['term']

    search = scrapetube.get_search(term, limit=15)
    if search is None:
        return []

    ret_json = list()
    for video in search:
        pfp = video["channelThumbnailSupportedRenderers"]["channelThumbnailWithLinkRenderer"]["thumbnail"]["thumbnails"][0]["url"]
        thumbnail = video["thumbnail"]["thumbnails"][0]['url']
        channel_url = video["channelThumbnailSupportedRenderers"]["channelThumbnailWithLinkRenderer"]["navigationEndpoint"]["commandMetadata"]["webCommandMetadata"]["url"]
        channel_name = video["ownerText"]["runs"][0]["text"]
        video_title = video["title"]['runs'][0]['text']

        ret_json.append({'pfp': pfp, 'thumbnail': thumbnail, 'channel': channel_name,'title': video_title, 'url': video["videoId"], "channel_url": channel_url})

    return ret_json 

# return youtube video as attachment so user downloads it
@bp.route('/api/youtube/download')
def youtube_download():
    url = request.args['url']

    with tempfile.TemporaryDirectory() as tmp_dir:
        ydl_opts = {
                'quiet': True,  # Suppress logging output (optional)
                'format': "best+bestaudio",
                'outtmpl': str(os.path.join(tmp_dir,  "%(title)s.%(%ext)s")) # Specify the output path for the downloaded file
            }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            file_name = ydl.prepare_filename(ydl.extract_info(url, download=False))
            ydl.download([url])

        return send_file(file_name, as_attachment=True, mimetype="application/octet-stream")

@bp.route('/api/youtube/download_audio')
def youtube_download_audio():
    url = request.args['url']
    with tempfile.TemporaryDirectory() as tmp_dir:

        ydl_opts = {
            'quiet': True,  # Suppress logging output (optional)
            'outtmpl': str(os.path.join(tmp_dir, '%(title)s')),  # Specify the output directory and template
            'format': 'bestaudio/best',  # Choose the best audio format available
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',  # Extract audio using FFmpeg
                'preferredcodec': 'mp3',  # Convert to MP3 format
                'preferredquality': '192',  # Audio quality (192 kbps)
            }]
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            file_name = ydl.prepare_filename(ydl.extract_info(url, download=True))

        response = send_file(file_name + '.mp3', as_attachment=True, mimetype="application/octet-stream")
        return response


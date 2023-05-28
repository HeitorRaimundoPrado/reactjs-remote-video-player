from os import path
from flask import Blueprint, request, send_from_directory, send_file
import pytube
import tempfile

bp = Blueprint('youtube', __name__)

# get the true urls for video and audio in <url>
@bp.route('/api/youtube/get/')
def youtube_get():
    url = request.args['url']
    ret_json = dict()
    streams = pytube.YouTube(url).streams
    ret_json[0] = streams.get_highest_resolution().url # type: ignore
    ret_json[1] = streams.get_audio_only().url # type: ignore
    return ret_json

# use youtube data api to retrieve the results from <search>
@bp.route('/api/youtube/search/') # type: ignore
def youtube_search():
    term = request.args['term']

    search = pytube.Search(term).results
    if search is None:
        return []

    ret_json = list()
    for video in search:
        ret_json.append({'title': video.title, 'url': video.watch_url})

    # print('\n\n')
    # print(ret_json)
    # print('\n\n')

    return ret_json 

# return youtube video as attachment so user downloads it
@bp.route('/api/youtube/download')
def youtube_download():
    url = request.args['url']
    with tempfile.TemporaryDirectory() as tmp_dir:
        file_name = pytube.YouTube(url).streams.get_highest_resolution().download(output_path=tmp_dir) # type: ignore
        return send_file(file_name, as_attachment=True)


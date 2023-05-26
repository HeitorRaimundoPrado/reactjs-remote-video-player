from flask import Blueprint, request
import pytube

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
        ret_json.append(video.title)

    return ret_json 

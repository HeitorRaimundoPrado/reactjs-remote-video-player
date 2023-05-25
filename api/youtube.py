from flask import Blueprint

bp = Blueprint('youtube', __name__)

# get the video for <url> possibly asynchronously
@bp.route('/api/youtube/get/<string:url>')
def youtube_get(url: str):
    return [200]

# use youtube data api to retrieve the results from <search>
@bp.route('/api/youtube/search/<string:url>')
def youtube_search(term: str):
    return {}

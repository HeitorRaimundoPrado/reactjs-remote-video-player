import os
from flask import Blueprint, request, send_from_directory, send_file
import pytube
import requests
import re
from bs4 import BeautifulSoup
import json
import tempfile
import subprocess

get_pfp_memo = dict()

bp = Blueprint('youtube', __name__)

def get_pfp(url: str) -> str:
    if get_pfp_memo.get(url) is not None:
        return get_pfp_memo[url]

    soup = BeautifulSoup(requests.get(url, cookies={'CONSENT': 'YES+1'}).text, 'html.parser')

    data = re.search(r"var ytInitialData = ({.*});", str(soup.prettify())).group(1) #type: ignore

    json_data = json.loads(data)

    get_pfp_memo[url] = json_data['header']['c4TabbedHeaderRenderer']['avatar']['thumbnails'][2]['url']
    return get_pfp_memo[url]

# get the true urls for video and audio in <url>
@bp.route('/api/youtube/get/')
def youtube_get():
    url = request.args['url']
    ret_json = dict()
    streams = pytube.YouTube(url).streams
    video_resolutions = []
    res_set = set()
    for stream in streams.filter(type='video', progressive=False).order_by('resolution').desc():
        if stream.resolution not in res_set:
            video_resolutions.append({'url': stream.url, 'resolution': stream.resolution})
            res_set.add(stream.resolution)

    ret_json = [video_resolutions, streams.filter(type="audio").order_by('abr').desc().first().url] # type: ignore
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
        ret_json.append({'pfp': get_pfp(video.channel_url), 'thumbnail':video.thumbnail_url, 'channel': video.author,'title': video.title, 'url': video.watch_url})

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
        print('sending file')
        return send_file(file_name, as_attachment=True, mimetype="application/octet-stream")

@bp.route('/api/youtube/download_audio')
def youtube_download_audio():
    url = request.args['url']
    with tempfile.TemporaryDirectory() as tmp_dir:
        yt = pytube.YouTube(url)
        file_name = yt.streams.get_audio_only().download(output_path=tmp_dir) # type: ignore
        print(os.listdir(tmp_dir))
        dest = os.path.join(tmp_dir, file_name.replace('.mp4', '.mp3'))
        subprocess.run(f'ffmpeg -i "{file_name}" "{dest}" ', shell=True)

        response = send_file(dest, as_attachment=True, mimetype="application/octet-stream")
        return response

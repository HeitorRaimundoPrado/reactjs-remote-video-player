import { useState, useEffect} from 'react';
import { API_BASE_URL } from '../constants';
import { useSearchParams } from 'react-router-dom'
import '../style/WatchVid.scss'
import VideoPlayer from '../components/VideoPlayer';
import Loader from '../components/Loader';

const WatchVid = () => {
  const [allVideo, setAllVideo] = useState('');
  const [audioURL, setAudioURL] = useState('');
  const [watchDivHTML, setWatchDivHTML] = useState('');
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams();
  const [vidDisplay, setVidDisplay] = useState('none');
  const vid = searchParams.get('vid');
  const localVid = searchParams.get('local');


  useEffect(() => {
    let local = 0;
    if (localVid !== null && localVid !== undefined) {
      local = parseInt(localVid, 10);
    }

    let url = '';
    console.log(local)

    if (local === 1) {
      url = `${API_BASE_URL}/api/video/` +  vid;
    } 

    else {
      url = `${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: vid});
    }



    const fetchYoutube = async () => {
      try {
        setLoading(true)
        await fetch(url)
        .then(res => res.json())
        .then(data => {
          setAllVideo(data[0]);
          console.log(data[0]);
          setAudioURL(data[1]);
          setLoading(false)
        })
      } catch (error) {
        <p>error</p>
      }    
    }

    if (local !== 1) {
      fetchYoutube();
    }

    else {
      console.log('setting real url to:')
      console.log(url);
      setRealURL(url);
    }
  }, [])

  useEffect(() => {
    setVidDisplay('inline-block')
  }, [audioURL])

  useEffect(() => {
    setWatchDivHTML(
      <main className="main_video">

        {audioURL !== '' && <VideoPlayer allVideo={allVideo} audioUrl={audioURL}/>}

        <div className="video_div_download">
          <a download href={`${API_BASE_URL}/api/youtube/download?url=${vid}`}>
            <input type="button" value="Download Video" className="form_download"/>
          </a>
          <a download href={`${API_BASE_URL}/api/youtube/download_audio?url=${vid}`}>
            <input type="button" value="Download Audio" className="form_download"/>
          </a>
        </div>
      </main>
    )
  },[audioURL])

  return (
    <>
      <div className="watch">
        {loading ? <Loader/> : watchDivHTML}
      </div>
    </>
  )
}

export default WatchVid;

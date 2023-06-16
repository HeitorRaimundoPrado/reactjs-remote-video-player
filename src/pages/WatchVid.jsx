import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';
import { useSearchParams } from 'react-router-dom'
import '../style/WatchVid.scss'

const WatchVid = () => {
  const [realURL, setRealURL] = useState('');
  const [watchDivHTML, setWatchDivHTML] = useState('');

  const [searchParams] = useSearchParams();
  const vid = searchParams.get('vid');

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: vid}))
      const json = await res.json();
      setRealURL(json[0]);
    }

    fetchData();
  }, [])

  useEffect(() => {
    setWatchDivHTML(
      <main className="main_video">
        <video width="900px" height="600px" controls src={realURL}></video>

        <div className="video_div_download">
          {console.log(realURL)}
          <a download href={`${API_BASE_URL}/api/youtube/download?url=${vid}`}>
            <input type="button" value="Download Video" className="form_download"/>
          </a>
          <a download href={`${API_BASE_URL}/api/youtube/download_audio?url=${vid}`}>
            <input type="button" value="Download Audio" className="form_download"/>
          </a>
        </div>
      </main>
    )
  },[realURL])

  return (
    <>
      <div className="watch">
        {watchDivHTML}
      </div>
    </>
  )
}

export default WatchVid;

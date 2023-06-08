import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../constants';
import { useSearchParams } from 'react-router-dom'

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

  const invIframe = useRef();

  const handleDownloadVideo = (e) => {
    e.preventDefault();
    invIframe.current.src = `${API_BASE_URL}/api/youtube/download?url=${vid}`;
  }

  const handleDownloadAudio = (e) => {
    e.preventDefault();
    invIframe.current.src = `${API_BASE_URL}/api/youtube/download_audio?url=${vid}`

  }

  useEffect(() => {
    setWatchDivHTML(
      <>
      <video width="900px" height="600px" controls src={realURL}></video>
      <form>
        {console.log(realURL)}
        <input type="submit" onClick={handleDownloadVideo} value="Donwload Video"/>
        <input type="submit" onClick={handleDownloadAudio} value="Download Audio"/>
        <iframe ref={invIframe} style={{display: 'none'}} ></iframe>
      </form>
      </>
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

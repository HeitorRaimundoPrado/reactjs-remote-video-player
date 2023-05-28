import  {useState, useEffect} from 'react'
import { API_BASE_URL } from '../constants.js'
import { useSearchParams } from 'react-router-dom'

const TestWatch = () => {
  
  const [text, setText] = useState('')
  const [realURL, setRealURL] = useState('')
  const [watchDivHTML, setWatchDivHTML] = useState('')

  const [searchParams] = useSearchParams();
  console.log(searchParams);
  const vid = searchParams.get('vid');
  console.log(vid);

  useEffect(() => {
    const fetchData = async () => {
      if (vid) {
        const res = await fetch(`${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: vid}));
        const json = await res.json();
        setRealURL(json[0])
      }
    }
    fetchData();
  }, [])

  useEffect(() => {
    setWatchDivHTML(
      <>
        {console.log('real url in useEffect -> ' + realURL)}
        <iframe src={realURL} frameBorder="0"></iframe>
      </>
    )
  }, [realURL])


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(e.target[0].value);
    const res = await fetch(`${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: e.target[0].value}));
    const json = await res.json();
    setRealURL(json[0])

    console.log(realURL)

    setWatchDivHTML( <>
        <iframe src={realURL} frameBorder='0'></iframe>
      </>)

    setText('');
    return;
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" onChange={(e) => setText(e.target.value)}/>
        <button type="submit">Submit</button>
      </form>
      <div id="watch">
        {watchDivHTML}
      </div>
    </>
  )
}
export default TestWatch;

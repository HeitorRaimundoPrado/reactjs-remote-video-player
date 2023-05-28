import  {useState, useEffect} from 'react'
import { API_BASE_URL } from '../constants.js'

const TestWatch = () => {
  
  const [text, setText] = useState('')
  const [realURL, setRealURL] = useState('')
  const [watchDivHTML, setWatchDivHTML] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(text);
    const res = await fetch(`${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: text}));
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

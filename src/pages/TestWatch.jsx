import  {useState} from 'react'
import { API_BASE_URL } from '../constants.js'

const TestWatch = () => {
  const [text, setText] = useState('')
  const [realURL, setRealURL] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    let watchDiv = document.getElementById('watch');

    console.log(text);
    await fetch(`${API_BASE_URL}/api/youtube/get?` + new URLSearchParams({url: text}))
      .then(res => res.json())
      .then(data => setRealURL(data[0]))

    console.log(realURL)

    watchDiv.innerHTML = `<iframe src='${realURL}' frameborder=0></iframe>`
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
      </div>
    </>
  )
}
export default TestWatch;

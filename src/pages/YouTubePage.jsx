/* eslint-disable react/jsx-key */
import { useState } from 'react'
import { API_BASE_URL } from '../constants';
import Loader from '../components/Loader'
import "../style/Youtube.scss"

const YouTubePage = () => {
  const [searchResults, setSearchResults] = useState([])
  const [inputText, setInputText] = useState('')
  const [Loading, setLoading] = useState(false)

  /*const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/youtube/search?` + new URLSearchParams({term: e.target[0].value}))

    const json = await res.json();
    setSearchResults(json);
  }*/

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE_URL}/api/youtube/search?` + new URLSearchParams({term: e.target[0].value}))
      const json = await res.json();
      setSearchResults(json);
      setInputText('')
    } catch (error) {
      <p>Error</p>
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <h2>Videos</h2>
      <form onSubmit={handleSubmit}>
        <span className="material-symbols-outlined">
          search
        </span>
        <input type="text" placeholder="Search YouTube" className="form__search" value={inputText} onChange={(e) => setInputText(e.target.value)}/>

        <input type="submit" value="Go" className="form__submit"/>
      </form>

      {/*<div className="search_results">
        <ul>
          {searchResults.map((item) => {
            return (
            <li className="list">
              <div className="list_thumb">
                <a href={`/watch?vid=${item.url}`}>
                  <img src={item.thumbnail}/>
                </a>
              </div>
              <div className="list_channel">
                <img src={item.pfp}/>
                <div>
                  <a href={`/watch?vid=${item.url}`}>
                    {item.title}
                  </a>
                  <p>{item.channel}</p>
                </div>
              </div>
            </li>
            )
          })}
        </ul>
        <div className="youtube_loader">
          {Loading && (<p>Is loading</p>)}
        </div>
        </div>*/}
        {
          Loading ?
          <Loader/> :
          <div className="search_results">
            <ul>
              {searchResults.map((item) => {
                return (
                <li className="list">
                  <div className="list_thumb">
                    <a href={`/watch?vid=${item.url}`}>
                      <img src={item.thumbnail}/>
                    </a>
                  </div>
                  <div className="list_channel">
                    <img src={item.pfp}/>
                    <div>
                      <a href={`/watch?vid=${item.url}`}>
                        {item.title}
                      </a>
                      <p>{item.channel}</p>
                    </div>
                  </div>
                </li>
                )
              })}
            </ul>
          </div>
        }
    </>
  );
}

export default YouTubePage;

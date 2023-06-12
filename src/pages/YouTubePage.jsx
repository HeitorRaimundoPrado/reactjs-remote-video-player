/* eslint-disable react/jsx-key */
import { useState } from 'react'
import { API_BASE_URL } from '../constants';
import "../style/Youtube.scss"

const YouTubePage = () => {
  const [searchResults, setSearchResults] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_BASE_URL}/api/youtube/search?` + new URLSearchParams({term: e.target[0].value}))

    const json = await res.json();
    setSearchResults(json);
  }

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <h2>Videos</h2>
      {/*<form onSubmit={handleSubmit}>
        <input type="text"/>
        <input type="submit"/>
       </form>*/}
      
      <form onSubmit={handleSubmit}>
        <span className="material-symbols-outlined">
          search
        </span>
        <input type="text" placeholder="Search YouTube"/>
        <input type="submit"/>
      </form>

      <div className="search-results">
        <ul>
          {searchResults.map((item) => {
            return (
            <li>
              <div className="thumb">
                <a href={`/watch?vid=${item.url}`}>
                  <img src={item.thumbnail}/> 
                </a>
              </div>
              <div className="title-channel">
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
    </>
  );
}

export default YouTubePage;

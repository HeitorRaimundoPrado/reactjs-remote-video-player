import { useState } from 'react'
import { API_BASE_URL } from '../constants';

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
      <form onSubmit={handleSubmit}>
        <input type="text"/>
        <input type="submit"/>
      </form>
      <div className="search-results">
        <ul>
          {searchResults.map((item) => {
            return <li>
              <div>
                <a href={`/watch?vid=${item.url}`}><img src={item.thumbnail} height='200px' widht='300px'/> <br/>{item.title}</a>
                
              </div>
              <div>
                <img height="20px" wdith="20px" style={{borderRadius: "50%"}} src={item.pfp}/>
                <span>{item.channel}</span>
              </div>
            </li>
          })}
        </ul>
      </div>
    </>
  );
}

export default YouTubePage;

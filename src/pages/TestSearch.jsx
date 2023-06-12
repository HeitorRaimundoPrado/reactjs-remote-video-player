import {useState} from 'react'
import { API_BASE_URL } from '../constants'
import '../style/Search.scss'

const TestSearch = () => {
  const [searchResults, setSearchResults] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE_URL}/api/youtube/search?` + new URLSearchParams({term: e.target[0].value}))
    const json = await res.json();
    setSearchResults(json)
  }
  return (
    <>
      <form onSubmit={handleSubmit} className='form'>
        <input type="text"/>
        <input type="submit"/>
      </form>

      <div>
        <ul>
        {searchResults.map((item) => {
          return <li><a href={`/test-watch?vid=${item.url}`}>{item.title}</a></li>
        })}
        </ul>
      </div>
    </>
  )
}

export default TestSearch;

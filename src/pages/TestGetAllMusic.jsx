import {API_BASE_URL} from '../constants.js'
import { useState, useEffect } from 'react'

const TestGetAllMusic = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`${API_BASE_URL}/api/music`);
      const json = await resp.json();
      setData(json);
    }
    fetchData();
  }, [])

  return (
    <>
      <ul>
        {data.map((item) => {
          return (
            <li key={item}><a href={`/test-audio?file=${item}`}>{item}</a></li>
          )
        })}
      </ul>
    </>
  )
}

export default TestGetAllMusic

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestWatch from './pages/TestWatch.jsx'
import TestSearch from './pages/TestSearch.jsx'
import TestUpload from './pages/TestUpload.jsx'
import TestAudio from './pages/TestAudio.jsx'
import { API_BASE_URL } from './constants.js'
import { useEffect } from 'react'


function App() {

  useEffect(()=> {
    fetch(`${API_BASE_URL}/hello`)
      .then((res) => res.json()
      .then((data) => console.log(data)))
  }, [])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/test-watch' element={<TestWatch/>}/>
          <Route path='/test-search' element={<TestSearch/>}/>
          <Route path='/test-upload' element={<TestUpload/>}/>
          <Route path='/test-audio' element={<TestAudio/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

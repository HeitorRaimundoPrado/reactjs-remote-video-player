import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TestWatch from './pages/TestWatch.jsx'
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
          <Route exact path='/test-watch' element={<TestWatch/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

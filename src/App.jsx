import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import TestWatch from './pages/TestWatch.jsx'
import TestSearch from './pages/TestSearch.jsx'
import TestUpload from './pages/TestUpload.jsx'
import TestAudio from './pages/TestAudio.jsx'
import TestGetAllMusic from './pages/TestGetAllMusic.jsx'

import HomePage from './pages/HomePage.jsx'
import SoundPage from './pages/SoundPage.jsx'
import YouTubePage from './pages/YouTubePage.jsx'
import CreatePlaylist from './pages/CreatePlaylist.jsx'
import EditPlaylist from './pages/EditPlaylist.jsx'

import WatchVid from './pages/WatchVid.jsx'

import Nav from './components/Nav.jsx'
import { API_BASE_URL } from './constants.js'
import { useEffect, useState } from 'react'

import HandleReplistContext from './contexts/HandlePlaylist'
import RepIdxContext from './contexts/RepIdx'


function App() {
  const [replist, setReplist] = useState([]);
  const [repIdx, setRepIdx] = useState(0);

  useEffect(()=> {
    fetch(`${API_BASE_URL}/hello`)
      .then((res) => res.json()
      .then((data) => console.log(data)))
  }, [])

  return (
    <>
      <HandleReplistContext.Provider value={{ replist, setReplist }}>
        <RepIdxContext.Provider value={{ repIdx, setRepIdx }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/test-watch' element={<TestWatch/>}/>
              <Route path='/test-search' element={<TestSearch/>}/>
              <Route path='/test-upload' element={<TestUpload/>}/>
              <Route path='/test-audio' element={<TestAudio/>}/>
              <Route path='/test-get-music' element={<TestGetAllMusic/>}/>

              <Route path='/' element={<HomePage/>}/>
              <Route path='/sound' element={<SoundPage/>}/>
              <Route path='/youtube' element={<YouTubePage/>}/>

              <Route path='/create-playlist' element={<CreatePlaylist/>}/>

              <Route path='/watch' element={<WatchVid/>}/>

              <Route path='edit-playlist' element={<EditPlaylist/>}/>
              
            </Routes>
          </BrowserRouter>
          <Nav/>
        </RepIdxContext.Provider>
      </HandleReplistContext.Provider>
    </>
  )
}

export default App

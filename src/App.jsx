import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import TestWatch from './pages/TestWatch.jsx'
import TestSearch from './pages/TestSearch.jsx'
import TestUpload from './pages/TestUpload.jsx'
import TestAudio from './pages/TestAudio.jsx'
import TestGetAllMusic from './pages/TestGetAllMusic.jsx'
import UploadForm from './pages/UploadForm'

import { useSwipeable } from 'react-swipeable'

import SoundPage from './pages/SoundPage.jsx'
import YouTubePage from './pages/YouTubePage.jsx'
import CreatePlaylist from './pages/CreatePlaylist.jsx'
import EditPlaylist from './pages/EditPlaylist.jsx'

import WatchVid from './pages/WatchVid.jsx'

import SingUp from './pages/SingUp'
import LogIn from './pages/LogIn'

import UseToken from './components/UseToken.jsx'


import Nav from './components/Nav.jsx'
import { API_BASE_URL } from './constants.js'
import { useEffect, useState } from 'react'

import HandleReplistContext from './contexts/HandlePlaylist'
import RepIdxContext from './contexts/RepIdx'



function App() {
  const [replist, setReplist] = useState([]);
  const [repIdx, setRepIdx] = useState(0);

  const pagesSlide = ['/sound', '/', '/youtube'];

  useEffect(()=> {
    fetch(`${API_BASE_URL}/hello`)
      .then((res) => res.json()
      .then((data) => console.log(data)))
  }, [])

  const { token, removeToken, setToken } = UseToken();

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      const curPage = pagesSlide.findIndex((page, idx, arr) => window.location.href.replace(window.location.origin, '') == page);
      console.log('curPage -> ' + String(curPage))
      console.log('window.location.href -> ' + String(window.location.href))
      if (curPage > 0) {
        window.location.href = pagesSlide[curPage-1];
      }
    },

    onSwipedLeft: (eventData) => {
      const curPage = pagesSlide.findIndex((page, idx, arr) => window.location.href.replace(window.location.origin, '') == page);
      console.log('curPage -> ' + String(curPage))
      console.log('window.location.href -> ' + String(window.location.href))
      if (curPage < 2) {
        window.location.href = pagesSlide[curPage+1];
      }
    },

    trackMouse: true,
  })

  return (
    <div className="app_container" {...handlers}>
      
      <HandleReplistContext.Provider value={{ replist, setReplist }}>
        <RepIdxContext.Provider value={{ repIdx, setRepIdx }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Home/>}/>

              <Route path='/sound' element={<SoundPage/>}/>
              <Route path='/youtube' element={<YouTubePage/>}/>

              <Route path='/create-playlist' element={<CreatePlaylist/>}/>

              <Route path='/watch' element={<WatchVid/>}/>
              <Route path='/upload' element={<UploadForm/>}/>

              <Route path='/signup' element={<SingUp/>}/>
              <Route path='/login' element={<LogIn setToken={setToken}/>}/>

              <Route path='edit-playlist' element={<EditPlaylist/>}/>
              
            </Routes>
          </BrowserRouter>
          <Nav/>
        </RepIdxContext.Provider>
      </HandleReplistContext.Provider>
    </div>
  )
}

export default App

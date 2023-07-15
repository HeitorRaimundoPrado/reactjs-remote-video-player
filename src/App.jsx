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

import { Suspense } from "react"
import { useTranslation } from  'react-i18next'


function App() {
  const {t, i18n } = useTranslation();

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
              <Route path='/' element={<Home t={t}/>}/>

              <Route path='/sound' element={<SoundPage t={t}/>}/>
              <Route path='/youtube' element={<YouTubePage t={t}/>}/>

              <Route path='/create-playlist' element={<CreatePlaylist t={t}/>}/>

              <Route path='/watch' element={<WatchVid t={t}/>}/>
              <Route path='/upload' element={<UploadForm t={t}/>}/>

              <Route path='/signup' element={<SingUp t={t}/>}/>
              <Route path='/login' element={<LogIn setToken={setToken} t={t}/>}/>

              <Route path='edit-playlist' element={<EditPlaylist t={t}/>}/>
              
            </Routes>
          </BrowserRouter>
          <Nav/>
        </RepIdxContext.Provider>
      </HandleReplistContext.Provider>
    </div>
  )
}

export default App

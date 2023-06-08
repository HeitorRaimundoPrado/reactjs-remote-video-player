import { API_BASE_URL } from "../constants";
import { useState, useEffect, useRef, createContext, useContext } from 'react'

import jQuery from "jquery";

const DataContext = createContext();
const AudioRefContext = createContext();

const Songs = (props) => {
  const{playAudio, handleAddToPlaylist} = props;

  const data = useContext(DataContext);
  return (
    <ul>
    {data.map((item) => {
      return (
      <li key={item}>
        <button onClick={() => playAudio(`${API_BASE_URL}/api/music/${item}`)}>{item}</button>
        <button onClick={() => handleAddToPlaylist(item)}>Add To Playlist</button>
        </li>
      )
    })}
    </ul>
  )
}

const UploadSongForm = () => {
  return (
    <form action={`${API_BASE_URL}/api/upload/music`} method="POST" encType="multipart/form-data">
      <label htmlFor="file-input">Upload File</label>
      <br/>
      <input id="file-input" style={{display: 'none'}} type="file" name="file"/>

      <input type="submit"/>
    </form>
  )
}
const SoundPage = () => {
  const [data, setData] = useState([]);
  const [playlistsHTML, setPlaylistsHTML] = useState(<></>)
  const [replist, setReplist] = useState([]);
  const [repIdx, setRepIdx] = useState(0);
  const [globalPlaylists, setGlobalPlaylists] = useState([]);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState('');

  const audioRef = useRef();
  const addToPlaylistRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`${API_BASE_URL}/api/music`)
      const json = await resp.json();
      setData(json);
      setReplist(json);
    }
    fetchData();
  }, [])

  const handlePlaylist = (playlist) => {
    jQuery.get(`${API_BASE_URL}/api/playlists/${playlist}`, (songs) => {
      console.log(songs);
      setReplist(songs);
      setRepIdx(0);
      playAudio(`${API_BASE_URL}/api/music/${songs[0]}`);
    })
  }

  const playAudio = (nsrc) => {
    audioRef.current.src = nsrc;
    audioRef.current.style.display = 'inline-block';
    audioRef.current.play();
  }

  const nextSong = () => {
    if (repIdx + 1 < replist.length) {
      playAudio(`${API_BASE_URL}/api/music/${replist[repIdx+1]}`);
      setRepIdx(repIdx+1);
    } else {
      setRepIdx(0);
    }
  }

  useEffect(() => {
    jQuery.get(`${API_BASE_URL}/api/playlists`, (playlists) => {
      // alert(playlists)
      setGlobalPlaylists(playlists);
      setPlaylistsHTML(
      <div>
        {playlists.map((playlist) => {
            return (
              <button onClick={() => handlePlaylist(playlist)}>{playlist}</button>
            )
        })}
      </div>)
    })
  }, [])


  const handleAddToPlaylist = (song) => {
    addToPlaylistRef.current.style.display = 'inline-block';
    setAddToPlaylistSong(song);
  }
  

  const handleChangePlaylist = (playlist) => {
    jQuery.get(`${API_BASE_URL}/api/playlists/${playlist}`, (songs) => {
      songs.pop()
      songs.push(addToPlaylistSong);


      let str = ''
      for (let i = 0; i < songs.length; i++) {
        str += songs[i] + '\n';
      }

      const file = new Blob([str], {filename: 'n-playlist.txt', type: 'text/plain'});

      var fd = new FormData();

      fd.append('filename', `${playlist}`);
      fd.append('file', file);

      jQuery.ajax({
        type: "POST",
        url: `${API_BASE_URL}/api/upload/playlist`,
        data: fd, 
        processData: false,
        contentType: false
      }).done(function(data) {
          console.log(data);
      }) 

      addToPlaylistRef.current.style.display = 'none'

    })

  }

  return (
    <>
      <div style={{display: 'inline-block'}}>
        {playlistsHTML}
        <a href="/new-playlist"><button>Create New Playlist</button></a>
      </div>
      <DataContext.Provider value={data}>
        <Songs playAudio={playAudio} handleAddToPlaylist={handleAddToPlaylist}/>
      </DataContext.Provider>

      <audio onEnded={nextSong} src="" preload="none" type="audio/wav" controls ref={audioRef} style={{display: 'none'}}></audio>

      <UploadSongForm/>

      <div ref={addToPlaylistRef} style={{display: 'none'}}>
        { globalPlaylists.map((playlist) => {
          return <button onClick={() => handleChangePlaylist(playlist)}>{playlist}</button>
        })}
      </div>
    </>
  );
}

export default SoundPage;
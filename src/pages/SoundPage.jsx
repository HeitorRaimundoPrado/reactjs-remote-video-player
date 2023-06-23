/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
import { API_BASE_URL } from "../constants";
import { useCallback, useState, useEffect, useRef, createContext, useContext } from 'react'
import HandleReplistContext from "../contexts/HandlePlaylist.jsx"
import RepIdxContext from "../contexts/RepIdx";
import ContextMenu from '../components/ContextMenu.jsx'
import AudioPlayer from "../components/AudioPlayer";
import playlistContext from "../contexts/PlaylistContext";
import '../style/SoundPage.scss'

import jQuery from "jquery";

const DataContext = createContext();

const handleDeleteSong = (songs, setSongs, baseUrl, idx) => {
  const deleteSong = async () => {
    let headers = {};
    if (localStorage.getItem('token') != null) {
      headers = { Authorization: 'Bearer ' + localStorage.getItem('token')};
    }
    await fetch(`${baseUrl}/delete/${songs[idx]}`, {method: 'POST', headers: headers});
  }

  deleteSong();

  let songsCopy = [...songs];
  songsCopy.splice(idx, 1);
  setSongs(songsCopy);
}
const Songs = (props) => {
  const{playAudio, handleAddToPlaylist, audRef, addToPlaylistRef, setAddToPlaylistSong, setRepIdx, baseUrl} = props;

  const [data, setData] = useContext(DataContext);
  console.log("data: " + data);

  return (
    <ul>
    {data.map((item, idx) => {
      return (
      <li key={item}>
        {/* <button onClick={() => playAudio(`${API_BASE_URL}/api/music/${item}`, audRef, setRepIdx, idx)}>{item}</button> */}
        <button onClick={() => playAudio(`${baseUrl}/${item}`, audRef, setRepIdx, idx)}>{item}</button>
        <button onClick={() => handleDeleteSong(data, setData, baseUrl, idx)}>Delete</button>
        <button onClick={() => handleAddToPlaylist(item, addToPlaylistRef, setAddToPlaylistSong, setRepIdx, idx)}>Add To Playlist</button>
      </li>
      )
    })}
    </ul>
  )
}

const UploadSongForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    let headers = {}
    if (localStorage.getItem('token') != null) {
      headers = {
        Authorization: "Bearer " + localStorage.getItem('token'),
      }
    }
    fetch(`${API_BASE_URL}/api/upload/music/`, { method: "POST", headers: headers, body: new FormData(e.target)})
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file-input">Upload File</label>
      <br/>
      <input id="file-input" style={{display: 'none'}} type="file" name="file"/>

      <label htmlFor="input-private">Private</label>
      <input type="radio" name="private" value="1" id="input-private"/>

      <label htmlFor="input-public">Public</label>
      <input type="radio" name="private" value="0" id="input-public"/>

      <input type="submit"/>
    </form>
  )
}

const playAudio = (nsrc, aud, setRepIdx, songIdx = null) => {
  console.log("called playAudio")
  
  if (songIdx !== null) {
    setRepIdx(songIdx);
  }

  if (nsrc.includes('private')) {
    const headers = {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      followRedirect: true,
    }

    fetch(nsrc, { headers })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => {
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg'});
        const audioURL = URL.createObjectURL(blob);

        aud.current.src = audioURL;
      })
  }

  else {
    aud.current.src = nsrc;
  }

  // console.log('guessed mimetype: ' + mimeType);
  // aud.current.querySelector('source').type = mimeType;
  aud.current.play();
}

const useFunctions = (audioRef) => {
  const { replist, setReplist } = useContext(HandleReplistContext);
  const { repIdx, setRepIdx } = useContext(RepIdxContext);

  const handlePlaylist = useCallback((playlist) => {
    jQuery.get(`${API_BASE_URL}/api/playlists/${playlist}`, (songs) => {
      console.log(songs);
      setReplist(songs);
      setRepIdx(0);
      playAudio(`${API_BASE_URL}/api/music/${songs[0]}`, audioRef, setRepIdx);
    })
  }, [audioRef])
  
  const nextSong = useCallback(() => {
    console.log("Called nextSong")
    console.log("repIdx = " + String(repIdx))
    console.log("replist = " + String(replist))
    console.log("replist.length = " + String(replist.length))

    if (repIdx + 1 < replist.length) {
      playAudio(`${API_BASE_URL}/api/music/${replist[repIdx+1]}`, audioRef, setRepIdx);
      setRepIdx(repIdx+1);
    } else {
      setRepIdx(0);
    }
  }, [audioRef, replist, repIdx])

  const previousSong = useCallback(() => {
    if (repIdx - 1 >= 0) {
      playAudio(`${API_BASE_URL}/api/music/${replist[repIdx-1]}`, audioRef, setRepIdx);
      setRepIdx(repIdx-1);
    } else {
      setRepIdx(0);
    }
  }, [audioRef, replist, repIdx])

  return {
    handlePlaylist, 
    nextSong,
    previousSong
  }

}

const useFetchData = () => {
  const [ret, setRet] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const resp = await fetch(`${API_BASE_URL}/api/music`)
      const json = await resp.json();
      return json;
    }
    fetchData().then((val) => {
      setRet(val)
    });
  }, [])
  console.log("Inside useFetchData -> ret = " + String(ret))
  return ret;
}

const handleAddToPlaylist = (song, addToPlaylistDiv, setAddToPlaylistSong) => {
  addToPlaylistDiv.current.style.display = 'inline-block';
  setAddToPlaylistSong(song);
}
const handleChangePlaylist = (playlist, addToPlaylistSong, addToPlaylistRef) => {
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

const handlePlaylistContextMenu = (e, playlist, contextMenuRef, setContextMenuSong) => {
  e.preventDefault();

  const x = e.pageX;
  const y = e.pageY;
  console.log("x: " + x);
  console.log("y: " + y);

  contextMenuRef.current.style.display = 'flex';
  contextMenuRef.current.style.position = 'absolute';
  contextMenuRef.current.style.top = y + 'px';
  contextMenuRef.current.style.left = x + 'px';

  setContextMenuSong(playlist);

  console.log('right click');
}

const SoundPage = () => {
  const [allSongs, setAllSongs] = useState([]);
  const [globalPlaylists, setGlobalPlaylists] = useState([]);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState('');
  const [contextMenuSong, setContextMenuSong] = useState('');
  const [privateFiles, setPrivateFiles] = useState([])

  const [baseUrl, setBaseUrl] = useState(`${API_BASE_URL}/api/music`)

  const { replist, setReplist } = useContext(HandleReplistContext);
  const { repIdx, setRepIdx } = useContext(RepIdxContext);

  const songsFromFetch = useFetchData();
  console.log("outside useEffect -> " + String(songsFromFetch));

  useEffect(() => {
    setAllSongs(songsFromFetch);
    setReplist(songsFromFetch);
    // setRepIdx(3);
  }, [songsFromFetch])

  const audioRef = useRef();
  const addToPlaylistRef = useRef();
  const contextMenuRef = useRef();

  const { handlePlaylist, nextSong, previousSong } = useFunctions(audioRef);

  useEffect(() => {
    jQuery.get(`${API_BASE_URL}/api/playlists`, (playlists) => {
      // alert(playlists)
      setGlobalPlaylists(playlists);
    })

    if (localStorage.getItem('token') != null) {
      jQuery.ajax({
        url: `${API_BASE_URL}/api/files/private`,
        data: '',
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('token')
        },
        success: (privFiles) => {
          setPrivateFiles(privFiles);
          console.log("PivFiles = " + String(privFiles));
        },
        dataType: 'json',
      })
    }
  }, [])

  return (
    <>
      <h2>Uploads</h2>
      <div style={{display: 'inline-block'}}>
        {globalPlaylists.map((playlist) => {
          return (
            <button onContextMenu={(e) => {
              handlePlaylistContextMenu(e, playlist, contextMenuRef, setContextMenuSong)}}
              onClick={() => handlePlaylist(playlist)}>
              {playlist}
            </button>
          )
        })}

        <br/>
        <a href="/create-playlist"><button>Create New Playlist</button></a>

        <button onClick={() => {
        setReplist(allSongs)
        setBaseUrl(`${API_BASE_URL}/api/music`)}}>All Songs</button>

        <button onClick={() => {
        setReplist(privateFiles)
        setBaseUrl(`${API_BASE_URL}/api/private/music`)}}>Private Files</button>

      </div>

      <DataContext.Provider value={[replist, setReplist]}>
        <Songs addToPlaylistRef={addToPlaylistRef}
               setAddToPlaylistSong={setAddToPlaylistSong} 
               playAudio={playAudio} 
               audRef={audioRef}
               handleAddToPlaylist={handleAddToPlaylist}
               setRepIdx={setRepIdx}
               baseUrl={baseUrl}
        />


      </DataContext.Provider>

      <AudioPlayer src={""}
                   audRef={audioRef}
                   nextSong={nextSong}
                   previousSong={previousSong}/>
      {/* <audio onEnded={() => {nextSong()}} preload="auto" controls  style={{display: 'none'}} ref={audioRef}> */}
      {/* </audio> */}

      <UploadSongForm/>

      <div ref={addToPlaylistRef} style={{display: 'none'}}>
        <h2>Add To Playlist:</h2>
        { globalPlaylists.map((playlist) => {
          return <button onClick={() => handleChangePlaylist(playlist, addToPlaylistSong, addToPlaylistRef)}>{playlist}</button>
        })}
      </div>

      <playlistContext.Provider value={[contextMenuSong, globalPlaylists, setGlobalPlaylists]}>
        <ContextMenu contextMenuRef={contextMenuRef}/>
      </playlistContext.Provider>
    </>
  );
}

export default SoundPage;

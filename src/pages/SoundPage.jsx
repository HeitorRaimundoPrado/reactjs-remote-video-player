import { API_BASE_URL } from "../constants";
import { useCallback, useState, useEffect, useRef, createContext, useContext } from 'react'
import HandleReplistContext from "../contexts/HandlePlaylist.jsx"
import RepIdxContext from "../contexts/RepIdx";
import ContextMenu from '../components/ContextMenu.jsx'
import playlistContext from "../contexts/PlaylistContext";

import jQuery from "jquery";

const DataContext = createContext();

const Songs = (props) => {
  const{playAudio, handleAddToPlaylist, audRef, addToPlaylistRef, setAddToPlaylistSong} = props;

  const data = useContext(DataContext);
  console.log("data: " + data);

  return (
    <ul>
    {data.map((item) => {
      return (
      <li key={item}>
        <button onClick={() => playAudio(`${API_BASE_URL}/api/music/${item}`, audRef)}>{item}</button>
        <button onClick={() => handleAddToPlaylist(item, addToPlaylistRef, setAddToPlaylistSong)}>Add To Playlist</button>
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

const playAudio = (nsrc, aud) => {
  console.log("called playAudio")
  aud.current.src = nsrc;
  aud.current.style.display = 'inline-block';
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
      playAudio(`${API_BASE_URL}/api/music/${songs[0]}`, audioRef);
    })
  }, [audioRef])
  
  const nextSong = useCallback(() => {
    console.log("Called nextSong")
    console.log("repIdx = " + String(repIdx))
    console.log("replist = " + String(replist))
    console.log("replist.length = " + String(replist.length))

    if (repIdx + 1 < replist.length) {
      playAudio(`${API_BASE_URL}/api/music/${replist[repIdx+1]}`, audioRef);
      setRepIdx(repIdx+1);
    } else {
      setRepIdx(0);
    }
  }, [audioRef, replist, repIdx])

  return {
    handlePlaylist, 
    nextSong
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
  const [playlistsHTML, setPlaylistsHTML] = useState(<></>)
  const [globalPlaylists, setGlobalPlaylists] = useState([]);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState('');
  const [contextMenuSong, setContextMenuSong] = useState('');


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

  const { handlePlaylist, nextSong } = useFunctions(audioRef);

  useEffect(() => {
    jQuery.get(`${API_BASE_URL}/api/playlists`, (playlists) => {
      // alert(playlists)
      setGlobalPlaylists(playlists);
    })
  }, [])

  return (
    <>
      <h2>Uploads</h2>
      <div style={{display: 'inline-block'}}>
        {globalPlaylists.map((playlist) => {
          return (
            <button onContextMenu={(e) => {handlePlaylistContextMenu(e, playlist, contextMenuRef, setContextMenuSong)}}onClick={() => handlePlaylist(playlist)}>{playlist}</button>
          )
        })}
        <br/>
        <a href="/create-playlist"><button>Create New Playlist</button></a>
      </div>

      <DataContext.Provider value={allSongs}>
        <Songs addToPlaylistRef={addToPlaylistRef} setAddToPlaylistSong={setAddToPlaylistSong} playAudio={playAudio} audRef={audioRef} handleAddToPlaylist={handleAddToPlaylist}/>
      </DataContext.Provider>

      <audio onEnded={() => {nextSong()}} src="" preload="auto" type="audio/wav" controls ref={audioRef} style={{display: 'none'}}></audio>

      <UploadSongForm/>

      <div ref={addToPlaylistRef} style={{display: 'none'}}>
        { globalPlaylists.map((playlist) => {
          console.log("\n\ninside globalPlaylists.map\n\n")
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

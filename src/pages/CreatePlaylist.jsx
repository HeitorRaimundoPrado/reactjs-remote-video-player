/* eslint-disable react/jsx-key */
import jQuery from "jquery";
import { API_BASE_URL } from "../constants.js"
import { useContext, useState, useEffect } from "react";
import '../style/CreatePlaylist.scss'

const handleSubmit = (e, songsToSend) => {

  e.preventDefault();

  let str = '';
  for (let i = 0; i < songsToSend.length; i++) {
    str += songsToSend[i] + '\n';
  }

  const file = new Blob([str], {type: "text/plain"});
  var fd = new FormData();

  fd.append('file', file);
  fd.append('filename', e.target.filename.value);

  jQuery.ajax({
    type: "POST",
    url: `${API_BASE_URL}/api/upload/playlist`,
    data: fd,
    processData: false,
    contentType: false
  }).done(function(data) {
      console.log(data);
  })
}

const handleAddSong = (song, songsToSend, setSongsToSend) => {
  setSongsToSend([...songsToSend, song]);
}

const CreatePlaylist = () => {
  const [songsToSend, setSongsToSend] = useState([]);
  const [songs, setSongs] = useState([])

  useEffect(() => {
    const fetchSongs = async () => {
      const resp = await fetch(`${API_BASE_URL}/api/music`)
      const json = await resp.json();
      return json;
    }
    fetchSongs().then(val => setSongs(val));
  }, [])

  const handleRemoveSong = (idx) => {
    let songsToSendCopy = [...songsToSend];
    songsToSendCopy.splice(idx, 1);
    setSongsToSend([...songsToSendCopy]);
  }

  return (
    <>
      <div className="add_song_page">
        <h2>Playlists</h2>

        <form onSubmit={(e) => {handleSubmit(e, songsToSend)}}>

          <input name="filename" type="text" placeholder="Playlist Name" className="sound_playlist_name"/>

          <div className='selection_songs_container'>
            <div className='selection_songs'>
              <h3>Select Audio</h3>
              <ul>
                {songs.map((song) => {
                  return <li>
                      <button type="button" onClick={() => handleAddSong(song, songsToSend, setSongsToSend)} className='playlist_music'> 
                        {song}
                      </button>
                    </li>
                })}
              </ul>
            </div>

            <div className='selected_songs'>
              <h3>Playlist</h3>
              <ul>
                {songsToSend.map((song, idx) => {
                  return <li>{song}<button type="button" onClick={() => handleRemoveSong(idx)} className="remove_from_playlist">Remove</button></li>
                })}
              </ul>
            </div>
          </div>
          <input type="submit" value="Create" className="form_submit_playlist"/>
        </form>
      </div>
    </>
  )
}

export default CreatePlaylist;

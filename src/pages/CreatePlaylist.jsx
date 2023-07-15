/* eslint-disable react/jsx-key */
import jQuery from "jquery";
import { API_BASE_URL } from "../constants.js"
import { useContext, useState, useEffect } from "react";
import '../style/CreatePlaylist.scss'

const handleSubmit = async (e, songsToSend) => {

  e.preventDefault();

  let fd = new FormData();

  fd.append('files', JSON.stringify(songsToSend));
  fd.append('name', e.target.name.value);

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

const CreatePlaylist = (props) => {
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

          <input name="name" type="text" placeholder="Playlist Name" className="sound_playlist_name"/>

          <div className='selection_songs_container'>
            <div className='selection_songs'>
              <h3>{props.t("createPlaylistPage.selectAudio")}</h3>
              <ul>
                {songs.map((song) => {
                  return <li>
                      <button type="button" onClick={() => handleAddSong(song, songsToSend, setSongsToSend)} className='playlist_music'> 
                        {song.name}
                      </button>
                    </li>
                })}
              </ul>
            </div>

            <div className='selected_songs'>
              <h3>Playlist</h3>
              <ul>
                {songsToSend.map((song, idx) => {
                  return <li>{song.name}<button type="button" onClick={() => handleRemoveSong(idx)} className="remove_from_playlist">Remove</button></li>
                })}
              </ul>
            </div>
          </div>
          <input type="submit" value={props.t("createPlaylistPage.create")} className="form_submit_playlist"/>
        </form>
      </div>
    </>
  )
}

export default CreatePlaylist;

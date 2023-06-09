import jQuery from "jquery";
import { API_BASE_URL } from "../constants.js"
import { useContext, useState, useEffect } from "react";


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

  return (
    <>
      <form onSubmit={(e) => {handleSubmit(e, songsToSend)}}>
        <input name="filename" type="text" placeholder="Name of Playlist"/>
        <ul>
          {songs.map((song) => {
            return <li><button type="button" onClick={() => handleAddSong(song, songsToSend, setSongsToSend)}>{song}</button></li>
          })}
        </ul>
        <input type="submit"/>
        
      </form>
    </>
  )
}

export default CreatePlaylist;

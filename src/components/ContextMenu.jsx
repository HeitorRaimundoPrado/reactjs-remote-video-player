import { useContext } from "react";
import playlistContext from '../contexts/PlaylistContext.jsx'
import jQuery from "jquery"
import { API_BASE_URL } from "../constants.js";

const ContextMenu = (props) => {

  const {contextMenuRef} = props;

  const [playlist, globalPlaylists, setGlobalPlaylists] = useContext(playlistContext)

  const handleDeletePlaylist = () => {
    jQuery.ajax({
      url:`${API_BASE_URL}/api/delete/playlist?playlist=${playlist}` , 
      type: "GET",
    })
    const playlistsCopy = globalPlaylists;

    const idxToDel = globalPlaylists.findIndex((element) => element == playlist);
    playlistsCopy.splice(idxToDel, 1);
    console.log('\n\nplaylistsCopy:')
    console.log(playlistsCopy);
    console.log('\n\n')
    setGlobalPlaylists([...playlistsCopy])
    contextMenuRef.current.style.display = "none";
  }
  
  return (
    <div ref={contextMenuRef} style={{display: "none", flexDirection: "column", width: "90px"}}>
      <a href={`/edit-playlist?playlist=${playlist}`}><button type="button">Edit Playlist</button></a>
      <button onClick={handleDeletePlaylist}>Delete Playlist</button>
    </div>
  )
}

export default ContextMenu;

import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import jQuery from "jquery";
import '../style/EditPlaylist.scss'

const EditPlaylist = () => {
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get('playlist')

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(playlistSongs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlaylistSongs(items);
  }

  useEffect(() => {
    const fetchPlaylist = async () => {
      fetch(`${API_BASE_URL}/api/playlists/${playlistId}`)
        .then(resp => resp.json())
        .then(data => {
          let songs = [];
          for (let i = 0; i < data.files.length; ++i) {
            songs.push(data.files[i]);
          }

          setPlaylistSongs(songs);
          setPlaylistName(data.name);
        });
    }
    fetchPlaylist();

  }, [])

  const handleDeleteSong = (songIdx) => {
    const playlistCopy = Array.from(playlistSongs);

    const idxToRemove = playlistCopy.findIndex((element) => {
      return element.id === songIdx;
    })
    
    console.log(idxToRemove);
    console.log(playlistSongs);
    playlistCopy.splice(idxToRemove, 1);
    setPlaylistSongs(playlistCopy);

  }
  
  const handleSubmit = (e) => {
    e.preventDefault();

    var fd = new FormData();

    fd.append('files', JSON.stringify(playlistSongs));
    fd.append('name', playlistName);

    fetch(`${API_BASE_URL}/api/delete/playlist?` + new URLSearchParams({playlist: playlistId}))
      .then(data => console.log(data));

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
  
  return (
    <div className="edit_container">
      <h2>Edit {playlistName}</h2>
      <DragDropContext onDragEnd={handleOnDragEnd}>

        <Droppable droppableId="playlist">

          {(provided) => (
            <ul className="edit_container_ul" id="playlist" {...provided.droppableProps} ref={provided.innerRef}>

              {playlistSongs.map((song, index) => {
                return (
                  <Draggable draggableId={String(song.id)} key={song.id} index={index}>

                    {(providedDraggable) => (
                      <li ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps} key={song.id} className="container_li">

                        {song.name}

                        <button type="button" onClick={() => handleDeleteSong(String(song.id))} className="button_remove_song">
                          Remove
                        </button>

                      </li>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

      <form onSubmit={handleSubmit} className="save_edit_form">
        <button type="submit">Save Changes</button>
      </form>
    </div>
  )
}

export default EditPlaylist;

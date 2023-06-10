import { useSearchParams } from "react-router-dom";
import { API_BASE_URL } from "../constants";
import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import jQuery from "jquery";

const EditPlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [searchParams] = useSearchParams();
  const playlistFile = searchParams.get('playlist')

  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(playlist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPlaylist(items);
  }

  const items = Array.from(playlist)
  useEffect(() => {
    const fetchPlaylist = async () => {
      fetch(`${API_BASE_URL}/api/playlists/${playlistFile}`)
        .then(resp => resp.json())
        .then(data => {
          let ndata = [];
          for (let i = 0; i < data.length; ++i) {
            if (data[i] != '')
            ndata.push([data[i], String(i)]);
          }
          setPlaylist(ndata);
        });
    }
    fetchPlaylist();

  }, [])

  const handleDeleteSong = (songIdx) => {
    const playlistCopy = Array.from(playlist);

    const idxToRemove = playlistCopy.findIndex((element) => {
      return element[1] === songIdx;
    })
    
    console.log(idxToRemove);
    console.log(playlist);
    playlistCopy.splice(idxToRemove, 1);
    setPlaylist(playlistCopy);

  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    let str = '';
    for (let i = 0; i < playlist.length; i++) {
      str += playlist[i][0] + '\n';
    }

    const file = new Blob([str], {type: "text/plain"});
    var fd = new FormData();

    fd.append('file', file);
    fd.append('filename', playlistFile);

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
    <>
      <h1>{playlistFile}</h1>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="playlist">
          {(provided) => (
            <ul className="playlist" id="playlist" {...provided.droppableProps} ref={provided.innerRef}>
              {playlist.map(([song, idx], index) => {
                return (
                  <Draggable draggableId={idx} key={idx} index={index}>
                    {(providedDraggable) => (
                      <li ref={providedDraggable.innerRef} {...providedDraggable.draggableProps} {...providedDraggable.dragHandleProps}>{song} 
                        <button type="button" onClick={() => handleDeleteSong(String(idx))}>delete</button>
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

      <form onSubmit={handleSubmit}>
        <button type="submit">Save Changes</button>
      </form>
    </>
  )
}

export default EditPlaylist;

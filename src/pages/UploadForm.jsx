import React, { useState } from 'react'
import { API_BASE_URL } from "../constants";
import Loader from '../components/Loader'
import '../style/UploadForm.scss'

export default function UploadForm() {
    const handleSubmit = (e) => {
      e.preventDefault();

      let headers = {}
      if (localStorage.getItem('token') != null) {
        headers = {
          Authorization: "Bearer " + localStorage.getItem('token'),
        }
      }
      
      /*setLoading(true)
      fetch(`${API_BASE_URL}/api/upload`, { method: "POST", headers: headers, body: new FormData(e.target)})*/
    }
    return (
      <>
        <h2>
          Upload File
        </h2>
        <form onSubmit={handleSubmit} className='file_upload_form'>
          <div className="file_type">
            <label htmlFor="file-input" className='form_label_upload'>
              Upload File
            </label>

            <input id="file-input" style={{display: 'none'}} type="file" name="file"/>

            <div className='input_type'>
              <label htmlFor="input-private">
                Private
              </label>
              <input type="radio" name="private" value="1" id="input-private" className='form_radio1'/>
          
              <label htmlFor="input-public">
                Public
              </label>
              <input type="radio" name="private" value="0" id="input-public" className='form_radio2'/>
            </div>
          </div>

          {/*<label htmlFor="song-name">
            Song Name
          </label>*/}
          <input type="text" className="file_name" name="song_name" placeholder="Song Name"/>

          {/*<label htmlFor="artist">
            Artist
          </label>*/}
          <input type="text" className="file_artist" name="artist" placeholder="Artist"/>
    
          <input type="submit" className='form_submit_file' value="Upload"/>
        </form>
      </>
    )
}

import { API_BASE_URL } from "../constants";
import '../style/UploadForm.scss'

export default function UploadForm(props) {
    const handleSubmit = (e) => {
      e.preventDefault();
      let headers = {}
      if (localStorage.getItem('token') != null) {
        headers = {
          Authorization: "Bearer " + localStorage.getItem('token'),
        }
      }
      
      fetch(`${API_BASE_URL}/api/upload`, { method: "POST", headers: headers, body: new FormData(e.target)})
    }
    
    return (
      <>
        <h2> {props.t("uploadForm.uploadFile")} </h2>
        <form onSubmit={handleSubmit} className='file_upload_form'>
          <div className="file_type">
            <label htmlFor="file-input" className='form_label_upload'>
              { props.t("uploadForm.uploadFile") }
            </label>
            <input id="file-input" style={{display: 'none'}} type="file" name="file"/>
            <label htmlFor="input-private">
              { props.t("uploadForm.private") }
            </label>
            <input type="radio" name="private" value="1" id="input-private" className='form_radio1'/>
            <label htmlFor="input-public">
              { props.t("uploadForm.public") }
            </label>
            <input type="radio" name="private" value="0" id="input-public" className='form_radio2'/>
          </div>

          <input type="text" className="file_name" name="song_name" placeholder={ props.t("uploadForm.songName") }/>

          <input type="text" className="file_artist" name="artist" placeholder={ props.t("uploadForm.artist") }/>
    
          <input type="submit" className='form_submit_file' value={props.t("uploadForm.upload")}/>
        </form>
      </>
    )
  }


export default function UploadForm() {
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
      <form onSubmit={handleSubmit} className='file_upload_form'>
        <label htmlFor="file-input" className='form_label_upload'>
          Upload File
        </label>
      
        <input id="file-input" style={{display: 'none'}} type="file" name="file"/>
  
        <label htmlFor="input-private">
          Private
        </label>
  
        <input type="radio" name="private" value="1" id="input-private" className='form_radio1'/>
  
        <label htmlFor="input-public">
          Public
        </label>
        <input type="radio" name="private" value="0" id="input-public" className='form_radio2'/>
  
        <input type="submit" className='form_submit_file' value="Upload"/>
      </form>
    )
  }
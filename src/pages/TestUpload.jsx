import { API_BASE_URL } from '../constants.js'

const TestUpload = () => {

  return (
    <>
      <form action={`${API_BASE_URL}/api/upload/music`} method="POST" encType='multipart/form-data'>
        <input type="file" name='file'/>
        <input type="submit"/>
      </form>
    </>
  )
}

export default TestUpload

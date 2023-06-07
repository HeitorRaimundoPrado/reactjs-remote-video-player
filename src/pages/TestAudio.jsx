import {useSearchParams} from "react-router-dom"
import { API_BASE_URL } from "../constants"

const TestAudio = () => {
  const [searchParams] = useSearchParams()
  const file = searchParams.get("file")
  return (
    <>
      <audio preload="none" type="audio/wav" src={`${API_BASE_URL}/api/music/${file}`} controls/>
    </>
  )
}

export default TestAudio

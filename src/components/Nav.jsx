import '../../src/style/Nav.scss'
import { Link } from 'react-router-dom'
/*import { FaHouse, FaPlay, FaArrowUpFromBracket } from "react-icons/fa6"*/

function Nav() {
  return (
    <nav>
      <a href="/sound">
        <img src="music-solid.svg" className="svg-white" alt="Music Page" width="30px" height="30px"/>
      </a>
      <a href="/">
        <img src="house-solid.svg" className="svg-white" alt="Home Page" width="30px" height="30px"/>
      </a>
      <a href="/youtube">
        <img src="circle-play-regular.svg" className="svg-white" alt="YouTube page" width="30px" height="30px"/>
      </a>
    </nav>
  );
}

export default Nav;

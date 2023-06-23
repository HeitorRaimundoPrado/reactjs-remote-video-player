import '../../src/style/Nav.scss'
import { Outlet, Link } from 'react-router-dom'
/*import { FaHouse, FaPlay, FaArrowUpFromBracket } from "react-icons/fa6"*/

function Nav() {
  return (
    /*<nav>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <Link to="/sound">
      <span className="material-symbols-outlined">
        library_music
      </span>
    </Link>
    <Link to="/">
      <span className="material-symbols-outlined">
        home
      </span>
    </Link>
    <Link to="/youtube">
      <span className="material-symbols-outlined">
        play_arrow
      </span>
    </Link>
  </nav>*/
    <nav>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <a href="/sound">
        <span className="material-symbols-outlined">
          library_music
        </span>
      </a>
      <a href="/">
        <span className="material-symbols-outlined">
          home
        </span>
      </a>
      <a href="/youtube">
        <span className="material-symbols-outlined">
          play_arrow
        </span>
      </a>
    </nav>
    /*<nav>
      <a href="/sound">
        <FaArrowUpFromBracket />
      </a>
      <a href="/">
        <FaHouse />
      </a>
      <a href="/youtube">
        <FaPlay />
      </a>
    </nav>*/
  );
}

export default Nav;
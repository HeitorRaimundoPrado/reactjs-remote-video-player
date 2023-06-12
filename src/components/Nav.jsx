import '../../src/style/Nav.scss'

const Nav = () => {
  return (
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
  )
}

export default Nav;
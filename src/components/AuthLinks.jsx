import '../style/AuthLinks.scss'

const AuthLinks = (props) => {
  return <div className="auth_container">
    <a href="/signup">Sign Up</a>
    <a href="/login">Login</a>
    <button onClick={
      props.removeToken
    }>Logout</button> 
  </div>
}

export default AuthLinks;

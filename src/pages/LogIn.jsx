import { useState } from "react"
import { API_BASE_URL } from "../constants"

const LogIn = (props) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const handleLogin = (e) => {
    e.preventDefault();
    
    fetch(`${API_BASE_URL}/api/auth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginForm.email,
        password: loginForm.password
      })
    }).then(response => response.json())
      .then(data => {
      props.setToken(data.access_token);
      console.log(data);
      })

  }

  const handleChange = (e) => {
    const {value, name} = e.target;
    setLoginForm(prevNote => ({
      ...prevNote, [name]: value
    }));
  }
  return (
    <>
      <form onSubmit={handleLogin}>
        <input type="email"
               onChange={handleChange}
               text={loginForm.email}
               name="email"
               placeholder="email"
               value={loginForm.email}/> 

        <input type="password"
               onChange={handleChange}
               text={loginForm.password}
               name="password"
               placeholder="password"
               value={loginForm.password}/>  

        <button onClick={handleLogin}>Log In</button>
      </form>
    </>
  )
}

export default LogIn;

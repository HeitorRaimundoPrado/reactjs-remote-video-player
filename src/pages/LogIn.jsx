/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { API_BASE_URL } from "../constants"
import '../style/LogIn.scss'

const LogIn = (props) => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const [searchParams] = useSearchParams();

  let from_signup = searchParams.get('success_signup');
  if (from_signup == null) {
    from_signup = 0;
  }

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

  /*const handleLogin = (e) => {
    e.preventDefault();
    
    try {
      setLoading(true)
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
    } catch (error) {
      <p>error</p>
    } finally {
      setLoading(false)
    }
  }*/

  const handleChange = (e) => {
    const {value, name} = e.target;
    setLoginForm(prevNote => ({
      ...prevNote, [name]: value
    }));
  }
  return (  
    <>
      <h2>Login</h2>

      <form onSubmit={handleLogin} className='login_form'>
        { from_signup && <div className="success-signup-msg">
          Successful Sign Up, login to continue
        </div>}

        <input type="email"
               onChange={handleChange}
               text={loginForm.email}
               name="email"
               placeholder="Email"
               value={loginForm.email} className='form_all_login'/> 

        <input type="password"
               onChange={handleChange}
               text={loginForm.password}
               name="password"
               placeholder="Password"
               value={loginForm.password}
               className="form_all_login"/>  

        <button onClick={handleLogin} className="form_login">
          Log In
        </button>

        <Link to='/signup' className='form_link_register'>
          Don't have an account yet?
        </Link>
      </form>
    </>
  )
}

export default LogIn;

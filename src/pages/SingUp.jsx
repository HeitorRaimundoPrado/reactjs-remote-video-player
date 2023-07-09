import { API_BASE_URL } from '../constants.js'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import jQuery from 'jquery';
import '../style/SignUp.scss'


const SingUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignUpUser = (e) => {
    e.preventDefault();
    fetch(`${API_BASE_URL}/api/auth/signup`, {
      'method': "POST",
      'body': JSON.stringify({
        email: email,
        name: username,
        password: password
      }),
      'headers': {
        'Content-Type': 'application/json'
      }
    }).then(resp => resp.json())
      .then(data => {
        console.log(data)
        if (data.user == "created") {
          window.location.href = "/login?success_signup=1";
        }
        
        else if (data.user == "exists") {
          setErrorMsg("User already exists");
        }
    })
  }

  const handleChange = (e) => {
    const {value, name} = e.target;
    setSignUpForm(prevNote => ({
      ...prevNote, [name]:value
    }));
  }
  return (
    <>
      <h2>Register</h2>

      <form onSubmit={handleSignUpUser} id='login-form' className='register_form'>

        <input type="text" placeholder="Email" name="Email" onChange={(e) => setEmail(e.target.value)}/* onChange={handleChange} */ className='form_email form_all'/>

        <input type="text" name="name" placeholder="Username" onChange={(e) => setUsername(e.target.value)}/* onChange={handleChange} */ className='form_user form_all'/>

        <input type="password" name="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)}/* onChange={handleChange} */ className='form_password form_all'/>

        <input type="submit" className='form_signup'/>

        <Link to='/login' className='form_link_login'>
          Already have an account?
        </Link>

        <p> {errorMsg} </p>
      </form>
    </>
  )
}

export default SingUp;

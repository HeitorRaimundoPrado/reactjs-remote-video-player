import { API_BASE_URL } from '../constants.js'
import { useState } from 'react';
import jQuery from 'jquery';


const SingUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

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
      .then(data => console.log(data))
  }

  const handleChange = (e) => {
    const {value, name} = e.target;
    setSignUpForm(prevNote => ({
      ...prevNote, [name]:value
    }));
  }
  return (
    <>
      <form onSubmit={handleSignUpUser} id='login-form'>
        <input type="text" placeholder="email" name="email" onChange={(e) => setEmail(e.target.value)}/* onChange={handleChange} *//>
        <input type="text" name="name" placeholder="username" onChange={(e) => setUsername(e.target.value)}/* onChange={handleChange} *//>
        <input type="password" name="password" onChange={(e) => setPassword(e.target.value)}/* onChange={handleChange} *//>
        <input type="submit"/>
      </form>
    </>
  )
}

export default SingUp;

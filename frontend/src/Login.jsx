import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [randomImage, setRandomImage] = useState('');

  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const response = await axios.get('https://source.unsplash.com/random');
        setRandomImage(response.request.responseURL);
      } catch (error) {
        console.error('Error fetching random image:', error.message);
      }
    };

    fetchRandomImage();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password.');
      return;
    }

    try {
      const response = await axios.post('http://your-api-server/login', {
        email: email,
        password: password,
      });

      const authToken = response.data.token;
      console.log('Authentication Token:', authToken);
    } catch (error) {
      console.error('Authentication Failed:', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="left-column" style={{ backgroundImage: `url(${randomImage})` }}></div>
      <div className="right-column">
        <div className="login-box">
          <h2 className="title">Login</h2>
          <form className="form">
            <div className="input">
              {/* <label className="label">Email:</label> */}
              <input type="email" placeholder='Enter email' value={email} onChange={handleEmailChange} className={`input ${emailError && 'error'}`} />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="input">
              {/* <label className="label">Password:</label> */}
              <input type="password" placeholder='Enter password' value={password} onChange={handlePasswordChange} className={`input ${passwordError && 'error'}`} />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            <button type="button" onClick={handleLogin} className="button">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
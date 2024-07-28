import React, { useState, useEffect } from 'react';
import './Login.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="container">
      <button onClick={toggleTheme} className="toggle-button">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      <div className="card">
        <div className="card-body">
          <label>Email</label>
          <input type="text"></input>
          <br></br>
          <label>Password</label>
          <input type="password"></input>
          <br></br>
          <input className="btn btn-primary" type="submit" value="Submit"></input>
        </div>
      </div>
    </div>
  );
};

export default Login;

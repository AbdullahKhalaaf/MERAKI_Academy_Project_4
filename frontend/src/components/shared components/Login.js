import React, { useState, useContext } from 'react';
import { userContext } from '../../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const Login = () => {
  const { setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    axios
      .post('http://localhost:5000/users/login', userInfo)
      .then((result) => {
        console.log(result);
        localStorage.setItem('token', result.data.token);
        setToken(result.data.token);
        navigate('/timeline');
        setMessage(result.data.message);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      });
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          placeholder="Email"
          onChange={(e) => {
            setUserInfo({ ...userInfo, email: e.target.value });
          }}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setUserInfo({ ...userInfo, password: e.target.value });
          }}
        />
      </div>
      <button
        className="btn btn-primary"
        onClick={() => {
          handleLogin();
        }}
      >
        Login
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default Login;

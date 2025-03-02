import React, { useState, useContext } from "react";
import { userContext } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const { setToken } = useContext(userContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    axios
      .post("https://connectify-x3ip.onrender.com/users/login", userInfo)
      .then((result) => {
        console.log(result);
        localStorage.setItem("token", result.data.token);
        setToken(result.data.token);
        navigate("/timeline");
        setMessage(result.data.message);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        console.log(err);
        setMessage(err.response.data.message);
      });
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ paddingTop: "70px" }}
    >
      <div className="w-50 p-4 shadow-lg rounded bg-light">
        <h2 className="text-center mb-4">Login</h2>
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
          className="btn btn-primary w-100"
          onClick={() => {
            handleLogin();
          }}
        >
          Login
        </button>
        {message && <p className="mt-3 text-danger text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Login;

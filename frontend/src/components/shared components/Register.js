import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsLoggedIn, setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    axios
      .post("http://localhost:5000/users/register", {
        email,
        password,
        userName,
      })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        setIsLoggedIn(true);
        navigate("/home");
      })
      .catch((err) => {
        const errorMessage = err.response?.data?.message;
        setError(errorMessage);
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      />
      <input
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Register;
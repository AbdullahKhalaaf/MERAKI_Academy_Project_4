import React, { useContext, useState } from "react";
import { UserContext } from "../../App";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setIsLoggedIn } = useContext(UserContext);

  const handleLogin = () => {
    axios
      .post("http://localhost:5000/users/login", { email, password })
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
        type="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;

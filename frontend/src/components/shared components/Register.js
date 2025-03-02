import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleRegister = () => {
    axios
      .post("`http://localhost:5000/users/register", {
        email,
        password,
        userName,
      })
      .then((response) => {
        console.log("response", response);
        navigate("/Login");
        setMessage(response.data.message);
      })
      .catch((err) => {
        setMessage(err.data.message);
      });
  };

  return (
    <div
      className="d-flex vh-100 justify-content-center align-items-center"
      style={{ paddingTop: "70px" }} /* Adjust for the navbar height */
    >
      <div className="w-50 p-4 shadow-lg rounded bg-light">
        <h2 className="text-center mb-4">Register</h2>
        <div className="mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Username"
            onChange={(e) => {
              setUserName(e.target.value);
            }}
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button
          onClick={handleRegister}
          type="button"
          className="btn btn-primary w-100"
        >
          Register
        </button>
        {message && <p className="mt-3 text-danger text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;

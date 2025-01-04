import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [message,setMessage] = useState("")

  const handleRegister = () => {
    axios.post("http://localhost:5000/users/register", {
      email,
      password,
      userName,
    })
    .then((response)=>{
      console.log("response",response);
      navigate("/Login")
      setMessage(response.data.message)
    }).catch((err)=>{setMessage(err.data.message)
    })
  };

  return <div>
      <div className="mb-3">
        <input
          className="form-control"
          type="email"
          placeholder="email"
        onChange={(e)=>{setEmail(e.target.value)}}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          placeholder="usename"
        onChange={(e)=>{setUserName(e.target.value)}}
        />
      </div>
      <div className="mb-3">
        <input
          className="form-control"
          type="password"
          placeholder="password"
        onChange={(e)=>{setPassword(e.target.value)}}
        />
      </div>
      <button onClick={()=>{
        handleRegister()
      }} type="button" class="btn btn-primary">Register</button>




  </div>;
};

export default Register;

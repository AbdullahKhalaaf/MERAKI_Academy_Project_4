import React from "react";
import "./App.css";
import { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/shared components/Login";
import Navbar from "./components/shared components/Navbar";
import Register from "./components/shared components/Register";
import "bootstrap/dist/css/bootstrap.min.css";
import TimeLine from "./components/shared components/TimeLine";
import Dashboard from "./components/shared components/Dashboard";
import DashboardAnotherUser from "./components/shared components/DahsboardAnotherUser";

export const userContext = createContext();
const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isFollowed,setIsFollowed] =useState(false)

  return (
    <>
      <userContext.Provider value={{ token, setToken,isFollowed,setIsFollowed }}>
        <div className="App">
          <Navbar />
        </div>
        <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/timeline" element={<TimeLine />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:id" element={<DashboardAnotherUser />} />
        </Routes>
      </userContext.Provider>
    </>
  );
};

export default App;

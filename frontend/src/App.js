import React, { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import NavbarComponent from "./components/shared components/Navbar"; // Import Navbar
import Login from "./components/shared components/Login";
import Register from "./components/shared components/Register";
import TimeLine from "./components/shared components/TimeLine";
import Dashboard from "./components/shared components/Dashboard";
import DashboardAnotherUser from "./components/shared components/DahsboardAnotherUser";

export const userContext = createContext();

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isFollowed, setIsFollowed] = useState(false);

  return (
    <userContext.Provider value={{ token, setToken, isFollowed, setIsFollowed }}>
     
      <NavbarComponent />

      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/timeline" element={<TimeLine />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:id" element={<DashboardAnotherUser />} />
      </Routes>
    </userContext.Provider>
  );
};

export default App;

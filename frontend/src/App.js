import React, { createContext, useState } from "react";
import "./App.css";
import Login from "./components/shared components/Login";
import Register from "./components/shared components/Register";
import Navbar from "./components/shared components/Navbar";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./components/shared components/HomePage";
import Profile from "./components/shared components/Profile";

export const UserContext = createContext();

const App = () => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken || "");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn("");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{ token, setToken, isLoggedIn, setIsLoggedIn }}
    >
      <div className="App">
        <h1>App</h1>
        <header>
          <Navbar handleLogout={handleLogout} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile/:id" element={<Profile />} />
          </Routes>
        </header>
      </div>
    </UserContext.Provider>
  );
};

export default App;

import React, { createContext, useState } from "react";
import "./App.css";
import Login from "./components/shared components/Login";
import Register from "./components/shared components/Register";
import Navbar from "./components/shared components/Navbar";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/shared components/HomePage";
import { useNavigate } from "react-router-dom"; 

export const UserContext = createContext();

const App = () => {
  const storedToken = localStorage.getItem("token");
  const [token, setToken] = useState(storedToken || "");
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setIsLoggedIn(false);
    navigate("/login"); 
  };

  return (
    <UserContext.Provider value={{ token, setToken, isLoggedIn, setIsLoggedIn }}>
      <div className="App">
        <h1>App</h1>
        <header>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} setToken={setToken} />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </header>
      </div>
    </UserContext.Provider>
  );
};

export default App;

import React from 'react'
import "./App.css";
import { useState,createContext } from 'react';
import { Routes,Route } from 'react-router-dom';
import Login from './components/shared components/Login';
import Navbar from './components/shared components/Navbar';
import Register from './components/shared components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import TimeLine from './components/shared components/TimeLine';
import Dashboard from './components/shared components/Dashboard';

export const userContext = createContext()
const App = () => {
const [token , setToken] = useState(localStorage.getItem("token"))


  return (
    <>
    <userContext.Provider value={{token, setToken}}>
   <div className="App">
          <Navbar />
        </div>
    <Routes>
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/timeline" element={<TimeLine />} />
          <Route path="/dashboard/:id" element={<Dashboard />} />
          
          
        </Routes>
    </userContext.Provider>
    </>
  )
}

export default App

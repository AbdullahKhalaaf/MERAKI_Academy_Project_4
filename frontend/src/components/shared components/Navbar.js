import React, { useContext,useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";




const Navbar = () => {
  const storedToken = localStorage.getItem("token");

  const navigate = useNavigate();
    const [token, setToken] = useState(storedToken || "");
    const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken);
   const handleLogout = () => {
      localStorage.removeItem("token");
      setToken("");
      setIsLoggedIn(false);
      navigate("/login");
    };
  

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <button onClick={() => navigate("/home")}>Home Page</button>
            <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>

        </>
      )}
    </nav>
  );
};

export default Navbar;
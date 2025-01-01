import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(UserContext);

  return (
    <nav>
      {isLoggedIn ? (
        <>
          <button onClick={() => navigate("/home")}>Home Page</button>
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

import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { userContext } from "../../App";

const NavbarComponent = () => {
  const { token, setToken } = useContext(userContext);

  const handleLogOut = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">My App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          {token ? (
            <>
              <Nav.Link href="/dashboard/:id">Profile</Nav.Link>
              <Nav.Link href="/timeline"> Home</Nav.Link>
              <Nav.Link href="/" onClick={handleLogOut}>
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link href="/Login">Login</Nav.Link>
              <Nav.Link href="/Register">register</Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;

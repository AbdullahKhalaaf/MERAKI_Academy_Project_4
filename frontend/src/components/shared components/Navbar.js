import React, { useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { userContext } from "../../App";
import "./Navbar.css";

const NavbarComponent = () => {
  const { token, setToken } = useContext(userContext);

  const handleLogOut = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Navbar
      bg="primary"
      variant="primary"
      expand="lg"
      fixed="top"
      className="shadow"
    >
      <Container>
        <Navbar.Brand className="name" href="/timeline">
          Connectify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
                <Nav.Link href="/timeline">Home</Nav.Link>
                <Nav.Link href="/dashboard">Profile</Nav.Link>
                <Nav.Link href="/" onClick={handleLogOut}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/Login">Login</Nav.Link>
                <Nav.Link href="/Register">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

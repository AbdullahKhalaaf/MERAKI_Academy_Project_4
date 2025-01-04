import React, { useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { userContext } from "../../App";

const NavbarComponent = () => {
  const { token, setToken } = useContext(userContext);

  const handleLogOut = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">My App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {token ? (
              <>
                <Nav.Link href="/dashboard">Profile</Nav.Link>
                <Nav.Link href="/timeline">Home</Nav.Link>
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

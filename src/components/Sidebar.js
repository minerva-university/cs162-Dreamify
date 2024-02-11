import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <Navbar sticky="top" className="Sidebar">
      <Nav.Item>
        <Nav.Link as={NavLink} to="/home" end>Home</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/user-profile">Profile</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={NavLink} to="/new-story">Add Story</Nav.Link>
      </Nav.Item>
    </Navbar>
  );
}
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import styles from './/styles/Header.css'; // Adjust the path as necessary

export default function Page() {
  return (
    <Navbar expand="lg" className={styles.Header_2_2}>
      <Container>
        <Navbar.Brand href="#home" className={styles.Dreamify_2_4}>Dreamify</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className={`me-auto ${styles.NavLinksContainer}`}> {/* Adjust alignment and gap here */}
            <div className={styles.Rectangle_2_2_3}> {/* Center content */}
              <Nav.Link href="#home" className={styles.Home_2_5}>Home</Nav.Link>
            </div>
            <div className={styles.Rectangle_3_2_6}> {/* Center content */}
              <Nav.Link href="#get-started" className={styles.GetStarted_2_7}>Get Started</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
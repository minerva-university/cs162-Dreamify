import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import styles from './styles/Footer.css'; // Ensure the path to your CSS module is correct

export default function Footer() {
  return (
    <Container fluid className={styles.Footer_6_75}>
      <Row className="justify-content-center">
        <Col xs={12}lg={2} className="text-center">
          <span className={styles.Dreamify_6_76}>&#xA9;2024 Dreamify</span>
        </Col>
        <Col xs={12} lg={3} className="text-center">
          <span className={styles.DreamifyMinervaGmailCom_6_79}>dreamify.minerva@gmail.com</span>
        </Col>
        <Col xs={12} lg={2}></Col>
        <Col xs={12} lg={2} className="text-center">
          <a href="#aboutus" className={`${styles.AboutUs_6_77} text-decoration-none`}>About Us</a>
        </Col>
        <Col xs={12} lg={3} className="text-center">
          <a href="#terms" className={`${styles.TermsOfServicePrivacyPolicy_6_78} text-decoration-none`}>Terms of Service & Privacy Policy</a>
        </Col>
      </Row>
    </Container>
  );
}
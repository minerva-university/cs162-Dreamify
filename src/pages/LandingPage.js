import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function LandingPage () {
    return (
        <Container className="landing-page">
            <Container>
                <Row className="justify-content-md-center align-items-center h-100">
                    <Col md="center" className="d-flex justify-content-center align-items-center">
                        <Link to="/login">
                        <Button variant="primary" size="lg">Click me to start</Button>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};


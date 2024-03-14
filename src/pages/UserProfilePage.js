import React from 'react';
import ChildProfileCard from '../components/ChildProfileCard';
import Header from '../components/Header';  
import Footer from '../components/Footer';
import { Container, Stack, Col, ListGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// Mock child profile data for two children
const mockChildData1 = {
    id: 'child1',
    name: "Alice",
    stories: ['Story A', 'Story B'],
    createdDate: new Date(2021, 0, 1).toISOString() // January 1, 2021
};

const mockChildData2 = {
    id: 'child2',
    name: "Bob",
    stories: ['Story X', 'Story Y', 'Story Z'],
    createdDate: new Date(2020, 5, 15).toISOString() // June 15, 2020
};

const user = {
    parentName: "philip.sterne",
    email: "philip.sterne@gmail.com"
  };


// UserProfilePage Component
export default function UserProfilePage() {
    return (
        <Container fluid>
            <Header />
            <Container className="page-container">
                <h1 className="header">
                    Children <span className="profile-subtitle">profiles</span>
                </h1> 
                    <Stack className="profile-container" direction="horizontal" gap={3}>
                        {/* Render the ChildProfileCard component for the first child */}
                        <ChildProfileCard childId={mockChildData1.id} />
                        {/* Render the ChildProfileCard component for the second child */}
                        <ChildProfileCard childId={mockChildData2.id} />
                    </Stack>
                <Button variant="primary" as = {Link} to = "/addachild/:parentid" >Add a kid</Button>
                <Col className="account-information">
                    <h3>Account Information</h3>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <strong>USERNAME</strong> {user.parentName}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Email</strong> {user.email}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Container>
            <Footer />
        </Container>
    );
};

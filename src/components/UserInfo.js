import React from 'react';
import { Container, Card, ListGroup, Image, Stack, Col } from 'react-bootstrap';

export default function UserInfo () {
    // This is a placeholder for the user object that will be retrieved from the database
    const user = {
        parentName: "John Doe",
        email: "johndoe@example.com",
        child: {
            eyeColor: ["Blue", "Brown", "Green", "Hazel", "Amber", "Gray"][Math.floor(Math.random() * 6)],
            hairType: ["Straight", "Wavy", "Curly", "Kinky", "Bald"][Math.floor(Math.random() * 5)],
            hairColor: ["Blonde", "Brown", "Black", "Red", "Auburn", "Grey", "White"][Math.floor(Math.random() * 7)],
            skinTone: ["Fair", "Light", "Medium", "Tan", "Brown", "Dark"][Math.floor(Math.random() * 6)],
            name: "Alice",
            ageRange: ["0-3", "4-6", "7-9", "10-13"][Math.floor(Math.random() * 4)],
            sex: ["Male", "Female"][Math.floor(Math.random() * 2)],
            siblingRelation: ["Only", "Youngest", "Middle", "Oldest"][Math.floor(Math.random() * 4)],
            favoriteAnimals: "Cats",
            favoriteActivities: "Drawing",
            favoriteCartoons: "Tom & Jerry"
        },
        imageUrl: "https://via.placeholder.com/150",
    };

    return (
        <Container className="mt-5">
        <Card>
            <Card.Header as="h5">User Profile</Card.Header>
            <Card.Body>
                <Stack direction='horizontal'>
                    <Col md={4} >
                        <Image src={user.imageUrl} roundedCircle fluid />
                    </Col>
                    <Col md={8}>
                        <h6>Parent Information</h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Name: {user.parentName}</ListGroup.Item>
                            <ListGroup.Item>Email: {user.email}</ListGroup.Item>
                        </ListGroup>

                        <h6 className="mt-4">Child Registration Details</h6>
                        <ListGroup variant="flush">
                            <ListGroup.Item>Eye Color: {user.child.eyeColor}</ListGroup.Item>
                            <ListGroup.Item>Hair Type: {user.child.hairType}</ListGroup.Item>
                            <ListGroup.Item>Hair Color: {user.child.hairColor}</ListGroup.Item>
                            <ListGroup.Item>Skin Tone: {user.child.skinTone}</ListGroup.Item>
                            <ListGroup.Item>Name: {user.child.name}</ListGroup.Item>
                            <ListGroup.Item>Age Range: {user.child.ageRange}</ListGroup.Item>
                            <ListGroup.Item>Sex: {user.child.sex}</ListGroup.Item>
                            <ListGroup.Item>Relationship to Siblings: {user.child.siblingRelation}</ListGroup.Item>
                            <ListGroup.Item>Favorite Animals: {user.child.favoriteAnimals}</ListGroup.Item>
                            <ListGroup.Item>Favorite Activities: {user.child.favoriteActivities}</ListGroup.Item>
                            <ListGroup.Item>Favorite Cartoons/Movies: {user.child.favoriteCartoons}</ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Stack>
            </Card.Body>
        </Card>
        </Container>
    );
};


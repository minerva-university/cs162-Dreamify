import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, ToggleButtonGroup, ToggleButton, InputGroup, FormControl } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/AddachildPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const eyeColors = [
  { name: 'blue', imageUrl: require('../assets/blue_eye.webp')} ,
  { name: 'brown', imageUrl: require('../assets/brown_eye.webp') },
  { name: 'green', imageUrl: require('../assets/green_eye.webp') },
  { name: 'hazel', imageUrl: require('../assets/hazel_eye.webp') },
  { name: 'amber', imageUrl: require('../assets/amber_eye.webp') }
];

const AddachildPage = () => {
    // You can store form data in the state as needed
    const [selectedEyeColor, setSelectedEyeColor] = useState(null);

    const handleEyeColorSelect = (color) => {
      setSelectedEyeColor(color);
    };
    // Submit handler
    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would typically collect the data from the state and send it to your server or API endpoint
    };

    return (
      <Container fluid>
        <Header />
        <Container className='page-container'>
            <h1 className='page-title'>Add a child's profile</h1>
            <Form onSubmit={handleSubmit}>
                <h5>DEMOGRAPHY</h5>
                <Form.Group className="form-group">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Kid's first name or the way you want them to be called in the stories" />
                </Form.Group>
                <Form.Group className="form-group">
                  <Form.Label>Age Range</Form.Label>
                  <ToggleButtonGroup type="radio" name="ageRange" defaultValue={1} className="toggle-button-group">
                      <ToggleButton id="age-0-3" value={1} >0-3</ToggleButton>
                      <ToggleButton id="age-4-6" value={2}>4-6</ToggleButton>
                      <ToggleButton id="age-7-9" value={3}>7-9</ToggleButton>
                      <ToggleButton id="age-10-13" value={4}>10-13</ToggleButton>
                  </ToggleButtonGroup>
              </Form.Group>
                <Form.Group className="form-group">
                    <Form.Label>Sex</Form.Label>
                    <ToggleButtonGroup type="radio" name="sex" defaultValue={1}  className="toggle-button-group">
                        <ToggleButton id="male" value={1}>Male</ToggleButton>
                        <ToggleButton id="female" value={2}>Female</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>
                <Form.Group className="form-group">
                    <Form.Label>Sibling Relationship</Form.Label>
                    <ToggleButtonGroup type="radio" name="sibling-rel" defaultValue={1}  className="toggle-button-group"> 
                        <ToggleButton id="onlychild" value={1}>Only Child </ToggleButton>
                        <ToggleButton id="youngest" value={2}>Youngest</ToggleButton>
                        <ToggleButton id="middle" value={2}>Middle</ToggleButton>
                        <ToggleButton id="oldest" value={2}>Oldest</ToggleButton>
                    </ToggleButtonGroup>
                </Form.Group>
              
                <Form.Group className="mb-5">
                    <h5>Visual Features</h5>
                    {/* You would map through your options to create these buttons dynamically */}
                    <Form.Group className="eye-color">
                      <Form.Label>Eye Color</Form.Label>
                      <Row>
                        {eyeColors.map((eyeColor) => (
                          <Col key={eyeColor.name} xs={1} md={2} lg={2} className="eye-color-col">
                            <img
                              src={eyeColor.imageUrl}
                              alt={eyeColor.name}
                              className={`img-thumbnail ${selectedEyeColor === eyeColor.name ? 'selected' : ''}`}
                              onClick={() => handleEyeColorSelect(eyeColor.name)}
                            />
                          </Col>
                        ))}
                      </Row>
                  </Form.Group>
                </Form.Group>
                <Form.Group className="mb-5">
                    <h5>INTERESTS</h5>
                    <Form.Group className="form-group">
                        <Form.Label>Favorite Animals</Form.Label>
                        <InputGroup>
                          <FormControl placeholder="Cats, Horses, Dinosaurs" />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>Favorite Activities</Form.Label>
                      <InputGroup>
                        <FormControl placeholder="Dancing, LEGO, Drawing" />
                      </InputGroup>
                    </Form.Group>

                    <Form.Group className="form-group">
                      <Form.Label>Favorite Shows</Form.Label>
                      <InputGroup>
                        <FormControl placeholder="Doctor who, Harry Potter" />
                      </InputGroup>
                    </Form.Group>

                </Form.Group>
                <Button variant="primary" type="submit">Add a kid</Button>
            </Form>
        </Container>
        <Footer />
      </Container>
    );
};

export default AddachildPage;

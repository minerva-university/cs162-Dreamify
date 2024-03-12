import * as React from "react";
import './styles/HomePage.css';
import tree from '../assets/home_page/hp_tree.png';
import boy_balloon from '../assets/home_page/hp_boy_balloon.png';
import boy_stars from '../assets/home_page/hp_boy_stars.png';
import stars from '../assets/home_page/hp_stars.png';
//import star from '../assets/home_page/hp_star.png';
import { Container, Row, Col, Button} from 'react-bootstrap';




export default function HomePage() {
  return (
    
    <Container>
          <Row className="mb-3">
            <Col md={5}>
              <img src={boy_stars} alt="Boy with stars" style={{ width: '100%' }} />
            </Col>
            <Col md={7}>
              <img src={boy_balloon} alt="Boy with balloon" style={{ width: '100%' }} />
              
            </Col>
          </Row>
          <Row >
            <Col >
              <div className="title">Bring your child's imagination to life with bedtime stories</div>
            </Col>
          </Row>
          <Row>
            <Col>
            <div className="tree-image-container">
              <img src={tree} alt="Tree" style={{ width: '100%' }} />
              <div className="tree-overlay-text">Create your own bedtime story</div>
              <button className="CreateButton_6_68" t>
                <span className="Create_6_69">Create</span>
              </button>
            </div>
            </Col>
          </Row>

        
          <Row>
            <Col md={12} className="text-center">
              <h2 className="featured_title">Featured Bedtime Stories</h2>
            </Col>
          </Row>
          <Row className="justify-content-md-center">
            <Col md={12} className="text-center" >
              <div className="featured_box">
                <img src={boy_stars} alt="Story" className="feature_image" />
                <div className="FeatureContent">
                  <h3 className="feature_name">Sweet Ty's Adventure</h3>
                  <p className="feature_date">11/11/2024</p>
                </div>
                <Button variant="primary" className="featured_button">Read</Button>
              </div>
            </Col>
          </Row>


                <Container className="mt-5">
            {/* Photo */}
            <Row className="justify-content-md-center">
              <Col md={6} className="text-center">
                <img src={stars} alt="HP Stars" className="img-fluid" />
              </Col>
            </Row>
            {/* Centered Text Block */}
            <Row className="justify-content-md-center">
              <Col md={9} className="text-center">
                <p className="description">Dreamify — Where Dreams Come Alive. Transform pre-bedtime into an unforgettable adventure with Dreamify, the ultimate story generator for children. Immerse your kids in magical tales where they are the heroes, embarking on journeys across new lands, learning fascinating facts, and sparking their imagination like never before. Each story is a doorway to a world of wonder, tailored to inspire and educate, creating cherished memories that will last a lifetime. With Dreamify, bedtime isn't just about going to sleep; it's about setting sail to dreamland, where every night is a unique voyage of discovery and delight. Join us in nurturing young minds, fostering creativity, and making every night a special storytime adventure.</p>
              </Col>
            </Row>
            {/* Same Photo Again */}
            <Row className="justify-content-md-center">
              <Col md={6} className="text-center">
                <img src={stars} alt="HP Stars" className="img-fluid" style={{ marginBottom: '80px' }}/>
              </Col>
            </Row>
          </Container>
        </Container>
        
    
  );
}


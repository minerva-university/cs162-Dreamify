import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import PropTypes from "prop-types";
import '../pages/styles/ChildProfileCard.css';


// ChildProfileCard component
const ChildProfileCard = ({ childId }) => {
    // Set constant data for childProfile
    const [childProfile] = useState({
        id: childId,
        name: "John Doe",
        // Assuming stories is an array of story objects
        stories: ['Story 1', 'Story 2', 'Story 3'],
        createdDate: "2021-01-01T00:00:00Z"
    });
    const [loading, setLoading] = useState(true);
    const [error] = useState(null);

    useEffect(() => {
        // Simulate loading time with a timeout
        const timer = setTimeout(() => {
            setLoading(false);
            // Uncomment setError to simulate an error
            // setError("An error occurred");
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // If loading, show a loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there was an error, show an error message
    if (error) {
        return <div>Error: {error}</div>;
    }

    // Render the child profile card
    return (
        <div className="child-profile-card">
            {childProfile ? (
                <>   
                    <img src={require("../pages/photos/chapter1.jpg")} alt={childProfile.name} />
                    <Container className='child-profile-content'>
                        <h3>{childProfile.name}</h3>
                        <p className='number-of-stories'>{childProfile.stories.length} stories</p>
                        <p className='created-on-text'>Created on: {new Date(childProfile.createdDate).toLocaleDateString()}</p>
                        {/* Additional profile information here */}
                    </Container>
                </>
            ) : (
                <Container className='no-child-profile'>
                    <img src={require("../pages/photos/chapter1.jpg")} alt={"Kid's Name"} />
                    <Container className='child-profile-content'>
                        <h3>Kid's Name</h3>
                        <p className='number-of-stories'> 0 stories</p>
                        <p className='created-on-text'> No stories yet</p>
                    </Container>
                </Container>
            )}
        </div>
    );
};

export default ChildProfileCard;
ChildProfileCard.propTypes = {
    childId: PropTypes.string.isRequired,
  };
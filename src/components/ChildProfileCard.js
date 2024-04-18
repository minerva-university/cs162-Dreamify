import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { useApi } from "../contexts/ApiProvider";
import Spinner from "./Spinner";
import "./styles/ChildProfileCard.css";

// Component that displays a card for a child's profile
const ChildProfileCard = ({ childId, disableEdit }) => {
  const [childProfile, setChildProfile] = useState(null); // State for storing child profile data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // State to store any errors that occur during data fetching
  const api = useApi(); // Context hook to access API functions

  // Fetch child profile data when component mounts or childId changes
  useEffect(() => {
    const fetchChildProfile = async () => {
      try {
        setIsLoading(true); // Start loading
        const profile = await api.getChild(childId); // API call to fetch child profile
        setChildProfile(profile); // Set fetched profile in state
      } catch (err) {
        setError(err.message); // If an error occurs, store the error message
      } finally {
        setIsLoading(false); // Ensure loading is set to false after the operation
      }
    };

    fetchChildProfile();
  }, [childId, api]);

  // Render a spinner while data is loading
  if (isLoading) {
    return <Spinner />;
  }

  // Display an error message if there is an error
  if (error) return <div>Error: {error}</div>;

  // Main card content
  return (
    <div className="child-profile-card">
      <img
        src={"data:image/png;base64," + childProfile.image} // Display child's image
        alt={childProfile.name} // Alternative text for the image
      />
      <div className="child-profile-content">
        <div className="created-on-button">
          <strong>{childProfile.name}</strong> {/* Display the child's name */}
          {!disableEdit && ( // Conditionally render the edit link if editing is not disabled
            <Link to={`/modify/${childId}`} className="edit-profile-btn">
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildProfileCard;

// Define prop types for type checking
ChildProfileCard.propTypes = {
  childId: PropTypes.string.isRequired, // Expect a string for childId
  disableEdit: PropTypes.bool, // Optional boolean for disableEdit
};

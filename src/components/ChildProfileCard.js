import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { useApi } from "../contexts/ApiProvider";
import Spinner from "./Spinner";
import "./styles/ChildProfileCard.css";

const ChildProfileCard = ({ childId, disableEdit }) => {
  const [childProfile, setChildProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = useApi();

  useEffect(() => {
    const fetchChildProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await api.getChild(childId);
        setChildProfile(profile);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildProfile();
  }, [childId, api]);

  if (isLoading) {
    return <Spinner />;
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="child-profile-card">
      <img
        src={"data:image/png;base64," + childProfile.image}
        alt={childProfile.name}
      />
      <div className="child-profile-content">
        <div className="created-on-button">
          <strong>{childProfile.name}</strong>
          {!disableEdit && (
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

ChildProfileCard.propTypes = {
  childId: PropTypes.string.isRequired,
  disableEdit: PropTypes.bool,
};

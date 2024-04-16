import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ChildProfileCard from "../components/ChildProfileCard";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import "./styles/UserProfilePage.css";
import Spinner from "../components/Spinner";
import PopUpAlert from "../components/PopUpAlert";

export default function UserProfilePage() {
  const api = useApi(); // Access API functions
  const auth = useAuth(); // Access authentication context
  const navigate = useNavigate(); // Hook for navigation
  const [children, setChildren] = useState([]); // State to store children profiles
  const [userInfo, setUserInfo] = useState({}); // State to store user information
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [alertVisible, setAlertVisible] = useState(false); // State to toggle alert visibility

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  // Set page title on component mount
  useEffect(() => {
    document.title = "Dreamify | My Profile";
  }, []);

  // Function to render a popup alert with a custom message
  const popAnAlert = () => {
    const message = "We are having trouble getting your profile information, please reload or contact us.";
    return (
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };

  // Fetch user and children data from the server
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Begin loading
        const user = await auth.getCurrentParent(); // Fetch current user information
        setUserInfo(user);
        const childrenProfiles = await api.getAllChildren(); // Fetch all children associated with the user
        setChildren(childrenProfiles.children || []); // Set children, ensure default to empty array if undefined
      } catch (error) {
        console.error("Error fetching data:", error); // Log errors
        setChildren([]); // Ensure state is clean on error
        showAlert(); // Show error alert
      } finally {
        setLoading(false); // End loading regardless of outcome
      }
    };

    fetchData();
  }, [api, auth]); // Rerun if api or auth context changes

  // Show loading spinner while fetching data
  if (loading) {
    return <Spinner />;
  }

  // Render children profiles or a message if none are found
  const childrenContent = children.length > 0 ? (
    children.map((child) => (
      <ChildProfileCard key={child.child_id} childId={child.child_id} />
    ))
  ) : (
    <div className="no-children-found">
      No children profiles were created yet.
    </div>
  );

  return (
    <div className="user-profile-page">
      {popAnAlert()}
      <h1>Children profiles</h1>
      <div className="hr-style"></div>
      <div className="profile-container">
        <div className="child-cards-container">{childrenContent}</div>
        <button
          className="add-kid-button"
          onClick={() => {
            if (userInfo.user_id) {
              navigate(`/addachild`);
            } else {
              console.error("Error: Parent ID not available.");
              showAlert();
            }
          }}
        >
          Add a child
        </button>
        <button
          className="add-kid-button"
          onClick={() => {
            if (userInfo.user_id) {
              navigate(`/children`);
            } else {
              console.error("Error: Parent ID not available.");
              showAlert();
            }
          }}
          style={{marginLeft: "20px"}}
        >
          New Story
        </button>
      </div>
      <div className="account-information">
        <h2>Account Information</h2>
        <div className="account-info-list">
          <div className="account-info-item">
            <strong>Name:</strong> {`${userInfo.first_name} ${userInfo.last_name}`}
          </div>
          <div className="account-info-item">
            <strong>Email:</strong> {userInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
}

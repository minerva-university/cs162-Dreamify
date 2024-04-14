import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ChildProfileCard from "../components/ChildProfileCard";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import "./styles/UserProfilePage.css";
import Spinner from "../components/Spinner";
import PopUpAlert from "../components/PopUpAlert";

export default function UserProfilePage() {
  const api = useApi();
  const auth = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  useEffect(() => {
    document.title = "Dreamify | My Profile";
  }, []);

  const popAnAlert = () => {
    const message = "We are having trouble getting your profile information, please reload or contact us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  }
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const user = await auth.getCurrentParent();
        setUserInfo(user);
        const childrenProfiles = await api.getAllChildren();
        // Ensure childrenProfiles is an array before setting it
        setChildren(childrenProfiles.children || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setChildren([]); // Ensure children is set to an empty array on error
        showAlert();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, auth]);

  // Loading state UI
  if (loading) {
    return <Spinner />
  }

  // UI for when children is empty
  const childrenContent =
    children.length > 0 ? (
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
            <strong>Name</strong>{" "}
            {`${userInfo.first_name} ${userInfo.last_name}`}
          </div>
          <div className="account-info-item">
            <strong>Email</strong> {userInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
}

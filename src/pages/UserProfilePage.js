import React, { useState, useEffect } from "react";
import ChildProfileCard from "../components/ChildProfileCard";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import "./styles/UserProfilePage.css";

export default function UserProfilePage() {
  const api = useApi();
  const auth = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Dreamify | My profile";
  }, []);
  

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [api, auth]);

  // Loading state UI
  if (loading) {
    return <div>Loading...</div>;
  }

  // UI for when children is empty
  const childrenContent =
    children.length > 0 ? (
      children.map((child) => (
        <ChildProfileCard key={child.child_id} childId={child.child_id} />
      ))
    ) : (
      <div>No children profiles found.</div>
    );

  return (
    <div className="user-profile-page">
      <h1>Children profiles</h1>
      <div className="hr-style"></div>
      <div className="profile-container">
        <div className="child-cards-container">{childrenContent}</div>
        <button
          className="add-kid-button"
          onClick={() => {
            if (userInfo.user_id) {
              navigate(`/addachild/${userInfo.user_id}`);
            } else {
              console.error("Error: Parent ID not available.");
            }
          }}
        >
          Add a kid
        </button>
      </div>
      <div className="account-information">
        <h3>Account Information</h3>
        <div className="account-info-list">
          <div className="account-info-item">
            <strong>USERNAME</strong> {userInfo.first_name}
          </div>
          <div className="account-info-item">
            <strong>Email</strong> {userInfo.email}
          </div>
        </div>
      </div>
    </div>
  );
}

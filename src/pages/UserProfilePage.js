import React, { useState, useEffect } from 'react';
import ChildProfileCard from '../components/ChildProfileCard';
import { useNavigate } from 'react-router-dom';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import './styles/UserProfilePage.css';

export default function UserProfilePage() {
  const api = useApi();
  const auth = useAuth();
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await auth.getCurrentParent();
        setUserInfo(user);
        const childrenProfiles = await api.getAllChildren();
        setChildren(childrenProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [api, auth]);

  return (
    <div className="user-profile-page">
      <h1>Children profiles</h1>
      <div className="hr-style"></div>
      <div className="profile-container">
        <div className="child-cards-container">
          {children.map(child => (
            <ChildProfileCard key={child.id} childId={child.id} />
          ))}
        </div>
        <button
          className="add-kid-button"
          onClick={() => navigate(`/addachild/${userInfo.id}`)}
        >
          Add a kid
        </button>
      </div>
      <div className="account-information">
        <h3>Account Information</h3>
        <div className="account-info-list">
          <div className="account-info-item"><strong>USERNAME</strong> {userInfo.parentName}</div>
          <div className="account-info-item"><strong>Email</strong> {userInfo.email}</div>
        </div>
      </div>
    </div>
  );
}

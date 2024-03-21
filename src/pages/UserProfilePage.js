import React from 'react';
import ChildProfileCard from '../components/ChildProfileCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import './styles/UserProfilePage.css';

// Mock child profile data for two children
const mockChildData1 = {
  id: 'child1',
  name: "Alice",
  stories: ['Story A', 'Story B'],
  createdDate: new Date(2021, 0, 1).toISOString() // January 1, 2021
};

const mockChildData2 = {
  id: 'child2',
  name: "Bob",
  stories: ['Story X', 'Story Y', 'Story Z'],
  createdDate: new Date(2020, 5, 15).toISOString() // June 15, 2020
};

const user = {
  parentName: "philip.sterne",
  email: "philip.sterne@gmail.com"
};

// UserProfilePage Component
export default function UserProfilePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="user-profile-page">
        <h1 className="page-title">Children <span className="profile-subtitle">profiles</span></h1>
        <div className="hr-style"></div>
        <div className="profile-container">
          <div className="child-cards-container">
            <ChildProfileCard childId={mockChildData1.id} />
            <ChildProfileCard childId={mockChildData2.id} />
          </div>
          <button
            className="add-kid-button"
            onClick={() => navigate('/addachild/:parentid')}
          >
            Add a kid
          </button>
        </div>
        <div className="account-information">
          <h3>Account Information</h3>
          <div className="account-info-list">
            <div className="account-info-item"><strong>USERNAME</strong> {user.parentName}</div>
            <div className="account-info-item"><strong>Email</strong> {user.email}</div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}

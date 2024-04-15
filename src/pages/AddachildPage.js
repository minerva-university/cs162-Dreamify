import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChildProfileForm from '../components/ChildProfileForm';
import { useApi } from '../contexts/ApiProvider';
import Spinner from '../components/Spinner';
import './styles/AddachildPage.css';

const AddachildPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    ageRange: '0-3',
    sex: 'Male',
    eyeColor: null,
    hairType: null, 
    hairColor: null, 
    race: null,
    customRaceInput: '',
    favoriteAnimals: '',
    favoriteActivities: '',
    favoriteShows: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const api = useApi();
  const navigate = useNavigate();

  // Initialize states with null or appropriate initial values
  const [isLoading, setIsLoading] = useState(false);
  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];

  // Show a spinner while loading
  if (isLoading) {
    return <Spinner text="Generating your child's image, please wait... (This should take approximately 30 seconds)" creatingChild={true}/>;
  }

  const handleHairTypeSelect = (hairType) => {
    if (hairType === "Bald") {
      setIsVisible(false);
      setSelectedHairColor("Bald");
    } else if (!isVisible) {
      setIsVisible(true);
      setSelectedHairColor(null);
    }
    setSelectedHairType(hairType);
};


  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    setCustomRaceInput("");
  };

  const handleCustomRaceInput = (e) => {
    const value = e.target.value;
    setCustomRaceInput(value);
    setSelectedRace(value || null);
  };

  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
    
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check required fields
    if (!formData.firstName || !formData.eyeColor || !formData.hairType || !formData.hairColor || !formData.ageRange) {
      alert('Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      await api.postCreateChild({
        name: formData.firstName,
        age_range: formData.ageRange,
        sex: formData.sex,
        eye_color: formData.eyeColor,
        hair_type: formData.hairType,
        hair_color: formData.hairColor,
        ethnicity: formData.customRaceInput || formData.race,
        fav_animals: formData.favoriteAnimals,
        fav_activities: formData.favoriteActivities,
        fav_shows: formData.favoriteShows,
      });
      navigate(-1);
    } catch (error) {
      console.error("Error creating child:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner text="Generating your child's image, please wait... (This should take approximately 30 seconds)" creatingChild={true}/>;
  }

  return (
    <div className='add-child-page'>
      <h1>Add Child's Profile</h1>
      <div className="hr-style"></div>
      <ChildProfileForm
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
      />
    </div>
  );
};

export default AddachildPage;

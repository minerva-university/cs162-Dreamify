import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChildProfileForm from '../components/ChildProfileForm';
import { useApi } from '../contexts/ApiProvider';
import Spinner from '../components/Spinner';
import { races } from '../components/ChildAttributes';
import './styles/AddachildPage.css';

const ModifyChildPage = () => {
  const [formData, setFormData] = useState({
    child_id: '', 
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
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const api = useApi();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const childId = location.pathname.split("/").pop();
    const fetchChildData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getChild(childId);
        const raceExists = races.some(race => race.name === data.ethnicity);
        
        setFormData({
          child_id: childId, 
          firstName: data.name,
          ageRange: data.age_range,
          sex: data.sex,
          eyeColor: data.eye_color,
          hairType: data.hair_type,
          hairColor: data.hair_color,
          race: raceExists ? data.ethnicity : '',
          customRaceInput: raceExists ? '' : data.ethnicity,
          favoriteAnimals: data.fav_animals,
          favoriteActivities: data.fav_activities,
          favoriteShows: data.fav_shows
        });
        setIsVisible(data.hair_type !== "Bald");
      } catch (error) {
        console.error("Error fetching child data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [api, location.pathname]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.firstName || !formData.eyeColor || !formData.hairType || !formData.hairColor || !formData.ageRange || (!formData.race && !formData.customRaceInput)) {
      alert('Please fill all required fields including race.');
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
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
      };
      await api.patchModifyChild(payload);
      navigate(-1);
    } catch (error) {
      console.error("Error modifying child:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner text="Updating child profile, please wait..." />;
  }

  return (
    <div className='add-child-page'>
      <h1>Update Child's Profile</h1>
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

export default ModifyChildPage;

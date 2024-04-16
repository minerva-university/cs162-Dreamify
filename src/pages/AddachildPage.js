import React, { useState, useEffect} from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
import ChildProfileForm from '../components/ChildProfileForm';
import PopUpAlert from "../components/PopUpAlert";
import Spinner from "../components/Spinner";
import "./styles/AddachildPage.css";

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
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message = "We are having trouble creating your child's profile, please try reloading or contacting us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };


  const navigate = useNavigate();
  const [error, setError] = useState("");


  // Initialize states with null or appropriate initial values
  const [isLoading, setIsLoading] = useState(false);

  // Show a spinner while loading
  if (isLoading) {
    return <Spinner text="Generating your child's image, please wait... (This should take approximately 30 seconds)" creatingChild={true}/>;
  }



  const handleSubmit = async (event) => {
    event.preventDefault();

    let missedInputs = [];
      if (!selectedEyeColor) {
        missedInputs.push(' Eye Color')
      }
      if (!selectedHairType){
        missedInputs.push(' Hair Type')
      }

      if (!selectedHairColor){
        missedInputs.push(' Hair Color')
      }

      if (!selectedRace){
        missedInputs.push(' Ethnicity')
      }
      if (missedInputs.length > 0) {
        setError(`You have missed the following input(s): ${missedInputs}`);
    } else {
        
    // Check required fields

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
      // Log the error
      console.error("Error creating child:", error);
      showAlert();
      

    } finally {
      setIsLoading(false);
    }
  }};

  return (
    <>
    {popAnAlert()}
    <div className="add-child-page">
      <h1>Add a child's profile</h1>
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
    </>
  );
};

export default AddachildPage;

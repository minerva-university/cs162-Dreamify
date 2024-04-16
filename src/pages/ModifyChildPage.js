import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Spinner from "../components/Spinner";
import "./styles/AddachildPage.css";
import ChildProfileForm from '../components/ChildProfileForm';
import { races } from '../components/ChildAttributes';
import PopUpAlert from "../components/PopUpAlert";


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

  // Initialize states with null or appropriate initial values
  const [childData, setChildData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message = "We are having trouble accessing your child's information, please try reloading or contacting us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };

  // Page title
  useEffect(() => {
    document.title = "Dreamify | Update Child Details";
  }, []);

  // Fetch child data on component mount
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
        showAlert();
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [api, location.pathname]);


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

    setIsLoading(true); // Start loading

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
      showAlert();
    } finally {
      setIsLoading(false);
    }
  }};

  return (
    <>
    {popAnAlert()}
    <div className="add-child-page">
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
    </>
  );
};

export default ModifyChildPage;

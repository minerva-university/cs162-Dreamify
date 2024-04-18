// Import necessary React and utility hooks
import React, { useState } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
// Import components
import ChildProfileForm from "../components/ChildProfileForm";
import PopUpAlert from "../components/PopUpAlert";
import Spinner from "../components/Spinner";
// Import styles
import "./styles/AddachildPage.css";

// Component to add a child's profile
const AddachildPage = () => {
  // State to handle form data initialization
  const [formData, setFormData] = useState({
    firstName: "",
    ageRange: "0-3",
    sex: "Male",
    eyeColor: null,
    hairType: null,
    hairColor: null,
    race: null,
    customRaceInput: "",
    favoriteAnimals: "",
    favoriteActivities: "",
    favoriteShows: "",
  });

  // State to handle loading spinner visibility
  const [isLoading, setIsLoading] = useState(false);
  // State to manage visibility of components
  const [isVisible, setIsVisible] = useState(true);
  // API context for making backend calls
  const api = useApi();
  // State to control the visibility of alerts
  const [alertVisible, setAlertVisible] = useState(false);

  // Function to display alert
  const showAlert = () => {
    setAlertVisible(true);
  };

  // Function to hide alert
  const closeAlert = () => {
    setAlertVisible(false);
  };

  // Component to display popup alerts dynamically
  const popAnAlert = () => {
    const message =
      "We are having trouble creating your child's profile, please try reloading or contacting us.";
    return (
      <PopUpAlert
        isVisible={alertVisible}
        message={message}
        onClose={closeAlert}
      />
    );
  };

  // Hook to navigate to previous page
  const navigate = useNavigate();
  // State to handle error messages
  const [error, setError] = useState("");

  // Display spinner while loading
  if (isLoading) {
    return (
      <Spinner
        text="Generating your child's image, please wait... (This should take approximately 30 seconds)"
        creatingChild={true}
      />
    );
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if all required fields are filled out
    let missedInputs = [];
    if (!formData.eyeColor) {
      missedInputs.push(" Eye Color");
    }
    if (!formData.hairType) {
      missedInputs.push(" Hair Type");
    }
    if (!formData.hairColor) {
      missedInputs.push(" Hair Color");
    }
    if (!formData.race && !formData.customRaceInput) {
      missedInputs.push("Race");
    }
    if (missedInputs.length > 0) {
      setError(`You have missed the following input(s): ${missedInputs}`);
    } else {
      setIsLoading(true);
      // Attempt to create a child profile
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
        showAlert();
      } finally {
        setIsLoading(false);
      }
    }
  };

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
          error={error}
        />
      </div>
    </>
  );
};

export default AddachildPage;

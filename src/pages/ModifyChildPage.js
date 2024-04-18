// Import necessary React and routing hooks
import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate, useLocation } from "react-router-dom";
// Import UI components
import Spinner from "../components/Spinner";
import ChildProfileForm from "../components/ChildProfileForm";
import { races } from "../utils/ChildAttributes";
import PopUpAlert from "../components/PopUpAlert";
// Import CSS for styling
import "./styles/AddachildPage.css";

// Component to modify an existing child's profile
const ModifyChildPage = () => {
  // State for managing form data and UI states
  const [formData, setFormData] = useState({
    child_id: "",
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
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // API context for making backend calls
  const api = useApi();
  const location = useLocation();
  const navigate = useNavigate();

  // States for handling alerts
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  // Function to display alerts
  const showAlert = () => {
    setAlertVisible(true);
  };

  // Function to close alerts
  const closeAlert = () => {
    setAlertVisible(false);
  };

  // Function to render a popup alert
  const popAnAlert = () => {
    const message =
      "We are having trouble accessing your child's information, please try reloading or contacting us.";
    return (
      <PopUpAlert
        isVisible={alertVisible}
        message={message}
        onClose={closeAlert}
      />
    );
  };

  // Effect hook to fetch child data upon component mounting
  useEffect(() => {
    const childId = location.pathname.split("/").pop();
    const fetchChildData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getChild(childId);
        const raceExists = races.some((race) => race.name === data.ethnicity);

        // Set form data with fetched data
        setFormData({
          child_id: childId,
          firstName: data.name,
          ageRange: data.age_range,
          sex: data.sex,
          eyeColor: data.eye_color,
          hairType: data.hair_type,
          hairColor: data.hair_color,
          race: raceExists ? data.ethnicity : "",
          customRaceInput: raceExists ? "" : data.ethnicity,
          favoriteAnimals: data.fav_animals,
          favoriteActivities: data.fav_activities,
          favoriteShows: data.fav_shows,
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

    // Validation to ensure all required fields are filled
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
      try {
        // API call to modify child data
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
        navigate(-1); // Navigate back after successful operation
      } catch (error) {
        console.error("Error modifying child:", error);
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
        <h1>Update Child's Profile</h1>
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

export default ModifyChildPage;

import React, { useState, useEffect} from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
import { eyeColors, hairType, hairColor, races } from '../components/ChildAttributes.js';

import Spinner from "../components/Spinner";
import "./styles/AddachildPage.css";

const AddachildPage = () => {

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    document.title = "Dreamify | Add Child";
  }, []);

  const api = useApi();

  const [firstName, setFirstName] = useState(null);
  const [selectedEyeColor, setSelectedEyeColor] = useState(null);
  const [selectedHairType, setSelectedHairType] = useState(null);
  const [selectedHairColor, setSelectedHairColor] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [customRaceInput, setCustomRaceInput] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("0-3");
  const [selectedSex, setSelectedSex] = useState("Male");
  const [favoriteAnimals, setFavoriteAnimals] = useState(null);
  const [favoriteActivities, setFavoriteActivities] = useState(null);
  const [favoriteShows, setFavoriteShows] = useState(null);

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
    }
    else {
      if (isVisible === false) {
        setIsVisible(true);
        setSelectedHairColor(null);
      }
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
    setSelectedRace(value ? value : null);
  };

  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading

    try {
      const payload = {
        name: firstName,
        age_range: selectedAgeRange,
        sex: selectedSex,
        eye_color: selectedEyeColor,
        hair_type: selectedHairType,
        hair_color: selectedHairColor,
        ethnicity: customRaceInput !== "" ? customRaceInput : selectedRace,
        fav_animals: favoriteAnimals,
        fav_activities: favoriteActivities,
        fav_shows: favoriteShows,
      };
      // Attempt to create a child
      const response = await api.postCreateChild(payload);
      console.log("Child created/modified successfully:", response);
      // Redirect to the user profile page
      navigate(-1);
    } catch (error) {
      // Log the error
      console.error("Error modifying child:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
    <div className="add-child-page">
      <h1>Add a child's profile</h1>
      <div className="hr-style"></div>
      <form className="add-child-form" onSubmit={handleSubmit}>
        <h5>DEMOGRAPHY</h5>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          placeholder="Kid's first name"
          onChange={handleTextFieldChange(setFirstName)}
        />

        <label htmlFor="ageRange">Age Range</label>
        <div className="buttons">
          {ageRanges.map((range) => (
            <button
              type="button"
              key={range}
              onClick={() => setSelectedAgeRange(range)}
              style={{
                backgroundColor:
                  selectedAgeRange === range ? "#014A8A" : "#77CFD1",
                color: selectedAgeRange === range ? "white" : "black",
              }}
            >
              {range}
            </button>
          ))}
        </div>

        <label htmlFor="sex">Sex</label>
        <div className="buttons">
          {sexes.map((sex) => (
            <button
              type="button"
              key={sex}
              onClick={() => setSelectedSex(sex)}
              style={{
                backgroundColor: selectedSex === sex ? "#014A8A" : "#77CFD1",
                color: selectedSex === sex ? "white" : "black",
              }}
            >
              {sex}
            </button>
          ))}
        </div>

        <h5>VISUAL FEATURES</h5>

        <label htmlFor="eyeColor">Eye Color</label>
        <div className="vis-features">
          {eyeColors.map((eyeColor) => (
            <div className="vis-feature-container" key={eyeColor.name}>
              <img
                src={eyeColor.imageUrl}
                alt={eyeColor.name}
                className={`vis-feature ${
                  selectedEyeColor === eyeColor.name ? "selected" : ""
                }`}
                onClick={() => setSelectedEyeColor(eyeColor.name)}
              />
              <p className="vis-feature-name">{eyeColor.name}</p>
            </div>
          ))}
        </div>

        <label htmlFor="hairType">Hair Type</label>
        <div className="vis-features">
          {hairType.map((hair) => (
            <div className="vis-feature-container" key={hair.name}>
              <img
                src={hair.imageUrl}
                alt={hair.name}
                className={`vis-feature ${
                  selectedHairType === hair.name ? "selected" : ""
                }`}
                onClick={() => handleHairTypeSelect(hair.name)}
              />
              <p className="vis-feature-name">{hair.name}</p>
            </div>
          ))}
        </div>


        {isVisible && (
          <>
          <label htmlFor="hairColor">Hair Color</label>
          <div className="vis-features">
            {hairColor.map((color) => (
              <div className="vis-feature-container" key={color.name}>
                <img
                  src={color.imageUrl}
                  alt={color.name}
                  className={`vis-feature ${
                    selectedHairColor === color.name ? "selected" : ""
                  }`}
                  onClick={() => setSelectedHairColor(color.name)}
                />
                <p className="vis-feature-name">{color.name}</p>
              </div>
            ))}
          </div>
        </>
        )}

        <label htmlFor="race">Race/Ethnicity</label>
        <div className="vis-features">
          {races.map((race) => (
            <div className="vis-feature-container" key={race.name}>
              <img
                src={race.imageUrl}
                alt={race.name}
                className={`vis-feature ${
                  selectedRace === race.name ? "selected" : ""
                }`}
                onClick={() => handleRaceSelect(race.name)}
              />
              <p className="vis-feature-name">{race.name}</p>
            </div>
          ))}

          <div className="vis-feature-container custom-race">
            <input
              type="text"
              className="custom-race-input"
              placeholder="Type custom race"
              value={customRaceInput !== null ? customRaceInput : ""}
              onChange={(e) => handleCustomRaceInput(e)}
            />
          </div>
        </div>

        <div className="form-section interests">
          <h5>INTERESTS</h5>

          <label htmlFor="favoriteAnimals">Favorite Animals</label>
          <input
            type="text"
            id="favoriteAnimals"
            placeholder="Cats, Horses, Dinosaurs"
            onChange={handleTextFieldChange(setFavoriteAnimals)}
          />

          <label htmlFor="favoriteActivities">Favorite Activities</label>
          <input
            type="text"
            id="favoriteActivities"
            placeholder="Dancing, LEGO, Drawing"
            onChange={handleTextFieldChange(setFavoriteActivities)}
          />

          <label htmlFor="favoriteShows">Favorite Shows</label>
          <input
            type="text"
            id="favoriteShows"
            placeholder="Doctor Who, Harry Potter"
            onChange={handleTextFieldChange(setFavoriteShows)}
          />
        </div>

        <button type="submit" className="generate-button">
          Add Child
        </button>
      </form>
    </div>
  );
};

export default AddachildPage;

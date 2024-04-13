import React, { useState, useEffect } from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert } from "react-bootstrap";
import Spinner from "../components/Spinner";
import "./styles/AddachildPage.css";

const eyeColors = [
  { name: "Blue", imageUrl: require("../assets/add_child_pics/image 9.jpg") },
  { name: "Brown", imageUrl: require("../assets/add_child_pics/image 10.jpg") },
  { name: "Green", imageUrl: require("../assets/add_child_pics/image 11.jpg") },
  { name: "Hazel", imageUrl: require("../assets/add_child_pics/image 12.jpg") },
  { name: "Amber", imageUrl: require("../assets/add_child_pics/image 13.jpg") },
  { name: "Gray", imageUrl: require("../assets/add_child_pics/image 14.jpg") },
];

const hairType = [
  {
    name: "Straight",
    imageUrl: require("../assets/add_child_pics/image 20.jpg"),
  },
  { name: "Wavy", imageUrl: require("../assets/add_child_pics/image 21.jpg") },
  { name: "Curly", imageUrl: require("../assets/add_child_pics/image 22.jpg") },
  { name: "Kinky", imageUrl: require("../assets/add_child_pics/image 23.jpg") },
  { name: "Bald", imageUrl: require("../assets/add_child_pics/image 24.jpg") },
];

const hairColor = [
  {
    name: "Blonde",
    imageUrl: require("../assets/add_child_pics/image 26.jpg"),
  },
  { name: "Brown", imageUrl: require("../assets/add_child_pics/image 27.jpg") },
  { name: "Black", imageUrl: require("../assets/add_child_pics/image 28.jpg") },
  { name: "Red", imageUrl: require("../assets/add_child_pics/image 29.jpg") },
  {
    name: "Auburn",
    imageUrl: require("../assets/add_child_pics/image 30.jpg"),
  },
  { name: "Gray", imageUrl: require("../assets/add_child_pics/image 31.jpg") },
  { name: "White", imageUrl: require("../assets/add_child_pics/image 32.jpg") },
];

const races = [
  { name: "Asian", imageUrl: require("../assets/add_child_pics/image 45.jpg") },
  { name: "Black", imageUrl: require("../assets/add_child_pics/image 46.jpg") },
  { name: "Brown", imageUrl: require("../assets/add_child_pics/image 47.jpg") },
  { name: "White", imageUrl: require("../assets/add_child_pics/image 48.jpg") },
  {
    name: "Hispanic",
    imageUrl: require("../assets/add_child_pics/image 49.jpg"),
  },
  {
    name: "Middle Eastern",
    imageUrl: require("../assets/add_child_pics/image 50.jpg"),
  },
];

const ModifyChildPage = () => {

  const [isVisible, setIsVisible] = useState(true);

  const api = useApi();
  const location = useLocation();

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
  const [childData, setChildData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];
  const [error, setError] = useState("");

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
        setChildData(data);
        // Set form fields based on fetched data
        setFirstName(data.name);
        setSelectedEyeColor(data.eye_color);
        setSelectedHairType(data.hair_type);
        setSelectedHairColor(data.hair_color);
        setIsVisible(data.hair_type !== "Bald");
        const isEthnicityPredefined = races.some(race => race.name === data.ethnicity);
        // todo: delete the console.log statements
        console.log(data.ethnicity);
        console.log(isEthnicityPredefined);
        if (isEthnicityPredefined) {
          setSelectedRace(data.ethnicity);
        } else {
          setCustomRaceInput(data.ethnicity);
        }
        setSelectedAgeRange(data.age_range);
        setSelectedSex(data.sex);
        setFavoriteAnimals(data.fav_animals);
        setFavoriteActivities(data.fav_activities);
        setFavoriteShows(data.fav_shows);
      } catch (error) {
        console.error("Error fetching child data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      fetchChildData();
    }
  }, [location, api]);

  // Show a spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    setCustomRaceInput("");

  };

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

  const handleCustomRaceInput = (e) => {
    const value = e.target.value;
    setCustomRaceInput(value);
    setSelectedRace(value ? value: null);
  };


  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
  };

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
      if (missedInputs) {
        setError(`You have missed the following input(s): ${missedInputs}`);
    } else {

    setIsLoading(true); // Start loading

    try {
      const payload = {
        child_id: childData.child_id,
        name: firstName,
        age_range: selectedAgeRange,
        sex: selectedSex,
        eye_color: selectedEyeColor,
        hair_type: selectedHairType,
        hair_color: selectedHairColor,
        ethnicity: selectedRace === null ? customRaceInput : selectedRace,
        fav_animals: favoriteAnimals,
        fav_activities: favoriteActivities,
        fav_shows: favoriteShows,
      };
      // Attempt to create a child
      const response = await api.patchModifyChild(payload);
      console.log("Child created/modified successfully:", response);
      // Redirect to the user profile page
      navigate(-1);
    } catch (error) {
      // Log the error
      console.error("Error modifying child:", error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  }};

  return (
    <div className="add-child-page">
      <h1>Modify Child's Profile</h1>
      <div className="hr-style"></div>
      <form className="add-child-form" onSubmit={handleSubmit}>
        <h5>DEMOGRAPHY</h5>
        <label htmlFor="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          placeholder="Kid's first name"
          value={firstName !== null ? firstName : ""}
          onChange={handleTextFieldChange(setFirstName)}
          required
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
            value={favoriteAnimals !== null ? favoriteAnimals : ""}
            onChange={handleTextFieldChange(setFavoriteAnimals)}
            required
          />

          <label htmlFor="favoriteActivities">Favorite Activities</label>
          <input
            type="text"
            id="favoriteActivities"
            placeholder="Dancing, LEGO, Drawing"
            value={favoriteActivities !== null ? favoriteActivities : ""}
            onChange={handleTextFieldChange(setFavoriteActivities)}
            required
          />

          <label htmlFor="favoriteShows">Favorite Shows</label>
          <input
            type="text"
            id="favoriteShows"
            placeholder="Doctor Who, Harry Potter"
            value={favoriteShows !== null ? favoriteShows : ""}
            onChange={handleTextFieldChange(setFavoriteShows)}
            required
          />
        </div>

        <div className="lastOnPage">
        {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        <button type="submit" className="generate-button">
          Modify
        </button>
        </div>
      </form>
    </div>
  );
};

export default ModifyChildPage;

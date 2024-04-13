import React, { useState, useEffect} from "react";
import { useApi } from "../contexts/ApiProvider";
import { useNavigate } from "react-router-dom";
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
  const [error, setError] = useState("");

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
      
      console.log(missedInputs)

      console.error("Error modifying child:", error);
      

    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  }};

  return (
    <div className="add-child-page">
      <h1>Add a child's profile</h1>
      <div className="hr-style"></div>
      <form className="add-child-form" onSubmit={handleSubmit}>
        <h5>DEMOGRAPHY</h5>
        <label htmlFor="firstName">First Name *</label>
        <input
          type="text"
          id="firstName"
          placeholder="Kid's first name"
          onChange={handleTextFieldChange(setFirstName)}
          required
        />

        <label htmlFor="ageRange">Age Range *</label>
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

        <label htmlFor="sex">Sex *</label>
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

        <label htmlFor="eyeColor">Eye Color *</label>
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

        <label htmlFor="hairType">Hair Type *</label>
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
          <label htmlFor="hairColor">Hair Color *</label>
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

        <label htmlFor="race">Race/Ethnicity *</label>
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
            required
          />

          <label htmlFor="favoriteActivities">Favorite Activities</label>
          <input
            type="text"
            id="favoriteActivities"
            placeholder="Dancing, LEGO, Drawing"
            onChange={handleTextFieldChange(setFavoriteActivities)}
            required
          />

          <label htmlFor="favoriteShows">Favorite Shows</label>
          <input
            type="text"
            id="favoriteShows"
            placeholder="Doctor Who, Harry Potter"
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
          Add Child
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddachildPage;

import React, { useState, useEffect } from 'react';
import { useApi } from "../contexts/ApiProvider";
import { useNavigate, useLocation } from 'react-router-dom';

import './styles/AddachildPage.css'; 
import Spinner from '../components/Spinner';


const eyeColors = [
  { name: 'Blue', imageUrl: require('../assets/add_child_pics/image 9.jpg') },
  { name: 'Brown', imageUrl: require('../assets/add_child_pics/image 10.jpg') },
  { name: 'Green', imageUrl: require('../assets/add_child_pics/image 11.jpg') },
  { name: 'Hazel', imageUrl: require('../assets/add_child_pics/image 12.jpg') },
  { name: 'Amber', imageUrl: require('../assets/add_child_pics/image 13.jpg') },
  { name: 'Grey', imageUrl: require('../assets/add_child_pics/image 14.jpg') }
];

const hairType = [
  { name: 'Straight', imageUrl: require('../assets/add_child_pics/image 20.jpg') },
  { name: 'Wavy', imageUrl: require('../assets/add_child_pics/image 21.jpg') },
  { name: 'Curly', imageUrl: require('../assets/add_child_pics/image 22.jpg') },
  { name: 'Kinky', imageUrl: require('../assets/add_child_pics/image 23.jpg') },
  {name: 'Bald', imageUrl: require('../assets/add_child_pics/image 24.jpg')}
]

const hairColor = [
  { name: 'Blonde', imageUrl: require('../assets/add_child_pics/image 26.jpg') },
  { name: 'Brown', imageUrl: require('../assets/add_child_pics/image 27.jpg') },
  { name: 'Black', imageUrl: require('../assets/add_child_pics/image 28.jpg') },
  { name: 'Red', imageUrl: require('../assets/add_child_pics/image 29.jpg') },
  {name: 'Auburn', imageUrl: require('../assets/add_child_pics/image 30.jpg')},
  { name: 'Grey', imageUrl: require('../assets/add_child_pics/image 31.jpg') },
  { name: 'White', imageUrl: require('../assets/add_child_pics/image 32.jpg')}
]

const races = [
  { name: 'Asian', imageUrl: require('../assets/add_child_pics/image 45.jpg') },
  { name: 'Black', imageUrl: require('../assets/add_child_pics/image 46.jpg') },
  {name: 'Brown', imageUrl: require('../assets/add_child_pics/image 47.jpg')},
  { name: 'White', imageUrl: require('../assets/add_child_pics/image 48.jpg') },
  { name: 'Hispanic', imageUrl: require('../assets/add_child_pics/image 49.jpg') },
  {name: 'Middle Eastern', imageUrl: require('../assets/add_child_pics/image 50.jpg')}
]

// Your constants for eyeColors, hairType, hairColor, and races remain the same

const Modifychild = () => {
  const api = useApi(); 
  const location = useLocation(); 

  const [firstName, setFirstName] = useState(''); 
  const [selectedEyeColor, setSelectedEyeColor] = useState(null);
  const [selectedHairType, setSelectedHairType] = useState(null);
  const [selectedHairColor, setSelectedHairColor] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [customRaceInput, setCustomRaceInput] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("0-3");
  const [selectedSex, setSelectedSex] = useState("Male");
  const [favoriteAnimals, setFavoriteAnimals] = useState('');
  const [favoriteActivities, setFavoriteActivities] = useState('');
  const [favoriteShows, setFavoriteShows] = useState('');

  const navigate = useNavigate();

  // Initialize states with null or appropriate initial values
  const [childData, setChildData] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];

  // Fetch child data on component mount
  useEffect(() => {
    const childId = location.pathname.split('/').pop();
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
        setSelectedRace(data.skin_tone); // Adjust according to how race is handled in your application
        setSelectedAgeRange(data.age_range);
        setSelectedSex(data.sex);
        setFavoriteAnimals(data.fav_animals);
        setFavoriteActivities(data.fav_activities);
        setFavoriteShows(data.fav_shows);

      } catch (error) {
        console.error('Error fetching child data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (childId) {
      fetchChildData();
    }
  }, [location, api]);

  if (isLoading) {
    return <Spinner />;
  }
  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleEyeColorSelect = (color) => {
    setSelectedEyeColor(color);
  };
  const handleHairTypeSelect = (hair) => {
    setSelectedHairType(hair);
  };
  const handleHairColorSelect = (color) => {
    setSelectedHairColor(color);
  };

  const handleRaceSelect = (race) => {
    setSelectedRace(race);
    if (race !== 'custom') {
      setCustomRaceInput('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
  
    try {
      // Define your payload as before
      const payload = {
        name: event.target.firstName.value, 
        child_id: childData.child_id,
        age_range: selectedAgeRange,
        sex: selectedSex,
        sibling_relationship: "Only",
        eye_color: selectedEyeColor,
        hair_type: selectedHairType,
        hair_color: selectedHairColor,
        skin_tone: selectedRace === 'custom' ? customRaceInput : selectedRace,
        fav_animals: event.target.favoriteAnimals.value,
        fav_activities: event.target.favoriteActivities.value, 
        fav_shows: event.target.favoriteShows.value, 
      };
      // Attempt to create a child
      const response = await api.patchModifyChild(payload);
      console.log('Child created/modified successfully:', response);
      // Redirect to the user profile page
      navigate(-1);

    } catch (error) {
      if (error instanceof Error) {
        // Log the error message if it's an instance of Error
        console.error('Error during operation:', error.message);
      } else {
        // If the error is not an instance of Error, it might be a response object
        console.error('Error response:', error);
        // Attempt to parse and log the JSON body of the response
        try {
          const errorBody = await error.json();
          console.log('Error details:', errorBody);
        } catch (jsonError) {
          // If parsing the error body fails, log the parsing error
          console.error('Error parsing error response:', jsonError);
        }
      }
      // Handle error here (e.g., show an error message to the user)
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };

  return (
      <div className="add-child-page">
        <h1>Modify Child's Profile</h1>
        <div className="hr-style"></div>
        <form className='add-child-form' onSubmit={handleSubmit}>
            <h5>DEMOGRAPHY</h5>
            <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="Kid's first name or the way you want them to be called in the stories"
                value={firstName}
                onChange={handleInputChange(setFirstName)}
              />       

            <label htmlFor="ageRange">Age Range</label>
            <div className="buttons">
              {ageRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedAgeRange(range)}
                  style={{
                    backgroundColor: selectedAgeRange === range ? '#014A8A' : '#77CFD1',
                    color: selectedAgeRange === range ? 'white' : 'black',
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
                  key={sex}
                  onClick={() => setSelectedSex(sex)}
                  style={{
                    backgroundColor: selectedSex === sex ? '#014A8A' : '#77CFD1',
                    color: selectedSex === sex ? 'white' : 'black',
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
                    className={`vis-feature ${selectedEyeColor === eyeColor.name ? 'selected' : ''}`}
                    onClick={() => handleEyeColorSelect(eyeColor.name)}
                  />
                  <p className='vis-feature-name'>{eyeColor.name}</p>
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
                    className={`vis-feature ${selectedHairType === hair.name ? 'selected' : ''}`}
                    onClick={() => handleHairTypeSelect(hair.name)}
                  />
                  <p className='vis-feature-name'>{hair.name}</p>
                </div>
              ))}
            </div>

            <label htmlFor="hairColor">Hair Color</label>
            <div className="vis-features">
              {hairColor.map((color) => (
                <div className="vis-feature-container" key={color.name}>
                  <img
                    src={color.imageUrl}
                    alt={color.name}
                    className={`vis-feature ${selectedHairColor === color.name ? 'selected' : ''}`}
                    onClick={() => handleHairColorSelect(color.name)}
                  />
                  <p className='vis-feature-name'>{color.name}</p>
                </div>
              ))}
            </div>
            <label htmlFor="race">Race/Ethnicity</label>
            <div className="vis-features">
              {races.map((race) => (
                <div className="vis-feature-container" key={race.name}>
                  <img
                    src={race.imageUrl}
                    alt={race.name}
                    className={`vis-feature ${selectedRace === race.name ? 'selected' : ''}`}
                    onClick={() => handleRaceSelect(race.name)}
                  />
                  <p className='vis-feature-name'>{race.name}</p>
                </div>
              ))}
              <div className="vis-feature-container custom-race">
                <input
                  type="text"
                  className="custom-race-input"
                  placeholder="Type custom race"
                  value={customRaceInput}
                  onChange={(e) => setCustomRaceInput(e.target.value)}
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
                value={favoriteAnimals}
                onChange={handleInputChange(setFavoriteAnimals)}
              />

              <label htmlFor="favoriteActivities">Favorite Activities</label>
              <input
                type="text"
                id="favoriteActivities"
                placeholder="Dancing, LEGO, Drawing"
                value={favoriteActivities}
                onChange={handleInputChange(setFavoriteActivities)}
              />

              <label htmlFor="favoriteShows">Favorite Shows</label>
              <input
                type="text"
                id="favoriteShows"
                placeholder="Doctor Who, Harry Potter"
                value={favoriteShows}
                onChange={handleInputChange(setFavoriteShows)}
              />
            </div>

          <button className="generate-button">
           Modify
          </button>
        </form>
      </div>
  );
};

export default Modifychild;

import React, { useState } from 'react';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import { useParams } from 'react-router-dom';
import './styles/AddachildPage.css'; 


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

const AddachildPage = () => {
  const api = useApi(); 

  const {login } = useAuth();

  const [selectedEyeColor, setSelectedEyeColor] = useState(null);
  const [selectedHairType, setSelectedHairType] = useState(null);
  const [selectedHairColor, setSelectedHairColor] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [customRaceInput, setCustomRaceInput] = useState("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("0-3");
  const [selectedSex, setSelectedSex] = useState("Male");

  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];

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

    try {
      // Perform the login operation
      await login("john.doe@example.com", "password123");
    
      const payload = {
        name: event.target.firstName.value, 
        age_range: selectedAgeRange,
        sex: selectedSex,
        sibling_relationship: "",
        eye_color: selectedEyeColor,
        hair_type: selectedHairType,
        hair_color: selectedHairColor,
        race: selectedRace === 'custom' ? customRaceInput : selectedRace,
        fav_animals: event.target.favoriteAnimals.value,
        fav_activities: event.target.favoriteActivities.value, 
        fav_shows: event.target.favoriteShows.value, 
      };
  
      // Assuming you're creating a new child
      const response = await api.postCreateChild(payload);
      console.log('Child created/modified successfully:', response);
      // Handle success here (e.g., navigate to another page or show a success message)
    } catch (error) {
      console.error('Error during operation:', error);
      // Handle error here (e.g., show an error message to the user)
    }
  };

  return (
      <div className="add-child-page">
        <h1>Add a child's profile</h1>
        <div className="hr-style"></div>
        <form className='add-child-form' onSubmit={handleSubmit}>
            <h5>DEMOGRAPHY</h5>
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" placeholder="Kid's first name or the way you want them to be called in the stories" />
            <input type="text" placeholder="Kid's first name or the way you want them to be called in the stories" />

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
                <img
                  src={require('../assets/add_child_pics/image 51.jpg')}
                  alt="Custom Race"
                  className="vis-feature"
                  onClick={() => setSelectedRace('custom')}
                />
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
            <input type="text" id="favoriteAnimals" placeholder="Cats, Horses, Dinosaurs" />

            <label htmlFor="favoriteActivities">Favorite Activities</label>
            <input type="text" id="favoriteActivities" placeholder="Dancing, LEGO, Drawing" />

            <label htmlFor="favoriteShows">Favorite Shows</label>
            <input type="text" id="favoriteShows" placeholder="Doctor who, Harry Potter" />
          </div>

          <button className="generate-button">
          Add a Child
           </button>
        </form>
      </div>
  );
};

export default AddachildPage;

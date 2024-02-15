import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useEffect } from 'react';

// Arrays to store the options for the user to select from
const eyeColors = ['Blue', 'Brown', 'Green', 'Hazel', 'Amber', 'Gray'];
const hairTypes = ['Straight', 'Wavy', 'Curly', 'Kinky', 'Bald'];
const skinTones = ['Light', 'Fair', 'Medium', 'Olive', 'Brown', 'Dark'];
const hairColors = ['Blonde', 'Brown', 'Black', 'Red', 'Gray', 'White', 'None'];
const ageRanges = ['0-3', '4-6', '7-9', '10-13'];
const sexes = ['Male', 'Female', 'Other'];
const siblingRelationships = ['Only', 'Youngest', 'Middle', 'Oldest'];

// Backend API URL
const backend_api = 'http://localhost:5000/api/newstory'; // Replace with our backend API URL


const NewStoryPage = () => {
    // State to store the selected options
    const [selectedEyeColor, setSelectedEyeColor] = useState('');
    const [selectedHairType, setSelectedHairType] = useState('');
    const [selectedHairColor, setSelectedHairColor] = useState('');
    const [selectedSkinColor, setSelectedSkinColor] = useState('');
    const [name, setName] = useState('');
    const [selectedAgeRange, setSelectedAgeRange] = useState('');
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedSiblingRelationship, setSelectedSiblingRelationship] = useState('');
    const [favoriteAnimals, setFavoriteAnimals] = useState('');
    const [favoriteActivities, setFavoriteActivities] = useState('');
    const [favoriteShows, setFavoriteShows] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle the selected sex
    const handleSelectedSex = (sex) => {
      if (sex === 'Other') {
        setSelectedSex('Non-binary') // I am assuming chatGPT will understand non-binary nore than 'other'
      }
      else {
        setSelectedSex(sex)
      }
    };

    // Function to navigate to a different page
    const navigate = useNavigate();

    // Set the title of the page
    useEffect(() => {
      document.title = 'Dreamify | New Story';
  }, []);

    // Function to handle data submission
    const handleSubmit = async () => {
      setIsLoading(true);
      const payload = {
          selectedEyeColor,
          selectedHairType,
          name,
          selectedAgeRange,
          selectedAgeRange,
          selectedSiblingRelationship,
          favoriteAnimals,
          favoriteActivities,
          favoriteShows
      };
      try {
        const response = await fetch(backend_api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        setIsLoading(false);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log('Submission successful', jsonResponse);
            // Handle successful submission here, e.g., showing a success message
            navigate('/story', { state: { data: jsonResponse } });
        } else {
            // Handle server errors or invalid responses
            console.error('Submission failed', await response.text());
        }
    } catch (error) {
        // Handle network errors
        console.error('Network error:', error);
    }
};
    if (isLoading) {
      return <Spinner />; // Show the spinner while loading
    }

    return (
        <div>
            <h1>Create a new story</h1>
            <h2>Physical Appearance</h2>
            <div>
                <h3>Skin Color</h3>
                {skinTones.map(skin => (
                    <button key={skin} onClick={() => setSelectedSkinColor(skin)}>
                        {skin}
                    </button>
                ))}
            </div>
            <div>
                <h3>Eye Color</h3>
                {eyeColors.map(color => (
                    <button key={color} onClick={() => setSelectedEyeColor(color)}>
                        {color}
                    </button>
                ))}
            </div>
            <div>
                <h3>Hair Type</h3>
                {hairTypes.map(type => (
                    <button key={type} onClick={() => setSelectedHairType(type)}>
                        {type}
                    </button>
                ))}
            </div>
            <div>
                <h3>Hair Color</h3>
                {hairColors.map(color => (
                    <button key={color} onClick={() => setSelectedHairColor(color)}>
                        {color}
                    </button>
                ))}
            </div>
            <h2>Demography</h2>
            <div>
                <h3>Name</h3>
                <input
                    type="text"
                    placeholder="Enter first name or nickname"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <h3>Age Range</h3>
                {ageRanges.map(age => (
                    <button key={age} onClick={() => setSelectedAgeRange(age)}>
                        {age}
                    </button>
                ))}
            </div>
            <div>
                <h3>Sex</h3>
                {sexes.map(sex => (
                    <button key={sex} onClick={() => handleSelectedSex(sex)}>
                        {sex}
                    </button>
                ))}
            </div>
            <div>
                <h3>Sibling Type</h3>
                {siblingRelationships.map(sibling => (
                    <button key={sibling} onClick={() => setSelectedSiblingRelationship(sibling)}>
                        {sibling}
                    </button>
                ))}
            </div>
            <h2>Interests</h2>
            <div>
                <h3>Favorite Animals</h3>
                <input
                    type="text"
                    placeholder="Enter favorite animals"
                    value={favoriteAnimals}
                    onChange={(e) => setFavoriteAnimals(e.target.value)}
                />
            </div>
            <div>
                <h3>Favorite Activities</h3>
                <input
                    type="text"
                    placeholder="Enter favorite activities"
                    value={favoriteActivities}
                    onChange={(e) => setFavoriteActivities(e.target.value)}
                />
            </div>
            <div>
                <h3>Favorite Cartoons/Movies</h3>
                <input
                    type="text"
                    placeholder="Enter favorite cartoons/movies"
                    value={favoriteShows}
                    onChange={(e) => setFavoriteShows(e.target.value)}
                />
            </div>


            <br/>
            <h3>Selected Options</h3>
            <div>
                Selected Skin Color: {selectedSkinColor}
                <br/>
                Selected Eye Color: {selectedEyeColor}
                <br/>
                Selected Hair Type: {selectedHairType}
                <br/>
                Selected Hair Color: {selectedHairColor}
                <br/>
                Name: {name}
                <br/>
                Selected Age: {selectedAgeRange}
                <br/>
                Selected Sex: {selectedSex}
                <br/>
                Selected Sibling type: {selectedSiblingRelationship}
                <br/>
                Selected Animal: {favoriteAnimals}
                <br/>
                Selected Activity: {favoriteActivities}
                <br/>
                Selected Show: {favoriteShows}
            </div>
            <br/>
            <button onClick={handleSubmit}>Create</button>
        </div>
    );
};

export default NewStoryPage;

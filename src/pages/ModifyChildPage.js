import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/AddachildPage.css'; 


const eyeColors = [
  { name: 'blue', imageUrl: require('../assets/blue_eye.webp') },
  { name: 'brown', imageUrl: require('../assets/brown_eye.webp') },
  { name: 'green', imageUrl: require('../assets/green_eye.webp') },
  { name: 'hazel', imageUrl: require('../assets/hazel_eye.webp') },
  { name: 'amber', imageUrl: require('../assets/amber_eye.webp') }
];


const AddachildPage = () => {
  const [selectedEyeColor, setSelectedEyeColor] = useState(null);
  const [selectedAgeRange, setSelectedAgeRange] = useState("0-3");
  const [selectedSex, setSelectedSex] = useState("Male");
  const [selectedSiblingRelationship, setSelectedSiblingRelationship] = useState("Only Child");

  const ageRanges = ["0-3", "4-6", "7-9", "10-13"];
  const sexes = ["Male", "Female"];
  const siblingRelationships = ["Only Child", "Youngest", "Middle", "Oldest"];

  const handleEyeColorSelect = (color) => {
    setSelectedEyeColor(color);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Submit form logic
  };

  return (
    <>
      <Header />
      <div className="add-child-page">
        <h1>Modify Child's profile</h1>
        <div className="hr-style"></div>
        <form onSubmit={handleSubmit}>
            <h5>DEMOGRAPHY</h5>
            <label>First Name</label>
            <input type="text" placeholder="Kid's first name or the way you want them to be called in the stories" />

            <label>Age Range</label>
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

            <label>Sex</label>
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

            <label>Sibling Relationship</label>
            <div className="buttons">
              {siblingRelationships.map((relationship) => (
                <button
                  key={relationship}
                  onClick={() => setSelectedSiblingRelationship(relationship)}
                  style={{
                    backgroundColor: selectedSiblingRelationship === relationship ? '#014A8A' : '#77CFD1',
                    color: selectedSiblingRelationship === relationship ? 'white' : 'black',
                  }}
                >                 
                {relationship}
                </button>
               ))}
            </div>

            <h5>VISUAL FEATURES</h5>
            <label>Eye Color</label>
            <div className="eye-colors">
              {eyeColors.map((eyeColor) => (
                <img
                  key={eyeColor.name}
                  src={eyeColor.imageUrl}
                  alt={eyeColor.name}
                  className={`eye-color ${selectedEyeColor === eyeColor.name ? 'selected' : ''}`}
                  onClick={() => handleEyeColorSelect(eyeColor.name)}
                />
              ))}
            </div>
        
          <div className="form-section interests">
            <h5>INTERESTS</h5>
            <label>Favorite Animals</label>
            <input type="text" placeholder="Cats, Horses, Dinosaurs" />

            <label>Favorite Activities</label>
            <input type="text" placeholder="Dancing, LEGO, Drawing" />

            <label>Favorite Shows</label>
            <input type="text" placeholder="Doctor who, Harry Potter" />
          </div>

          <button className="generate-button">
          Modify the information
          </button>
        </form>
        
      </div>
      <Footer />
    </>
  );
};

export default AddachildPage;

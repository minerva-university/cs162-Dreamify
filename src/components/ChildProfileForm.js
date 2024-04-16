import React from 'react';
import { eyeColors, hairType, hairColor, races } from '../utils/ChildAttributes';
import { Alert } from "react-bootstrap";

// Child profile form
const ChildProfileForm = ({ formData, setFormData, handleSubmit, isLoading, isVisible, setIsVisible, error }) => {
   // Handle text field change
    const handleTextFieldChange = (field) => (event) => {
        const value = event.target.value;
        if (field === 'customRaceInput' && value) {
          setFormData({ ...formData, [field]: value, race: '' });
        } else {
          setFormData({ ...formData, [field]: value });
        }
      };
  // Handle select change
  const handleSelectChange = (field, value) => {
    if (field === 'hairType') {
      const isBald = value === 'Bald';
      setIsVisible(!isBald);
      setFormData({ ...formData, hairColor: isBald ? 'Bald' : '', [field]: value });
    } else if (field === 'race') {
      setFormData({ ...formData, [field]: value, customRaceInput: '' });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };
  // Render the form
  return (
    // Form element with an onSubmit handler
    <form className="add-child-page" onSubmit={handleSubmit}>
      {/* Section for demographic information */}
      <h5>DEMOGRAPHY</h5>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        placeholder="Kid's first name"
        value={formData.firstName || ''}
        onChange={handleTextFieldChange('firstName')}
      />
      
      {/* Buttons for selecting age range */}
      <label htmlFor="ageRange">Age Range</label>
      <div className="buttons">
        {['0-3', '4-6', '7-9', '10-13'].map((range) => (
          <button
            type="button"
            key={range}
            onClick={() => handleSelectChange('ageRange', range)}
            style={{
              backgroundColor: formData.ageRange === range ? '#014A8A' : '#77CFD1',
              color: formData.ageRange === range ? 'white' : 'black',
            }}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Buttons for selecting sex */}
      <label htmlFor="sex">Sex</label>
      <div className="buttons">
        {['Male', 'Female'].map((sex) => (
          <button
            type="button"
            key={sex}
            onClick={() => handleSelectChange('sex', sex)}
            style={{
              backgroundColor: formData.sex === sex ? '#014A8A' : '#77CFD1',
              color: formData.sex === sex ? 'white' : 'black',
            }}
          >
            {sex}
          </button>
        ))}
      </div>

      {/* Section for visual features */}
      <h5>VISUAL FEATURES</h5>
      <label htmlFor="eyeColor">Eye Color</label>
      <div className="vis-features">
        {eyeColors.map((eyeColor) => (
          <div className="vis-feature-container" key={eyeColor.name}>
            <img
              src={eyeColor.imageUrl}
              alt={eyeColor.name}
              className={`vis-feature ${formData.eyeColor === eyeColor.name ? 'selected' : ''}`}
              onClick={() => handleSelectChange('eyeColor', eyeColor.name)}
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
              className={`vis-feature ${formData.hairType === hair.name ? 'selected' : ''}`}
              onClick={() => handleSelectChange('hairType', hair.name)}
            />
            <p className="vis-feature-name">{hair.name}</p>
          </div>
        ))}
      </div>
      
      {/* Conditionally render hair color selection if it is applicable */}
      {isVisible && (
        <>
          <label htmlFor="hairColor">Hair Color</label>
          <div className="vis-features">
            {hairColor.map((color) => (
              <div className="vis-feature-container" key={color.name}>
                <img
                  src={color.imageUrl}
                  alt={color.name}
                  className={`vis-feature ${formData.hairColor === color.name ? 'selected' : ''}`}
                  onClick={() => handleSelectChange('hairColor', color.name)}
                />
                <p className="vis-feature-name">{color.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Race/Ethnicity selection, including an option for custom input */}
      <label htmlFor="race">Race/Ethnicity</label>
      <div className="vis-features">
        {races.map((race) => (
          <div className="vis-feature-container" key={race.name}>
            <img
              src={race.imageUrl}
              alt={race.name}
              className={`vis-feature ${formData.race === race.name ? 'selected' : ''}`}
              onClick={() => handleSelectChange('race', race.name)}
            />
            <p className="vis-feature-name">{race.name}</p>
          </div>
        ))}
        <div className="vis-feature-container custom-race">
          <input
            type="text"
            className="custom-race-input"
            placeholder="Type custom race"
            value={formData.customRaceInput || ''}
            onChange={handleTextFieldChange('customRaceInput')}
          />
        </div>
      </div>

      {/* Section for interests */}
      <div className="form-section interests">
        <h5><b>INTERESTS </b>(optional)</h5>
        <label htmlFor="favoriteAnimals">Favorite Animals</label>
        <input
          type="text"
          id="favoriteAnimals"
          placeholder="Cats, Horses, Dinosaurs"
          value={formData.favoriteAnimals || ''}
          onChange={handleTextFieldChange('favoriteAnimals')}
        />
        <label htmlFor="favoriteActivities">Favorite Activities</label>
        <input
          type="text"
          id="favoriteActivities"
          placeholder="Dancing, LEGO, Drawing"
          value={formData.favoriteActivities || ''}
          onChange={handleTextFieldChange('favoriteActivities')}
        />
        <label htmlFor="favoriteShows">Favorite Shows</label>
        <input
          type="text"
          id="favoriteShows"
          placeholder="Doctor Who, Harry Potter"
          value={formData.favoriteShows || ''}
          onChange={handleTextFieldChange('favoriteShows')}
        />
      </div>

      {/* Error display and submit button */}
      <div className="lastOnPage">
        {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
        <button type="submit" disabled={isLoading} className='generate-button'>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default ChildProfileForm;  // Export the component for use in other parts of the application

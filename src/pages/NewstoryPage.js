import React, { useState } from 'react';
import Spinner from '../components/Spinner';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Backend API URL
const backend_api = 'http://localhost:5000/api/newstory'; // Replace with our backend API URL

function NewStoryPage() {
  const [storyLine, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle data submission
  const handleSubmit = async () => {
    setIsLoading(true);
    const payload = {storyLine};
    try{
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

  // Function to navigate to a different page
  const navigate = useNavigate();

  // Set the title of the page
  useEffect(() => {
    document.title = 'Dreamify | Create a Story';
}, []);
if (isLoading) {
    return <Spinner />; // Show the spinner while loading
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Create a Story</h2>
        <label htmlFor="Storyline">Enter a story line you wish create</label>
        <br />
        <textarea
          id="Storyline"
          value={storyLine}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>
      <button type="submit">Creat Story</button>
    </form>

  );
}

export default NewStoryPage;

import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/NewStoryPage.css';

//things to do:
//1. Create the most appropriate default values
//2. Create the function to handle the generate button click and send the data to the backend
//3. Automically redirect to the story page or wait here first (?) 
//4. Make the process of waiting for the story to be generated more user friendly

export default function NewStoryPage() {
  const [storyTopic, setStoryTopic] = useState('');
  const [imageStyle, setImageStyle] = useState('Cartoon'); 
  const [storyLength, setStoryLength] = useState('Short');
  const [storyGenre, setStoryGenre] = useState('Fantasy');

  return (
    <>
      <Header />
      <div className="new-story-page">
        <h1>Create a new story</h1>
        <div class="hr-style"></div>
        
        <label>Topic of the story</label>
        <input
          id="storyTopic"
          type="text"
          value={storyTopic}
          onChange={(e) => setStoryTopic(e.target.value)}
          placeholder="Rally’s adventure to Paris and learning its history"
        />
        
        <label>Image style</label>
        <div className='buttons'>
          {['Cartoon', 'Realistic', 'Fantasy', 'Watercolor', 'Anime'].map((style) => (
            <button
              key={style}
              onClick={() => setImageStyle(style)}
              style={{
                backgroundColor: imageStyle === style ? '#014A8A' : '#77CFD1',
                color: imageStyle === style ? 'white' : 'black',
              }}
            >
              {style}
            </button>
          ))}
        </div>

        <label>The length of the story</label>
        <div className='buttons'>
          {['Short', 'Medium', 'Long'].map((length) => (
            <button
              key={length}
              onClick={() => setStoryLength(length)}
              style={{
                backgroundColor: storyLength === length ? '#014A8A' : '#77CFD1',
                color: storyLength === length ? 'white' : 'black',
              }}
            >
              {length}
            </button>
          ))}
        </div>

        <label>Story Genre</label>
        <div className='buttons'>
          {['Fantasy', 'Adventure', 'Educational'].map((genre) => (
            <button
              key={genre}
              onClick={() => setStoryGenre(genre)}
              style={{
                backgroundColor: storyGenre === genre ? '#014A8A' : '#77CFD1',
                color: storyGenre === genre ? 'white' : 'black',
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        <button
          className="generate-button"
          onClick={() => console.log('Generate button clicked')} //change to the function that sends the data to the backend
        >
          Generate
        </button>
      </div>
      <Footer />
    </>
  );
}






// old code for reference below

// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// import Spinner from "../components/Spinner";

// // Backend API endpoint for story generation
// const apiEndpoint = "/api/generate/story";

// function NewStoryPage() {
//   // Use the navigate hook to redirect to another page
//   const navigate = useNavigate();

//   // Define the state variables
//   const [topic, setTopic] = useState("");
//   const [imageStyle, setImageStyle] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Set the title of the page
//   useEffect(() => {
//     document.title = "Dreamify | Create a Story";
//   }, []);

//   // Show the spinner while loading
//   if (isLoading) {
//     return <Spinner />;
//   }

//   // Function to handle data submission
//   const handleSubmit = async () => {
//     setIsLoading(true);

//     // TODO: Replace dummy child_id once authentication is implemented
//     const payload = {
//       child_id: "5812cd806bf54fe5ab1940b89161f258",
//       topic,
//       image_style: imageStyle,
//     };

//     try {
//       // Call the backend API for story generation
//       const response = await fetch(apiEndpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       // Check if the response is OK
//       if (response.ok) {
//         // Convert the response to JSON
//         const jsonResponse = response.json();

//         // Stop the loading spinner
//         setIsLoading(false);

//         // Redirect to the story page with the response data
//         navigate("/story", { state: { data: jsonResponse } });
//       } else {
//         // Handle server errors or invalid responses
//         console.error("Submission failed", await response.text());
//       }
//     } catch (error) {
//       // Handle errors
//       console.error("Error:", error);
//     } finally {
//       // Stop the loading spinner
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <h2>Create a Story</h2>
//         <label htmlFor="topic">Enter the topic of the story</label>
//         <br />
//         <textarea
//           id="topic"
//           value={topic}
//           onChange={(e) => setTopic(e.target.value)}
//           required
//         />
//         <br />
//         <textarea
//           id="image_style"
//           placeholder="Enter the style for the images"
//           value={imageStyle}
//           onChange={(e) => setImageStyle(e.target.value)}
//           required
//         />
//       </div>
//       <button type="submit">Create Story</button>
//     </form>
//   );
// }

// export default NewStoryPage;

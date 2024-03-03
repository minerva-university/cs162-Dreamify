import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";

// Backend API endpoint for story generation
const apiEndpoint = "/api/generate/story";

function NewStoryPage() {
  // Use the navigate hook to redirect to another page
  const navigate = useNavigate();

  // Define the state variables
  const [topic, setTopic] = useState("");
  const [imageStyle, setImageStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | Create a Story";
  }, []);

  // Show the spinner while loading
  if (isLoading) {
    return <Spinner />;
  }

  // Function to handle data submission
  const handleSubmit = async () => {
    setIsLoading(true);

    // TODO: Replace dummy child_id once authentication is implemented
    const payload = {
      child_id: "5812cd806bf54fe5ab1940b89161f258",
      topic,
      image_style: imageStyle,
    };

    try {
      // Call the backend API for story generation
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is OK
      if (response.ok) {
        // Convert the response to JSON
        const jsonResponse = response.json();

        // Stop the loading spinner
        setIsLoading(false);

        // Redirect to the story page with the response data
        navigate("/story", { state: { data: jsonResponse } });
      } else {
        // Handle server errors or invalid responses
        console.error("Submission failed", await response.text());
      }
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
    } finally {
      // Stop the loading spinner
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>Create a Story</h2>
        <label htmlFor="topic">Enter the topic of the story</label>
        <br />
        <textarea
          id="topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
        />
        <br />
        <textarea
          id="image_style"
          placeholder="Enter the style for the images"
          value={imageStyle}
          onChange={(e) => setImageStyle(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Story</button>
    </form>
  );
}

export default NewStoryPage;

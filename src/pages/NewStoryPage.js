import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useApi } from "../contexts/ApiProvider";
import { Alert } from "react-bootstrap";
import Spinner from "../components/Spinner";
import "./styles/NewStoryPage.css";

export default function NewStoryPage() {
  const api = useApi();

  const navigate = useNavigate();
  const { childId } = useParams();

  const [storyTopic, setStoryTopic] = useState(null);
  const [imageStyle, setImageStyle] = useState("Cartoon");
  const [storyGenre, setStoryGenre] = useState("Fantasy");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  

  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
  };

  const handleGenerate = async (storyTopic, imageStyle, storyGenre) => {
    setIsLoading(true); // Start loading

    try {
      const payload = {
        child_id: childId,
        topic: storyTopic,
        image_style: imageStyle,
        story_genre: storyGenre,
      };

      const response = await api.postGenerateStory(payload);

      if (response?.story_id) {
        setIsLoading(false);
        navigate(`/library/${response.story_id}`);
      } else {
        throw new Error("Story generation failed");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      // Checking if the error message includes a specific substring
      if (error.message.includes("topic: None is not of type 'string'")) {
        setError('Please input a topic');
    } else {
        setError('Something went wrong, please reload and try again.');
        
    }
      }
  };
  
  // Display a loading spinner while the data is being fetched
  if (isLoading) {
    return <Spinner text="Generating story and images, please wait... (This should take approximately 1 minute)" creatingStory={true}/>;
  }

  

  return (
    <div className="new-story-page">
      <h1>Create a new story</h1>
      <div className="hr-style"></div>

      {/* Add a form to input the story topic, image style, and story genre */}
      <form onSubmit={(e) => {
    e.preventDefault();
    handleGenerate(storyTopic, imageStyle, storyGenre);
}}>
      {/* Add buttons to select the image style*/}
      <label>Image style</label>
      <div className="buttons">
        {["Cartoon", "Realistic", "Fantasy", "Watercolor", "Anime"].map(
          (style) => (
            <button
              key={style}
              onClick={() => setImageStyle(style)}
              style={{
                backgroundColor: imageStyle === style ? "#014A8A" : "#77CFD1",
                color: imageStyle === style ? "white" : "black",
              }}
            >
              {style}
            </button>
          )
        )}
      </div>

      <label>Story Genre</label>
      <div className="buttons">
        {["Fantasy", "Adventure", "Educational"].map((genre) => (
          <button
            key={genre}
            onClick={() => setStoryGenre(genre)}
            style={{
              backgroundColor: storyGenre === genre ? "#014A8A" : "#77CFD1",
              color: storyGenre === genre ? "white" : "black",
            }}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="topicOfTheStory">
        <label htmlFor="storyTopic">What should the story be about?</label>
        <input
          id="storyTopic"
          type="text"
          value={storyTopic !== null ? storyTopic : ""}
          onChange={handleTextFieldChange(setStoryTopic)}
          placeholder="Rally's adventure to Paris and learning its history"
          required
        />
      
      {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
    </div>
      {/* Add a button to generate the story */}
      <button type="submit" className="generate-button">Generate</button>
      </form>
    </div>
  );
}

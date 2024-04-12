import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import Spinner from "../components/Spinner";
import "./styles/NewStoryPage.css";

export default function NewStoryPage() {
  // Get the API object from the API context
  const api = useApi();
  const navigate = useNavigate();
  // Get the child ID from the URL
  const { childId } = useParams();
  // Set the initial state of the story topic, image style, story genre, and loading state
  const [storyTopic, setStoryTopic] = useState(null);
  const [imageStyle, setImageStyle] = useState("Cartoon");
  const [storyGenre, setStoryGenre] = useState("Fantasy");
  const [isLoading, setIsLoading] = useState(false);
  
  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  
  // Function to handle the change in the text field 
  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
  };
  
  // Function to handle the generation of the story
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
      // Check if the story was generated successfully
      if (response?.story_id) {
        setIsLoading(false);
        navigate(`/library/${response.story_id}`);
      } else {
        throw new Error("Story generation failed");
      }
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };
  
  // Display a loading spinner while the data is being fetched
  if (isLoading) {
    return <Spinner text="Generating story and images, please wait... (This should take approximately 1 minute)" creatingStory={true}/>;
  }

  return (
    <div className="new-story-page">
      {/* Add a heading and a horizontal rule */}
      <h1>Create a new story</h1>
      <div className="hr-style"></div>

      {/* Add a form to input the story topic, image style, and story genre */}
      <label htmlFor="storyTopic">Topic of the story</label>
      <input
        id="storyTopic"
        type="text"
        value={storyTopic !== null ? storyTopic : ""}
        onChange={handleTextFieldChange(setStoryTopic)}
        placeholder="Rally's adventure to Paris and learning its history"
      />

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

      {/* Add buttons to select the story genre*/}
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

      {/* Add a button to generate the story */}
      <button
        className="generate-button"
        onClick={() => handleGenerate(storyTopic, imageStyle, storyGenre)}
      >
        Generate
      </button>
    </div>
  );
}

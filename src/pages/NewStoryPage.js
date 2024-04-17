import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { Alert } from "react-bootstrap";
import Spinner from "../components/Spinner";
import "./styles/NewStoryPage.css";
import PopUpAlert from "../components/PopUpAlert";

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
  const [error, setError] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message = "We are having trouble creating your bedtime story, please reload and try again or contact us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  }
  
  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | New Story";
  }, []);
  
  // Function to handle the change in the text field 
  const handleTextFieldChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value === "" ? null : value);
  };
  
  const handleGenerate = async () => {
    if (!storyTopic) {
      setError("Please input a topic");
      return;
    }
    setIsLoading(true); // Start loading
    try {
      const payload = {
        child_id: childId,
        topic: storyTopic,
        image_style: imageStyle,
        story_genre: storyGenre,
      };
      const jobResponse = await api.postGenerateStory(payload);
      if (jobResponse?.job_id) {
        checkJobStatus(jobResponse.job_id);
      } else {
        throw new Error("Failed to initiate story generation");
      }
    } catch (error) {
      console.error(error);
      setError("Story generation failed: " + error.message);
      setIsLoading(false);
      showAlert();
    }
  };

  // Function to check the status of the job and navigate once completed
  const checkJobStatus = async (jobId) => {
    try {
      const result = await api.getJobResult(jobId);

      console.log(result, "RESULT")

      if (result.status === "in_progress") {
        setTimeout(() => {
          checkJobStatus(jobId)
        }, 5000)
      } else {
        console.log(result.result, 'DONE')
      }

      // checkJobStatus(jobId)
      // if (result?.story_id) {
      //   navigate(`/library/${result.story_id}`);
      // } else if (result?.status === 'pending') {
      //   setTimeout(() => checkJobStatus(jobId), 5000); // Poll every 5 seconds
      //   console.log(result?.status);
      // } else {
      //   throw new Error('Story generation incomplete or failed');
      // }
    } catch (error) {
      setError("Fetching job result failed: " + error.message);
      setIsLoading(false);
      showAlert();
    }
  };

  // Display a loading spinner while the data is being fetched
  if (isLoading) {
    return <Spinner text="Generating story and images, please wait... (This should take approximately 1 minute)" creatingStory={true}/>;
  }

  return (
    <>{popAnAlert()}
    <div className="new-story-page">
      
      {/* Add a heading and a horizontal rule */}
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
              type="button"
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
            type="button"
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
    </>
  );
}

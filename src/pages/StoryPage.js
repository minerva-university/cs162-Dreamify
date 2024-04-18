import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "../components/Spinner";
import "./styles/StoryPage.css";
import PopUpAlert from "../components/PopUpAlert";

// Import images for the example stories (featured stories from the home page)
import story1chapter1 from "../assets/featured-stories/story1picture1.png";
import story1chapter2 from "../assets/featured-stories/story1picture2.png";
import story1chapter3 from "../assets/featured-stories/story1picture3.png";
import story1chapter4 from "../assets/featured-stories/story1picture4.png";
import story1chapter5 from "../assets/featured-stories/story1picture5.png";
import story2chapter1 from "../assets/featured-stories/story2picture1.png";
import story2chapter2 from "../assets/featured-stories/story2picture2.png";
import story2chapter3 from "../assets/featured-stories/story2picture3.png";
import story2chapter4 from "../assets/featured-stories/story2picture4.png";
import story2chapter5 from "../assets/featured-stories/story2picture5.png";
import data from "../assets/featured-stories/featured-stories.json";

export default function StoryPage() {
  // Get the API object from the API context
  const api = useApi();
  const { login } = useAuth();
  // Get the story ID from the URL
  const { storyId } = useParams();
  // Set the initial state of the story data and loading state and story title
  const [storyData, setStoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState("No title available");
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message =
      "We are having trouble loading this story, please try reloading or contacting us.";
    return (
      <PopUpAlert
        isVisible={alertVisible}
        message={message}
        onClose={closeAlert}
      />
    );
  };

  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | Story";
  }, []);

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      // Check if it's a featured story
      if (storyId === "example-story-1" || storyId === "example-story-2") {
        //number of the featured story
        const exampleId = storyId === "example-story-1" ? 0 : 1;
        const story = data.stories[exampleId];
        const images =
          storyId === "example-story-1"
            ? [
                story1chapter1,
                story1chapter2,
                story1chapter3,
                story1chapter4,
                story1chapter5,
              ]
            : [
                story2chapter1,
                story2chapter2,
                story2chapter3,
                story2chapter4,
                story2chapter5,
              ];
        setStoryTitle(story.storyHeadline);
        // Set the story data
        setStoryData({
          chapters: story.chapters.map((chapter, index) => ({
            title: chapter.chapterHeadline,
            text: chapter.chapterParagraph,
            imageBase64: images[index],
          })),
        });
        // Set loading to false
        setIsLoading(false);
      } else {
        try {
          // Fetch the story chapters
          const response = await api.getAllStoryChapters(storyId);
          setStoryTitle(response?.story_title || "No story title available");
          // Set the story data
          setStoryData({
            chapters:
              response?.chapters?.map((chapter) => ({
                title: chapter.title || "No chapter title available",
                text: chapter.content || "No text available",
                imageBase64: "data:image/png;base64," + chapter.image,
              })) || [],
          });
        } catch (error) {
          console.error("Error fetching story data:", error);
          showAlert();
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [storyId, api, login]);

  // Display a loading spinner while the data is being fetched
  if (isLoading) {
    return (
      <div className="story-loading">
        <Spinner />
      </div>
    );
  }

  // Render the story data
  const renderStory = storyData.chapters ? (
    // Map over the chapters and render each chapter
    storyData.chapters.map((chapter, index) => (
      <div key={index} className="story-block">
        <p className="story-headline">{chapter.title}</p>
        <p className="story-text">
          {chapter.text.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <img
          src={`${chapter.imageBase64}`}
          alt={`Chapter ${index + 1}`}
          className="story-photo"
        />
      </div>
    ))
  ) : (
    // Render a message if no chapters are available
    <div className="story-block">
      <h2 className="story-headline">No chapters available</h2>
    </div>
  );

  // Render the story page
  return (
    <div className="story-page">
      {popAnAlert()}
      <h1 className="page-title">{storyTitle}</h1>
      <hr className="story-hr-line"></hr>
      {renderStory}
    </div>
  );
}

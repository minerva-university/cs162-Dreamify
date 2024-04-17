import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../contexts/ApiProvider";
import Spinner from "../components/Spinner";
import "./styles/LibraryPage.css";
import PopUpAlert from "../components/PopUpAlert";

export default function LibraryPage() {
  // Get the API object from the API context  
  const api = useApi();
  const navigate = useNavigate();

  // Set the initial state of the story data and loading state
  const [storyData, setStoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [alertVisible, setAlertVisible] = useState(false);

  const showAlert = () => {
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const popAnAlert = () => {
    const message = "We are having trouble getting your stories, please try reloading or contacting us.";
    return(
      <PopUpAlert isVisible={alertVisible} message={message} onClose={closeAlert} />
    );
  };

  // Function to handle the click on a story
  const handleStoryClick = (storyId) => {
    navigate(`/library/${storyId}`);
  };

  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | Library";
  }, []);
  
  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all children concurrently
        const childrenResponse = await api.getAllChildren();

        // Process each child concurrently
        const childrenPromises = childrenResponse.children.map(
          async (child) => {
            const storiesResponse = await api.getAllChildStories(
              child.child_id
            );

            // Fetch all stories' chapters concurrently for the current child
            const storiesPromises = storiesResponse.stories.map((story) =>
              api.getAllStoryChapters(story.story_id).then((response) => {
                const firstImage =
                  response.chapters && response.chapters.length > 0
                    ? `data:image/png;base64,${response.chapters[0].image}`
                    : "";

                // Format the date to be displayed in the UI
                const dateCreated = new Date(story.created_at)
                  .toISOString()
                  .slice(0, 10)
                  .replace(/-/g, "/");

                // Return the processed story data
                return {
                  title: story.title,
                  image: firstImage,
                  dateGenerated: dateCreated,
                  storyId: story.story_id,
                };
              })
            );

            // Await for all stories' data to be fetched and processed
            const stories = await Promise.all(storiesPromises);

            // Return the processed child data
            return {
              childId: child.child_id,
              childName: child.name,
              numberOfStories: stories.length,
              stories: stories,
            };
          }
        );

        // Await for all children's data to be fetched and processed
        const processedChildrenData = await Promise.all(childrenPromises);

        setStoryData(processedChildrenData);
      } catch (error) {
        console.error("Error fetching story data:", error);
        showAlert();
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch data when the component mounts
    fetchData();
  }, [api]);

  // Render the loading spinner while fetching data
  if (isLoading) {
    return <Spinner />;
  }

  // Render a message and a button to create a new story if no stories were created yet
  if (!isLoading && !storyData.length) {
    return (
      <div className="library-page">
          <div className="no-stories-found">
            <div className="no-stories-text"> <h1>No stories were created yet.</h1></div>
            <div className="hr-style"></div>
            <button onClick={() => navigate("/children")}>
              Create a new Story
            </button>
          </div>
        </div>
    );
  }

  // Render the stories
  return (
    <>{popAnAlert()}
    <div className="library-page">
      {/* Render each child data */}
      {storyData.map((childData) => (
        <div key={childData.childId}>
          <div className="storyh1h3">
            <div className="storyh1">
              <h1>{childData.childName}'s Bedtime Stories</h1>
            </div>
            <div className="storyh3">
              <h3>{childData.numberOfStories} items</h3>
            </div>
          </div>
          <div className="hr-style"></div>
          {/* Render each story */}
          {childData.stories.map((story) => (
            <div
              key={story.storyId}
              className="story-block"
            >
              <img src={story.image} alt={`Story`} className="story-image" />
              <div className="story-details">
                <div className="story-title-date">
                  <h3 className="story-title">{story.title}</h3>
                  <p className="story-date">{story.dateGenerated}</p>
                </div>
              </div>
              <div className="story-read-more">
                <button
                  className="story-read-button"
                  type="button"
                  onClick={() => handleStoryClick(story.storyId)}
                >
                  Read
                </button>
            </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    </>
  );
}

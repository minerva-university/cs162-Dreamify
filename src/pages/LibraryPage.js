import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../contexts/ApiProvider";
import Spinner from "../components/Spinner";
import "./styles/LibraryPage.css";

export default function LibraryPage() {
  const api = useApi();
  const navigate = useNavigate();

  const [storyData, setStoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleStoryClick = (storyId) => {
    navigate(`/library/${storyId}`);
  };

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
        <div className="content-wrapper">
          <div className="no-stories-found">
            <div className="no-stories-text">No stories were created yet.</div>
            <button onClick={() => navigate("/children")}>
              Create a new Story
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="library-page">
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
          {childData.stories.map((story) => (
            <div
              key={story.storyId}
              className="story-block"
              onClick={() => handleStoryClick(story.storyId)}
            >
              <img src={story.image} alt={`Story`} className="story-image" />
              <div className="story-details">
                <div className="story-title-date">
                  <h2 className="story-title">{story.title}</h2>
                  <p className="story-date">{story.dateGenerated}</p>
                </div>
                <div className="story-private">PRIVATE</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from '../components/Spinner';
import './styles/StoryPage.css';

export default function StoryPage() {
  const { storyId } = useParams();
  const api = useApi();
  const { login } = useAuth();
  const [storyData, setStoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        
        await login("bob.ross@example.com", "123");  //FOR TESTING PURPOSES
        
        const response = await api.getAllStoryChapters(storyId);

        setStoryData({
          chapters: response?.chapters?.map(chapter => ({
            text: chapter.content || "No text available",
            imageBase64: "data:image/png;base64," + chapter.image
          })) || []
        });

      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [storyId, api, login]);

  if (isLoading) {
    return (
      <div className="story-loading">
        <Spinner />
      </div>
    );
  }

  if (!storyData) {
    return (
      <div>Story not found</div>
    );
  }

  return (
    <>
      <div className="story-container">
        {storyData.chapters.map((chapter, index) => (
          <div key={index} className="story-block">
            <h2 className="story-headline">{"Chapter " + (index + 1)}</h2>
            <p className="story-text">{chapter.text.split('\n').map((line, i) => (<span key={i}>{line}<br/></span>))}</p>
            <img src={`${chapter.imageBase64}`} alt={`Chapter ${index + 1}`} className="story-photo" />
          </div>
        ))}
      </div>
    </>
  );
}
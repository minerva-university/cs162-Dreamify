import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";
import './styles/LibraryPage.css';
import Spinner from '../components/Spinner';

//todo: it takes a while to load all the stories, so we need to add a spinner & make the process of loading faster

export default function LibraryPage() {
    const api = useApi();
    const {isAuthenticated,login } = useAuth();
    const navigate = useNavigate();

    const [storyData, setStoryData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    const handleStoryClick = (storyId) => {
      navigate(`/library/story/${storyId}`);
    }

    
    useEffect(() => {

      const fetchData = async () => {
        try {
          const childrenResponse = await api.getAllChildren();

          let tempStoryData = [];

          for (const child of childrenResponse.children) {
            const storiesResponse = await api.getAllChildStories(child.child_id);
          
            let stories = []; 
          
            for (const story of storiesResponse.stories) {
              const response = await api.getAllStoryChapters(story.story_id); 
              const firstImage = response.chapters && response.chapters.length > 0 ? `data:image/png;base64,${response.chapters[0].image}` : '';
              
              stories.push({
                title: story.topic,
                image: firstImage, 
                //todo: change when date is available
                dateGenerated: story.dateGenerated || 'Unknown Date',
                storyId: story.story_id,
              });
              
            
          }
        
          tempStoryData.push({
            childId: child.child_id,
            childName: child.name,
            numberOfStories: stories.length,
            stories: stories,
          });
        

          setStoryData(tempStoryData);
        };
        } catch (error) {
          console.error("Error fetching story data:", error);
        } finally {
          setIsLoading(false);
        }
        
      };

      fetchData();
    }, [api, login, isAuthenticated]);

    if (isLoading) {
        return <Spinner />;
    }

    if (!isLoading && !storyData.length) {
        return <div>No stories found for this parent.</div>;
    }

    
    return (
      <>
        <div className="library-page">
          {storyData.map((childData) => (
            <div key={childData.childId}>
              <div className='storyh1h3'>
                <div className='storyh1'><h1>{childData.childName}'s Bedtime Stories</h1></div>
                <div className='storyh3'><h3>{childData.numberOfStories} items</h3></div>
              </div>
              <div className="hr-style"></div>
              {childData.stories.map((story) => (
                <div key={story.storyId} className="story-block" onClick={() => handleStoryClick(story.storyId)} style={{ cursor: 'pointer' }}>
                  <img src={story.image} alt={`Story`} className="story-image" />
                  <div className="story-details">
                    <div className='story-title-date'>
                      <p className="story-title">{story.title}</p>
                      <p className="story-date">{story.dateGenerated}</p>
                    </div>
                    <div className="story-private">PRIVATE</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </>
    );
}
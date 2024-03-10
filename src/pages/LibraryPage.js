import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";

import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/LibraryPage.css';

export default function LibraryPage() {
    const { parentid } = useParams();
    const api = useApi();
    const {isAuthenticated,login } = useAuth();

    const [storyData, setStoryData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(() => {

      const fetchData = async () => {
        try {

          const response = await login("bob.ross@example.com", "123");

          //todo: make sure that only logged users can access this page
          if (!isAuthenticated) {
            throw new Error("User is not authenticated");

          }
          else{
          
            const childrenResponse = await api.getAllChildren(parentid);

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
                  dateGenerated: story.dateGenerated || 'Unknown Date' 
                });
              
            }
          
            tempStoryData.push({
              childName: child.name,
              numberOfStories: stories.length,
              stories: stories,
            });
          }

          setStoryData(tempStoryData);
        };
        } catch (error) {
          console.error("Error fetching story data:", error);
        } finally {
          setIsLoading(false);
        }
        
      };

      fetchData();
    }, [parentid, api, login]);

    if (isLoading) {
        return <div>Loading stories...</div>;
    }

    if (!isLoading && !storyData.length) {
        return <div>No stories found for this parent.</div>;
    }

    
    return (
      <>
        <Header />
        <div className="library-page">
          {storyData.map((childData, childIndex) => (
            <div key={childIndex}>
              <div className='storyh1h3'>
                <div className='storyh1'><h1>{childData.childName}'s Bedtime Stories</h1></div>
                <div className='storyh3'><h3>{childData.numberOfStories} items</h3></div>
              </div>
              <div className="hr-style"></div>
              {childData.stories.map((story, storyIndex) => (
                <div key={storyIndex} className="story-block">
                  <img src={story.image} alt={`Story ${storyIndex + 1}`} className="story-image" /> {/*story.image */}
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
        <Footer />
      </>
    );
}
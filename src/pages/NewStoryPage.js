import React, { useState } from 'react';
import Spinner from '../components/Spinner';
import { useNavigate } from 'react-router-dom'; 
import { useParams } from 'react-router-dom';
import './styles/NewStoryPage.css';
import { useApi } from "../contexts/ApiProvider";
import { useAuth } from "../contexts/AuthProvider";

//todo: redirect users to home page if they are not logged in

export default function NewStoryPage() {
  const api = useApi();

  const {login } = useAuth();
  
  const navigate = useNavigate();
  const { childId } = useParams();
  
  const [storyTopic, setStoryTopic] = useState('');
  const [imageStyle, setImageStyle] = useState('Cartoon'); 
  const [storyLength, setStoryLength] = useState('Short');
  const [storyGenre, setStoryGenre] = useState('Fantasy');
  const [isLoading, setIsLoading] = useState(false);


  const handleGenerate = async (storyTopic, imageStyle, storyLength, storyGenre) => {
    setIsLoading(true); // Start loading

    const email = "bob.ross@example.com";
    const password = "123";

    await login(email, password); //FOR TESTING PURPOSES


    try {
      const payload = {
        child_id: childId,
        topic: storyTopic,
        image_style: imageStyle,
      };

    
      const response = await api.postGenerateStory(payload);

      if (response?.story_id) {
        setIsLoading(false); 
        navigate(`/library/story/${response.story_id}`);
      } else {
        throw new Error('Story generation failed');
      }
    } catch (error) {
      setIsLoading(false); 
      console.error(error);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="new-story-page">
        <h1>Create a new story</h1>
        <div className="hr-style"></div>
        
        <label htmlFor="storyTopic">Topic of the story</label>
        <input
          id="storyTopic"
          type="text"
          value={storyTopic}
          onChange={(e) => setStoryTopic(e.target.value)}
          placeholder="Rally’s adventure to Paris and learning its history"
        />

        <label>Image style</label>
        <div className='buttons'>
          {['Cartoon', 'Realistic', 'Fantasy', 'Watercolor', 'Anime'].map((style) => (
            <button
              key={style}
              onClick={() => setImageStyle(style)}
              style={{
                backgroundColor: imageStyle === style ? '#014A8A' : '#77CFD1',
                color: imageStyle === style ? 'white' : 'black',
              }}
            >
              {style}
            </button>
          ))}
        </div>

        <label >The length of the story</label>
        <div className='buttons'>
          {['Short', 'Medium', 'Long'].map((length) => (
            <button
              key={length}
              onClick={() => setStoryLength(length)}
              style={{
                backgroundColor: storyLength === length ? '#014A8A' : '#77CFD1',
                color: storyLength === length ? 'white' : 'black',
              }}
            >
              {length}
            </button>
          ))}
        </div>

        <label>Story Genre</label>
        <div className='buttons'>
          {['Fantasy', 'Adventure', 'Educational'].map((genre) => (
            <button
              key={genre}
              onClick={() => setStoryGenre(genre)}
              style={{
                backgroundColor: storyGenre === genre ? '#014A8A' : '#77CFD1',
                color: storyGenre === genre ? 'white' : 'black',
              }}
            >
              {genre}
            </button>
          ))}
        </div>

        <button
          className="generate-button"
          onClick={() => handleGenerate(storyTopic, imageStyle, storyLength, storyGenre)}
        >
          Generate
        </button>
      </div>
    </>
  );
}
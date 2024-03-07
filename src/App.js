import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container} from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import UserProfilePage from './pages/UserProfilePage';
import AddachildPage from './pages/AddachildPage';
import LibraryPage from './pages/LibraryPage';
import SignupPage from './pages/SignupPage';  
import StoryPage from './pages/StoryPage';
import NewstoryPage from './pages/NewstoryPage';
import LoginPage from './pages/LoginPage';  
import HomePage from './pages/HomePage';  
import './App.css';

export default function App() {
  /*const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/api/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);*/

  return (
    <Container fluid className = 'App'>
      <BrowserRouter>
        {/* <Header />  Tamirlan (make sure to have two types (home page should have a different one) */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Tamirlan */}
          <Route path="/myprofile/:parentid" element={<UserProfilePage />} /> {/* Billy */}
          <Route path="/addachild/:parentid" element={<AddachildPage />} /> {/* Billy  */}
          <Route path="/library/story/:storyid" element={<StoryPage />} /> {/* MISHA */} 
          <Route path="/library/parent/:parentid" element={<LibraryPage />} /> {/* MISHA */} 
          <Route path="/newstory/:childid" element={<NewstoryPage />} /> {/* MISHA */} 
          <Route path="/login" element={<LoginPage />} />{ /* Flambeau */} 
          <Route path="/signup" element={<SignupPage />} /> {/* Flambeau */} 
        </Routes>
        {/* <Footer /> {/* Tamirlan  */}
      </BrowserRouter>
    </Container>
  );
}

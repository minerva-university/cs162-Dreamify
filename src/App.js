import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/UserProfile';
import './App.css';
import Header from './components/Header';
import { Container} from 'react-bootstrap';
import NewStoryPage from './pages/NewstoryPage';
import LoginPage from './pages/LoginPage';


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
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/new-story" element={<NewStoryPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}



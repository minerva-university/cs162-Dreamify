import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserProfile from './pages/UserProfile';
import './App.css';
import Header from './components/Header';
import { Container} from 'react-bootstrap';
import NewStoryPage from './pages/NewStoryPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import BedtimeStory from './pages/StoryPage';
import SignUpPage from './pages/SignUpPage';
import AddChild from './pages/AddChild';

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
          <Route path="/home" element={<HomePage />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/new-story" element={<NewStoryPage />} />
          <Route path="/story" element={<BedtimeStory />} />
          <Route path="/add-child" element={<AddChild />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}



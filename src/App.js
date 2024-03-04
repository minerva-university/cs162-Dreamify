import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import LandingPage from "./pages/LandingPage";
import UserProfile from "./pages/UserProfile";
import Header from "./components/Header";
import { Container } from "react-bootstrap";
import NewStoryPage from "./pages/NewstoryPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BedtimeStory from "./pages/StoryPage";
import ApiProvider from "./contexts/ApiProvider";
import AuthProvider from "./contexts/AuthProvider";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <Header />
        <ApiProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/user-profile" element={<UserProfile />} />
              <Route path="/new-story" element={<NewStoryPage />} />
              <Route path="/story" element={<BedtimeStory />} />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

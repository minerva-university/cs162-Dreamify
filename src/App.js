import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";

// Styles
import "./App.css";

// Contexts
import ApiProvider from "./contexts/ApiProvider";
import AuthProvider from "./contexts/AuthProvider";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import UserProfilePage from "./pages/UserProfilePage";
import AddachildPage from "./pages/AddachildPage";
import LibraryPage from "./pages/LibraryPage";
import NewStoryPage from "./pages/NewStoryPage";
import ModifyChildPage from "./pages/ModifyChildPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StoryPage from "./pages/StoryPage";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        {/* <Header />  Tamirlan (make sure to have two variants with a prop */}
        <ApiProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} /> {/* Tamirlan */}
              <Route
                path="/myprofile/:parentid"
                element={<UserProfilePage />}
              />{" "}
              {/* Billy */}
              <Route
                path="/addachild/:parentid"
                element={<AddachildPage />}
              />{" "}
              {/* Billy  */}
              <Route
                path="/modify/:childid"
                element={<ModifyChildPage />}
              />{" "}
              {/* Billy  */}
              <Route
                path="/library/story/:storyid"
                element={<StoryPage />}
              />{" "}
              {/* MISHA */}
              <Route
                path="/library/parent/:parentid"
                element={<LibraryPage />}
              />{" "}
              {/* MISHA */}
              <Route
                path="/newstory/:childid"
                element={<NewStoryPage />}
              />{" "}
              {/* MISHA */}
              <Route path="/login" element={<LoginPage />} />
              {/* Flambeau */}
              <Route path="/signup" element={<SignupPage />} /> {/* Flambeau */}
            </Routes>
          </AuthProvider>
        </ApiProvider>
        {/* <Footer /> {/* Tamirlan  */}
      </BrowserRouter>
    </Container>
  );
}

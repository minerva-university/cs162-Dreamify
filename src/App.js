import { BrowserRouter, Routes, Route} from "react-router-dom";
import { Container } from "react-bootstrap";

// Styles
import "./App.css";

// Contexts
import ApiProvider from "./contexts/ApiProvider";
import AuthProvider from "./contexts/AuthProvider";

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
import SelectChildPage from "./pages/SelectChildPage";

import AboutUsPage from "./pages/AboutUsPage";
import TermsPage from "./pages/TermsPage";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";


export default function App() {


  // Check if the current path is the login or signup page

  return (
    <Container fluid className="App">
      <BrowserRouter>
        
        <ApiProvider>
          <AuthProvider>
            {/* Tamirlan */}
        {/* Render header if not on the login or signup page */}
          <Header />
          
            <Routes>
              {/* Tamirlan */}
              <Route 
                path="/" 
                element={<HomePage />} /> 
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
                path="/library/story/:storyId"
                element={<StoryPage />}
              />{" "}
              {/* MISHA -- DONE*/}
              <Route
                path="/library/parent"
                element={<LibraryPage />}
              />{" "}
              {/* MISHA -- DONE */}
              <Route
                path="/newstory/:childId"
                element={<NewStoryPage />}
              />{" "}
              {/* MISHA */}
              <Route path="/children" element={<SelectChildPage />} />
              {/* Flambeau */}
              <Route path="/login" element={<LoginPage />} />
              {/* Flambeau */}

              <Route path="/signup" element={<SignupPage />} /> {/* Flambeau */}
              {/* Tamir */}
              <Route path="/aboutus" element={<AboutUsPage />}    />
              {/* Tamir */}
              <Route path="/terms" element={<TermsPage />} />

            </Routes>
             {/* Tamirlan  */}
          {/* Render footer if not on the login or signup page */}
            <Footer />

          </AuthProvider>
        </ApiProvider>
       
      </BrowserRouter>
      </Container>
  );
}

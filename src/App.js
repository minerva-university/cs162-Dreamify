import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRoute from "./components/AuthRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <AuthProvider>
            {/* Header components for all the pages */}
            <Header />  
            <Routes>
              {/* Routes for the application */}
              <Route path="/" element={<HomePage />} />
              <Route path="/myprofile"
                element={
                  <ProtectedRoute>
                    <UserProfilePage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the AddachildPage component */}
              <Route path="/addachild"
                element={
                  <ProtectedRoute>
                    <AddachildPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the ModifyChildPage component */}
              <Route path="/modify/:childid"
                element={
                  <ProtectedRoute>
                    <ModifyChildPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the StoryPage component */}
              <Route path="/library/:storyId"
                element={
                  <ProtectedRoute>
                    <StoryPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the LibraryPage component */}
              <Route path="/library"
                element={
                  <ProtectedRoute>
                    <LibraryPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the NewStoryPage component */}
              <Route path="/newstory/:childId"
                element={
                  <ProtectedRoute>
                    <NewStoryPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the SelectChildPage component */}
              <Route
                path="/children"
                element={
                  <ProtectedRoute>
                    <SelectChildPage />
                  </ProtectedRoute>
                }
              />
              {/* Add a new route for the Login component */}
              <Route
                path="/login"
                element={
                  <AuthRoute>
                    <LoginPage />
                  </AuthRoute>
                }
              />
              {/* Add a new route for the SignUp Page component */}
              <Route
                path="/signup"
                element={
                  <AuthRoute>
                    <SignupPage />
                  </AuthRoute>
                }
              />
              {/* Add a new route for the AboutUs Page component */}
              <Route path="/aboutus" element={<AboutUsPage />} />
              {/* Add a new route for the Terms Page component */}
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
            {/* Footer components for all the pages */}
            <Footer />
          </AuthProvider>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );
}

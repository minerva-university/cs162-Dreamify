import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import { useAuth } from "../contexts/AuthProvider";
import Spinner from "./Spinner";

// ProtectedRoute component that redirects to the login page if the user is not authenticated
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If the authentication state is not yet defined, render a spinner
  if (isAuthenticated === undefined) {
    return <Spinner />;
  }

  // Exclude the example-story pages from the redirect
  if (!isAuthenticated && !location.pathname.includes("/example-story")) {
    // If the user is not authenticated, redirect to
    // the login page with the current location as the
    // state which will be used to redirect the user
    // back to the original location after successful login
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // If the user is authenticated, render the children
  return children;
}

// Prop validation
ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

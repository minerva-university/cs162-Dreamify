import PropTypes from "prop-types";

import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "./Spinner";

// AuthRoute component to redirect user to home page if user is authenticated
export default function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // If user is not authenticated, return a spinner
  if (isAuthenticated === undefined) {
    return <Spinner />;
  }

  // If user is authenticated, redirect user to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If user is not authenticated, return children
  return children;
}

// Prop validation
AuthRoute.propTypes = {
  children: PropTypes.node,
};

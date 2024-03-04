import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

import AuthClient from "../clients/AuthClient";

// Create a new context for the authentication client
const AuthContext = createContext();

/**
 * Custom hook to use the authentication client.
 * @returns {object} The authentication state and functions to register, log in,
 * log out a user and get the current user.
 * @example
 * import { useAuth } from "./contexts/AuthProvider";
 *
 * function MyComponent() {
 *  const { isAuthenticated, register, login, logout, getCurrentParent } = useAuth();
 * // ...
 * }
 */
function useAuthClient() {
  // State to keep track of the authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);

  // Create a new instance of the authentication client
  // with useMemo to prevent unnecessary re-renders
  const auth = useMemo(() => new AuthClient(), []);

  // Check authentication status on initial load
  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // If there is no token, the user is not authenticated
    if (!token) {
      setIsAuthenticated(false);

      // If the token is not expired, the user is authenticated
    } else if (!isTokenExpired(token)) {
      setIsAuthenticated(true);

      // Otherwise, the user is not authenticated
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  /**
   * Check if a token is expired.
   * @param {string} token - The token to check
   * @returns {boolean} True if the token is expired, false otherwise
   */
  const isTokenExpired = (token) => {
    try {
      // Decode the token to get the expiration time
      const decodedToken = jwtDecode(token);

      // Check if the current time is past the token's expiration time
      const currentTime = Date.now() / 1000;

      // Return true if the token is expired, false otherwise
      return decodedToken.exp <= currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  };

  /**
   * Register a new user.
   * @param {string} firstName - The user's first name
   * @param {string} lastName - The user's last name
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @throws {Error} If the input is invalid or the request fails
   * @returns {Promise<void>}
   * @example
   * await register("John", "Doe", "john.doe@example.com", "password");
   */
  const register = async (firstName, lastName, email, password) => {
    await auth.register(firstName, lastName, email, password);
  };

  /**
   * Log in a user.
   * @param {string} email - The user's email
   * @param {string} password - The user's password
   * @throws {Error} If the input is invalid or the request fails
   * @returns {Promise<void>}
   * @example
   * await login("john.doe@example.com", "password");
   */
  const login = async (email, password) => {
    // If the login request is successful, set the isAuthenticated state to true
    try {
      await auth.login(email, password);
      setIsAuthenticated(true);

      // If the login request is unsuccessful, set the isAuthenticated state to false
      // and throw an error
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  /**
   * Log out a user by removing the access token from local storage.
   * @returns {void}
   * @example
   * logout();
   */
  const logout = () => {
    // Remove the access token from local storage
    localStorage.removeItem("access_token");

    // Set the isAuthenticated state to false
    setIsAuthenticated(false);
  };

  /**
   * Get the current user.
   * @returns {Promise<object>} The current user
   * @example
   * const user = getCurrentParent();
   */
  const getCurrentParent = async () => {
    return await auth.getCurrentParent();
  };

  // Return the functions and isAuthenticated state to be used by the app
  return { isAuthenticated, register, login, logout, getCurrentParent };
}

// Provider component that wraps the app and provides the authentication client
export default function AuthProvider({ children }) {
  const auth = useAuthClient();

  // Memoize the value to prevent unnecessary re-renders
  const value = useMemo(() => ({ ...auth }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Prop validation
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Custom hook to use the authentication client.
 * @returns {object} The authentication state and functions to register, log in,
 * log out a user and get the current user.
 * @example
 * import { useAuth } from "./contexts/AuthProvider";
 *
 * function MyComponent() {
 * const { isAuthenticated, register, login, logout, getCurrentParent } = useAuth();
 * // ...
 * }
 */
export function useAuth() {
  return useContext(AuthContext);
}

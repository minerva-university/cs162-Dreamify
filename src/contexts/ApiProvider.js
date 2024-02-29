// Based on the ApiProvider from the react mega tutorial:
// https://blog.miguelgrinberg.com/post/the-react-mega-tutorial-chapter-6-building-an-api-client

import { createContext, useContext, useMemo } from "react";
import PropTypes from "prop-types";

import ApiClient from "../clients/ApiClient";

// Create a new context for the API client
const ApiContext = createContext();

export default function ApiProvider({ children }) {
  // Create a new instance of the API client when the provider is initialized
  // This is done using the useMemo hook to ensure that the client is only created once
  const api = useMemo(() => new ApiClient(), []);

  // Provide the API client to the rest of the application
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

// Custom hook to use the API client
export function useApi() {
  return useContext(ApiContext);
}

// Define the prop types for the provider component
ApiProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

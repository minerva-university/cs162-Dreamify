import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "../components/Spinner.js";
import "../pages/styles/AuthPages.css";

function SignUpPage() {
  // Set the title of the page
  useEffect(() => {
    document.title = "Dreamify | Sign Up";
  }, []);

  // Get the navigate function from the router
  const navigate = useNavigate();

  // Get the register function from the authentication context
  const { register } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Assuming you have an isLoading state
    setError("");

    try {
      // Utilize the register function instead of direct fetch call
      await register(firstName, lastName, email, password);
      console.log("Signup successful");
      // Navigate to the home or login page after successful signup
      navigate("/login"); // Assuming you're using react-router for navigation
    } catch (error) {
      console.error("Error while signing up:", error.message);
      setError("An error occurred while signing up. Please try again.");
      // Handle errors here and display them to the user
    } finally {
      setIsLoading(false);
    }

    // Optional: Reset fields after submission
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  return (
    <div className="signin-page">
      <div className="signin-image">
        <h1>Welcome Aboard!</h1>
        <p>Already have an account?</p>
        <button onClick={() => navigate("/login")}>Sign In</button>
      </div>
      <div className="signin-form">
        <form onSubmit={handleSubmit}>
          <h1>Sign Up</h1>
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}
          <div className="email-input">
            <input
              type="text"
              id="firstName"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="email-input">
            {" "}
            <input
              type="text"
              id="lastName"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="email-input">
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="password-input">
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;

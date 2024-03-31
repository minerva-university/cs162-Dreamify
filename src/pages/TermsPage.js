import React from 'react';
import './styles/TermsPage.css';
import {useState, useEffect} from "react";
import Spinner from "../components/Spinner.js"; 

export default function TermsAndPrivacy() {
    
    useEffect(() => {
        document.title = "Dreamify | Terms of Service and Privacy Policy";
      }, []);

    const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially    
    // Simulate data loading
    setTimeout(() => {
        setIsLoading(false); // Set isLoading to false after data is loaded
    }, 200); // Adjust the delay (2000ms = 2 seconds) as needed
    if (isLoading) {
        return <Spinner />;
    }

  return (
    <div className="terms-container">
    <h1 className="terms-title">Terms of Service and Privacy Policy</h1>

    <div className="terms-section">
        <h2 className="terms-section-title">Terms of Service</h2>
        <p className="terms-section-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nulla vel mi eleifend bibendum. Sed euismod metus vel neque pulvinar, ac venenatis metus tincidunt. Donec non erat et velit blandit tincidunt. Nullam ac ex sed diam cursus consectetur. Sed vel mauris et turpis hendrerit rhoncus.
        </p>
    </div>

    <div className="terms-section">
        <h2 className="terms-section-title">Privacy Policy</h2>
        <p className="terms-section-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget nulla vel mi eleifend bibendum. Sed euismod metus vel neque pulvinar, ac venenatis metus tincidunt. Donec non erat et velit blandit tincidunt. Nullam ac ex sed diam cursus consectetur. Sed vel mauris et turpis hendrerit rhoncus.
        </p>
    </div>
</div>
  );
};
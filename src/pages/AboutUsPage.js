import React, { useState, useEffect } from "react";

import misha from "../assets/about_us_page/misha.png";
import billy from "../assets/about_us_page/billy.png";
import paul from "../assets/about_us_page/paul.png";
import tamir from "../assets/about_us_page/tamir.png";
import flambeau from "../assets/about_us_page/flambeau.png";
import Spinner from "../components/Spinner.js";
import "./styles/AboutUsPage.css";

export default function AboutUs() {
  const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially

  useEffect(() => {
    document.title = "Dreamify | About Us";
  }, []);

  // Simulate data loading
  useEffect(() => {
    // Simulate an asynchronous operation (e.g., fetching data from an API)
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false after data is loaded
    }, 200);
  }, []);

  if (isLoading) {
    return <Spinner />;
  }
  const teamMembers = [
    {
      name: "Mykhailo Chudyk",
      fairytale: "Cinderella",
      imageUrl: misha,
      position: "Product Manager",
    },
    {
      name: "Paul Franek",
      fairytale: "Beauty and the Beast",
      imageUrl: paul,
      position: "Software Engineer",
    },
    {
      name: "Flambeau Iriho",
      fairytale: "The Little Mermaid",
      imageUrl: flambeau,
      position: "Software Engineer",
    },
    {
      name: "Tamirlan Bektemissov",
      fairytale: "Sleeping Beauty",
      imageUrl: tamir,
      position: "Software Engineer",
    },
    {
      name: "Billy Altangerel",
      fairytale: "Snow White and the Seven Dwarfs",
      imageUrl: billy,
      position: "Software Engineer",
    },
  ];

  return (
    <div className="about-us-page">
      <h1 className="abus-title">About Us</h1>
      {teamMembers.map((member) => (
        <div className="abus-team-member" key={member.name}>
          <img src={member.imageUrl} alt={`Developer ${member.name}`} />
          <div className="abus-team-member-info">
            <h3 className="abus-team-member-name">{member.name}</h3>
            <p className="abus-team-member-position">{member.position}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

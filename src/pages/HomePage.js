import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import treeImage from "../assets/home_page/hp_tree.png";
import boyWithBalloon from "../assets/home_page/hp_boy_balloon.png";
import boyWithStars from "../assets/home_page/hp_boy_stars.png";
import starsImage from "../assets/home_page/hp_stars.png";

import {useState, useEffect} from "react";
import Spinner from "../components/Spinner.js";
import "./styles/HomePage.css";

export default function HomePage() {

  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially

  useEffect(() => {
    document.title = "Dreamify | Home";
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

  

  return (
    <div className="hp-container">
      <div className="hp-row hp-mb-3">
        <div className="hp-col-md-5">
          <img src={boyWithStars} alt="Boy with stars" className="hp-img-fluid" />
        </div>
        <div className="hp-col-md-7">
          <img src={boyWithBalloon} alt="Boy with balloon" className="hp-img-fluid" />
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-col">
          <div className="hp-title">Bring your child's imagination to life with bedtime stories</div>
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-col">
          <div className="hp-tree-image-container">
            <img src={treeImage} alt="Tree" className="hp-img-fluid" />
            <div className="hp-tree-overlay-text">Create your own bedtime story</div>
            <div className="hp-create-button">
              <Link to={!isAuthenticated ? "/signup" : "/newstory"} className="hp-create-text">
                Create
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-col-md-12 hp-text-center">
          <h2 className="hp-featured-title">Featured Bedtime Stories</h2>
        </div>
      </div>
      <div className="hp-row hp-justify-content-center">
        <div className="hp-col-md-12 hp-text-center">
          <div className="hp-featured-box">
            <img src={boyWithStars} alt="Story" className="hp-featured-image" />
            <div className="hp-featured-content">
              <h3 className="hp-featured-name">Sweet Ty's Adventure</h3>
              <p className="hp-featured-date">11/11/2024</p>
            </div>
            <button className="hp-featured-button">Read</button>
          </div>
        </div>
      </div>
      <div className="hp-homepage-container">
        <div className="hp-row hp-justify-content-center">
          <div className="hp-col-md-6 hp-text-center">
            <img src={starsImage} alt="HP Stars" className="hp-img-fluid" />
          </div>
        </div>
        <div className="hp-row hp-justify-content-center">
          <div className="hp-col-md-9 hp-text-center">
            <p className="hp-description">
              Dreamify — Where Dreams Come Alive. Transform pre-bedtime into an unforgettable adventure with Dreamify, the ultimate story generator for children. Immerse your kids in magical tales where they are the heroes, embarking on journeys across new lands, learning fascinating facts, and sparking their imagination like never before. Each story is a doorway to a world of wonder, tailored to inspire and educate, creating cherished memories that will last a lifetime. With Dreamify, bedtime isn't just about going to sleep; it's about setting sail to dreamland, where every night is a unique voyage of discovery and delight. Join us in nurturing young minds, fostering creativity, and making every night a special storytime adventure.
            </p>
          </div>
        </div>
        <div className="hp-row hp-justify-content-center">
          <div className="hp-col-md-6 hp-text-center">
            <img src={starsImage} alt="HP Stars" className="hp-img-fluid" style={{ marginBottom: "80px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
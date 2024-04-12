import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Spinner from "../components/Spinner.js";
import treeImage from "../assets/home_page/hp_tree.png";
import firstExample from "../assets/featured-stories/story1picture1.png";
import secondExample from "../assets/featured-stories/story2picture1.webp";
import boyTwoPhotos from "../assets/home_page/hp_boy_two_photos.png";
import starsImage from "../assets/home_page/hp_stars.png";
import "./styles/HomePage.css";

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true); // Set isLoading to true initially
  const navigate = useNavigate();

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

  const handleFeaturedStory = (isFirstStory) => {
    navigate(`/library/${isFirstStory ? "example-story-1" : "example-story-2"}`);
  }

  return (
    <div className="home-page">
      <div className="image-container hp-row hp-mb-3">
        <div className="image-item">
          <img
            src={boyTwoPhotos}
            alt="Boy two photos"
            className="hp-img-fluid"
          />
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-col">
          <h2 className="hp-title">
            Bring your child's imagination to life with bedtime stories
          </h2>
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-col">
          <div className="hp-tree-image-container">
            <img
              src={treeImage}
              alt="Tree"
              className="hp-img-fluid hp-img-auto"
            />
            <p className="hp-tree-overlay-text">
              Create your own bedtime story
            </p>
            <div className="hp-create-button">
              <Link
                to={!isAuthenticated ? "/signup" : "/children"}
                className="hp-create-text"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="hp-row">
        <div className="hp-text-center">
          <h2 className="hp-featured-title">Featured Bedtime Stories</h2>
        </div>
      </div>
      <div className="hp-row">

        <div className="story-block" onClick={() => handleFeaturedStory(true)}> 
          <img src={firstExample} alt="Story" className="story-image" />
          <div className="story-details">
            <div className="story-title-date">
              <h2 className="story-title">Julia and the Enchanted Mic</h2>
              <p className="story-date">04/07/2024</p>
            </div>
          </div>
        </div>

        <div className="story-block" onClick={() => handleFeaturedStory(false)}> 
          <img src={secondExample} alt="Story" className="story-image" />
          <div className="story-details">
            <div className="story-title-date">
              <h2 className="story-title">Pablo's Magical Journey to Hogwarts</h2>
              <p className="story-date">04/03/2024</p>
            </div>
          </div>
        </div>


      </div>
      <div className="hp-homepage-container" id="fivestars">
        <div className="hp-row">
          <div className="hp-text-center">
            <img
              src={starsImage}
              alt="HP Stars"
              className="hp-img-fluid hp-img-auto"
            />
          </div>
        </div>
        <div className="hp-row">
          <div className="hp-description-container hp-text-center">
            <p className="hp-description">
              Dreamify — Where Dreams Come Alive. Transform pre-bedtime into an
              unforgettable adventure with Dreamify, the ultimate story
              generator for children. Immerse your kids in magical tales where
              they are the heroes, embarking on journeys across new lands,
              learning fascinating facts, and sparking their imagination like
              never before. Each story is a doorway to a world of wonder,
              tailored to inspire and educate, creating cherished memories that
              will last a lifetime. With Dreamify, bedtime isn't just about
              going to sleep; it's about setting sail to dreamland, where every
              night is a unique voyage of discovery and delight. Join us in
              nurturing young minds, fostering creativity, and making every
              night a special storytime adventure.
            </p>
          </div>
        </div>
        <div className="hp-row">
          <div className="hp-text-center">
            <img
              src={starsImage}
              alt="HP Stars"
              className="hp-img-fluid hp-img-auto"
              style={{ marginBottom: "80px" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

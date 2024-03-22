import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import treeImage from "../assets/home_page/hp_tree.png";
import boyWithBalloon from "../assets/home_page/hp_boy_balloon.png";
import boyWithStars from "../assets/home_page/hp_boy_stars.png";
import starsImage from "../assets/home_page/hp_stars.png";
import "./styles/HomePage.css";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="homepage-container">
      <div className="row mb-3">
        <div className="col-md-5">
          <img src={boyWithStars} alt="Boy with stars" className="img-fluid" />
        </div>
        <div className="col-md-7">
          <img src={boyWithBalloon} alt="Boy with balloon" className="img-fluid" />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="title">Bring your child's imagination to life with bedtime stories</div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="tree-image-container">
            <img src={treeImage} alt="Tree" className="img-fluid" />
            <div className="tree-overlay-text">Create your own bedtime story</div>
            <div className="create-button">
              <Link to={!isAuthenticated ? "/signup" : "/newstory"} className="create-link">
                Create
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12 text-center">
          <h2 className="featured-title">Featured Bedtime Stories</h2>
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12 text-center">
          <div className="featured-box">
            <img src={boyWithStars} alt="Story" className="featured-image" />
            <div className="featured-content">
              <h3 className="featured-name">Sweet Ty's Adventure</h3>
              <p className="featured-date">11/11/2024</p>
            </div>
            <button className="featured-button">Read</button>
          </div>
        </div>
      </div>
      <div className="homepage-container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <img src={starsImage} alt="HP Stars" className="img-fluid" />
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-11 text-center">
            <p className="description">
              Dreamify — Where Dreams Come Alive. Transform pre-bedtime into an unforgettable adventure with Dreamify, the ultimate story generator for children. Immerse your kids in magical tales where they are the heroes, embarking on journeys across new lands, learning fascinating facts, and sparking their imagination like never before. Each story is a doorway to a world of wonder, tailored to inspire and educate, creating cherished memories that will last a lifetime. With Dreamify, bedtime isn't just about going to sleep; it's about setting sail to dreamland, where every night is a unique voyage of discovery and delight. Join us in nurturing young minds, fostering creativity, and making every night a special storytime adventure.
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <img src={starsImage} alt="HP Stars" className="img-fluid" style={{ marginBottom: "80px" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
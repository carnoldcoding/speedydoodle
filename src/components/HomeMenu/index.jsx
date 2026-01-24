import React from "react";
import { HomeMenuSection } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeMenu = ({ setGalleryChoice }) => {
  const [redirectToGallery, setRedirectToGallery] = useState(false);
  const navigate = useNavigate();
  
  function handleClick(galleryType) {
    return (e) => {
      e.preventDefault();
      setGalleryChoice(galleryType);
      setRedirectToGallery(true);
    };
  }
  
  useEffect(() => {
    if (redirectToGallery) {
      navigate("/gallery");
    }
  }, [redirectToGallery, navigate]);
  
  return (
    <HomeMenuSection>
      <article className="grid">
        <div className="grid-item illustrations">
          <h3>humorous</h3>
          <h1>illustrations</h1>
          <Link to="/gallery" onClick={handleClick("illustrations")}>
            <button type="button">
              explore
            </button>
          </Link>
        </div>
        <div className="grid-item logos">
          <h3>for your brand</h3>
          <h1>logos</h1>
          <Link to="/gallery" onClick={handleClick("logos")}>
            <button type="button">
              explore
            </button>
          </Link>
        </div>
        <div className="grid-item gifts">
          <h3>custom caricature</h3>
          <h1>gifts</h1>
          <Link to="/gallery" onClick={handleClick("custom")}>
            <button type="button">
              explore
            </button>
          </Link>
        </div>
        <div className="grid-item books">
          <h3>For Kids</h3>
          <h1>Books</h1>
          <a href="https://speedydoodlestudios.com/" target="_blank" rel="noopener noreferrer">
            <button type="button">
              explore
            </button>
          </a>
        </div>
        <div className="grid-item parties">
          <h3>party</h3>
          <h1>caricatures</h1>
          <Link to="/gallery" onClick={handleClick("party")}>
            <button type="button">
              explore
            </button>
          </Link>
        </div>
      </article>
    </HomeMenuSection>
  );
};

export default HomeMenu;
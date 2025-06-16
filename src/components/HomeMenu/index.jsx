import React from "react";
import { HomeMenuSection } from "./styles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HomeMenu = ({ setGalleryChoice }) => {
  const [redirectToGallery, setRedirectToGallery] = useState(false);
  const navigate = useNavigate();
  function handleClick(e) {
    setGalleryChoice(e.target.getAttribute("data-type"));
    setRedirectToGallery(true);
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
          <Link to="/gallery">
            <button data-type="illustrations" onClick={handleClick}>
              explore
            </button>
          </Link>
        </div>

        <div className="grid-item logos">
          <h3>for your brand</h3>
          <h1>logos</h1>
          <Link to="/gallery">
            <button data-type="logos" onClick={handleClick}>
              explore
            </button>
          </Link>
        </div>

        <div className="grid-item gifts">
          <h3>custom caricature</h3>
          <h1>gifts</h1>
          <Link to="/gallery">
            <button data-type="custom" onClick={handleClick}>
              explore
            </button>
          </Link>
        </div>

        <div className="grid-item books">
          <h3>For Kids</h3>
          <h1>Books</h1>
          <a href="https://speedydoodlestudios.com/" target="_blank">
            <button>
              explore
            </button>
          </a>
        </div>

        <div className="grid-item parties">
          <h3>party</h3>
          <h1>caricatures</h1>
          <Link to="/gallery">
            <button data-type="party" onClick={handleClick}>
              explore
            </button>
          </Link>
        </div>
      </article>
    </HomeMenuSection>
  );
};

export default HomeMenu;

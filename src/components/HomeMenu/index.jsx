import React from "react";
import { Link } from "react-router-dom";
import { HomeMenuSection } from "./styles";

const HomeMenu = () => {
  return (
    <HomeMenuSection>
      <article className="grid">
        <div className="grid-item illustrations">
          <h3>professional</h3>
          <h1>illustrations</h1>
          <button>explore</button>
        </div>

        <div className="grid-item logos">
          <h3>for your brand</h3>
          <h1>logos</h1>
          <button>explore</button>
        </div>

        <div className="grid-item gifts">
          <h3>for friends and family</h3>
          <h1>gifts</h1>
          <button>explore</button>
        </div>

        <div className="grid-item parties">
          <h3>in person</h3>
          <h1>parties</h1>
          <button>explore</button>
        </div>
      </article>
    </HomeMenuSection>
  );
};

export default HomeMenu;

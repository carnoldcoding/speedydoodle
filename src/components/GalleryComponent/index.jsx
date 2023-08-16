import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect } from "react";

const GalleryComponent = () => {
  const imagesList = [
    {
      type: "illustrations",
      visible: true,
    },
    {
      type: "caricatures",
      visible: true,
    },
    { type: "logos", visible: true },
    { type: "icons", visible: true },
  ];

  const [filter, setFilter] = useState("all");
  const [images, setImages] = useState(imagesList);
  const changeFilter = function (e) {
    setFilter(e.target.textContent);
  };

  return (
    <GallerySection>
      <article>
        <header>
          <ul onClick={changeFilter}>
            <li>caricatures</li>
            <li>illustrations</li>
            <li>logos</li>
            <li>icons</li>
            <li>all</li>
          </ul>
          {/* Mobile */}
          <select
            onChange={(e) => setFilter(e.target.value)}
            name="filters"
            id="filters"
          >
            <option value="caricatures">caricatures</option>
            <option value="illustrations">illustrations</option>
            <option value="logos">logos</option>
            <option value="icons">icons</option>
            <option value="all">all</option>
          </select>
        </header>
        <div className="gallery-images">
          {images
            .filter((image) => image.type === filter || filter === "all")
            .map((image, key) => {
              return (
                <div className="image-card" id={key}>
                  {image.visible && image.type}
                  <ion-icon name="search-outline"></ion-icon>
                </div>
              );
            })}
        </div>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;

import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect } from "react";

const GalleryComponent = () => {
  const [data, setData] = useState(null);

  const fetchImages = (e) => {
    setData(null);
    fetch(`/api/${e.target.getAttribute("data-type")}`)
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          console.log(image);
          return image.url;
        });
        console.log(parsedData);
        setData(parsedData);
      });
  };

  return (
    <GallerySection>
      <article>
        <header>
          <ul onClick={fetchImages}>
            <li data-type="custom">custom caricatures</li>
            <li data-type="party">party caricatures</li>
            <li data-type="illustrations">illustrations</li>
            <li data-type="logos">logos</li>
          </ul>
          {/* Mobile */}
          <select name="filters" id="filters">
            <option data-type="ccars" value="dcaricatures">
              custom caricatures
            </option>
            <option data-type="pcars" value="lcaricatures">
              party caricatures
            </option>
            <option data-type="ills" value="illustrations">
              illustrations
            </option>
            <option data-type="logos" value="logosandicons">
              logos
            </option>
          </select>
        </header>
        <div className="gallery-images">
          {data === null ? (
            <p></p>
          ) : (
            data.map((item) => {
              return (
                <div className="image-card">
                  <img src={item} />
                </div>
              );
            })
          )}
        </div>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;

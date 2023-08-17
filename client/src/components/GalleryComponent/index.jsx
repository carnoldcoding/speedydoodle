import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect } from "react";

const GalleryComponent = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/custom")
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          return image.url;
        });
        console.log(parsedData);
        setData(parsedData);
      });
  }, []);

  return (
    <GallerySection>
      <article>
        <header>
          <ul>
            <li data-type="ccars">custom caricatures</li>
            <li data-type="pcars">party caricatures</li>
            <li data-type="ills">illustrations</li>
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
            <p>Loading...</p>
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

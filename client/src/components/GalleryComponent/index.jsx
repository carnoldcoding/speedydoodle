import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect } from "react";

const GalleryComponent = () => {
  const [data, setData] = useState(null);

  const setActive = (e) => {
    const filters = document.querySelectorAll("header > ul > li");
    filters.forEach((filter) => {
      filter.classList.remove("active");
    });
    e.target.classList.add("active");
  };

  const fetchImages = (e) => {
    setData(null);
    fetch(`/api/${e.target.getAttribute("data-type")}`)
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          return image.url;
        });
        setData(parsedData);
      });
  };

  const handleClick = (e) => {
    setActive(e);
    fetchImages(e);
  };

  const fetchImagesMobile = (e) => {
    setData(null);
    fetch(`/api/${e.target[e.target.selectedIndex].getAttribute("data-type")}`)
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          console.log(image);
          return image.url;
        });
        setData(parsedData);
      });
  };

  useEffect(() => {
    fetch(`/api/custom`)
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          console.log(image);
          return image.url;
        });
        setData(parsedData);
      });
  }, []);

  return (
    <GallerySection>
      <article>
        <header>
          <ul onClick={handleClick}>
            <li className="active" data-type="custom">
              custom caricatures
            </li>
            <li data-type="party">party caricatures</li>
            <li data-type="illustrations">illustrations</li>
            <li data-type="logos">logos</li>
          </ul>
          {/* Mobile */}
          <select onChange={fetchImagesMobile} name="filters" id="filters">
            <option data-type="custom" value="dcaricatures">
              custom caricatures
            </option>
            <option data-type="party" value="lcaricatures">
              party caricatures
            </option>
            <option data-type="illustrations" value="illustrations">
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
            data.map((item, key) => {
              return (
                <div className="image-card" key={key}>
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

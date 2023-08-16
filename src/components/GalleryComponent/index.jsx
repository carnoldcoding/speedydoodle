import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect } from "react";
import { IKImage, IKContext } from "imagekitio-react";

const GalleryComponent = () => {
  const imagesList = [
    {
      type: "ills",
      visible: true,
    },
    {
      type: "pcars",
      visible: true,
    },
    {
      type: "ccars",
      visible: true,
    },
    { type: "logos", visible: true },
    { type: "logos", visible: true },
  ];

  const [filter, setFilter] = useState("logos");
  const [images, setImages] = useState(imagesList);
  const changeFilter = function (e) {
    setFilter(e.target.getAttribute("data-type"));
  };

  return (
    <GallerySection>
      <article>
        <header>
          <ul onClick={changeFilter}>
            <li data-type="ccars">custom caricatures</li>
            <li data-type="pcars">party caricatures</li>
            <li data-type="ills">illustrations</li>
            <li data-type="logos">logos</li>
          </ul>
          {/* Mobile */}
          <select
            onChange={(e) => {
              setFilter(
                e.target[e.target.selectedIndex].getAttribute("data-type")
              );
            }}
            name="filters"
            id="filters"
          >
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
          <IKContext urlEndpoint="https://ik.imagekit.io/4hll6ncue/">
            {images
              .filter((image) => image.type === filter)
              .map((image, key) => {
                return (
                  <div className="image-card" id={key}>
                    {image.visible && image.type}
                    <ion-icon name="search-outline"></ion-icon>
                  </div>
                );
              })}
          </IKContext>
        </div>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;

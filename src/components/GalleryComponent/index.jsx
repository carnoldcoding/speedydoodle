import React from "react";
import { GallerySection } from "./styles";
import { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";

const GalleryComponent = ({ galleryChoice }) => {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState(galleryChoice);
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const modal = useRef();

  const imageZoom = (e) => {
    modal.current.classList.toggle("visible");
    modal.current.firstChild.src = e.target.src;
    document.body.classList.toggle("modal-open");
  };

  const fetchImages = () => {
    setData(null);
    fetch(
      `https://speedydoodle-backend-fcbbc4e86733.herokuapp.com/api/${activeFilter}`
    )
      .then((response) => {
        return response.json();
      })
      .then((images) => {
        const parsedData = images.map((image) => {
          return image.url;
        });
        setData(parsedData);
      });
  };

  const handleClick = (e) => {
    if (e.target.tagName === "LI") {
      setActiveFilter(e.target.getAttribute("data-type"));
    }
  };

  const fetchImagesMobile = (e) => {
    setData(null);
    fetch(
      `https://speedydoodle-backend-fcbbc4e86733.herokuapp.com/api/${e.target[
        e.target.selectedIndex
      ].getAttribute("data-type")}`
    )
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => {
          return image.url;
        });
        setData(parsedData);
      });
  };

  useEffect(() => {
    const filters = document.querySelectorAll("header > ul > li");
    filters.forEach((filter) => {
      const filterType = filter.getAttribute("data-type");
      if (filterType === activeFilter) {
        filter.classList.add("active");
      } else {
        filter.classList.remove("active");
      }
    });
    fetchImages();
  }, [activeFilter, galleryChoice]);

  return (
    <GallerySection>
      <aside className="zoom-image" onClick={imageZoom} ref={modal}>
        <img alt="modal" src="/"></img>
      </aside>
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
                <div className="image-card" key={key} onClick={imageZoom}>
                  <img alt="gallery-card" src={item} />
                  <ion-icon name="search"></ion-icon>
                </div>
              );
            })
          )}
        </div>
        <div className="mobile-gallery">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {data === null ? (
                <p></p>
              ) : (
                data.map((item, key) => {
                  return (
                    <div className="embla__slide" key={key}>
                      <img alt="mobile-gallery-card" src={item} />
                    </div>
                  );
                })
              )}
            </div>
            <aside>
              <ion-icon name="arrow-back-outline"></ion-icon>
              <h1>swipe</h1>
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </aside>
          </div>
        </div>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;

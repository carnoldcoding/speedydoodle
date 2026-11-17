import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {GallerySection} from "./styles"

const GalleryComponent = ({ galleryChoice = "custom" }) => {
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState(galleryChoice);
  const [viewMode, setViewMode] = useState("carousel"); // 'grid', 'list', or 'carousel'
  const [isMobile, setIsMobile] = useState(false);
  const [emblaRef] = useEmblaCarousel({ loop: true });
  const modal = useRef();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 920);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const imageZoom = (e, imageSrc) => {
    modal.current.classList.toggle("visible");
    modal.current.firstChild.src = imageSrc || e.target.src;
    document.body.classList.toggle("modal-open");
  };

  const fetchImages = () => {
    setData(null);
    fetch(
      `https://api.speedydoodle.com/api/${activeFilter}`
    )
      .then((response) => response.json())
      .then((images) => {
        const parsedData = images.map((image) => image.url);
        setData(parsedData);
      });
  };

  const handleFilterClick = (e) => {
    if (e.target.tagName === "LI") {
      setActiveFilter(e.target.getAttribute("data-type"));
      window.scrollTo(0, 0);
    } else if (e.target.tagName === "SELECT") {
      setActiveFilter(e.target.value);
    }
  };

  useEffect(() => {
    const filters = document.querySelectorAll("header > .filter-section > ul > li");
    const mobileFilter = document.querySelector("select");
    
    filters.forEach((filter) => {
      const filterType = filter.getAttribute("data-type");
      if (filterType === activeFilter) {
        filter.classList.add("active");
      } else {
        filter.classList.remove("active");
      }
    });
    
    if (mobileFilter) {
      mobileFilter.value = activeFilter;
    }
    
    fetchImages();
  }, [activeFilter, galleryChoice]);

  const formatImageName = (url) => {
    // Extract filename from URL
    const filename = url.split('/').pop().split('.')[0];
    // Replace hyphens/underscores with spaces and capitalize each word
    return filename
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const renderGalleryContent = () => {
    if (data === null) {
      return <div className="loading"></div>;
    }

    if (viewMode === "carousel" && isMobile) {
      return (
        <div className="gallery-carousel">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container">
              {data.map((item, key) => (
                <div className="embla__slide" key={key}>
                  <img alt="mobile-gallery-card" src={item} />
                </div>
              ))}
            </div>
          </div>
          <aside>
            <ion-icon name="arrow-back-outline"></ion-icon>
            <h1>swipe</h1>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </aside>
        </div>
      );
    }

    if (viewMode === "list") {
      return (
        <div className="gallery-list">
          {data.map((item, key) => (
            <div className="image-card" key={key} onClick={(e) => imageZoom(e, item)}>
              <div className="thumbnail">
                <img alt="thumbnail" src={item} />
              </div>
              <div className="image-name">{formatImageName(item)}</div>
              <ion-icon name="eye-outline"></ion-icon>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="gallery-grid">
        {data.map((item, key) => (
          <div className="image-card" key={key} onClick={imageZoom}>
            <img alt="gallery-card" src={item} />
            <ion-icon name="search"></ion-icon>
          </div>
        ))}
      </div>
    );
  };

  return (
    <GallerySection>
      <aside className="zoom-image" onClick={imageZoom} ref={modal}>
        <img alt="modal" src="/" />
      </aside>
      <article>
        <header>
          <div className="filter-section">
            <ul onClick={handleFilterClick}>
              <li className="active" data-type="custom">
                custom caricatures
              </li>
              <li data-type="party">party caricatures</li>
              <li data-type="illustrations">illustrations</li>
              <li data-type="logos">logos</li>
            </ul>
            <select onChange={handleFilterClick} name="filters" id="filters">
              <option data-type="custom" value="custom">
                custom caricatures
              </option>
              <option data-type="party" value="party">
                party caricatures
              </option>
              <option data-type="illustrations" value="illustrations">
                illustrations
              </option>
              <option data-type="logos" value="logos">
                logos
              </option>
            </select>
          </div>
          
          <div className="view-controls">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <ion-icon name="grid-outline"></ion-icon>
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <ion-icon name="list-outline"></ion-icon>
            </button>
            {isMobile && (
              <button
                className={viewMode === "carousel" ? "active" : ""}
                onClick={() => setViewMode("carousel")}
                title="Carousel view"
              >
                <ion-icon name="swap-horizontal-outline"></ion-icon>
              </button>
            )}
          </div>
        </header>
        
        <div className="gallery-container">
          {renderGalleryContent()}
        </div>
      </article>
    </GallerySection>
  );
};

export default GalleryComponent;

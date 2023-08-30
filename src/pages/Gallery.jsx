import React from "react";
import GalleryHeading from "../components/GalleryHeader";
import GalleryComponent from "../components/GalleryComponent";

const Gallery = ({ galleryChoice }) => {
  return (
    <>
      <GalleryHeading />
      <GalleryComponent galleryChoice={galleryChoice} />
    </>
  );
};

export default Gallery;

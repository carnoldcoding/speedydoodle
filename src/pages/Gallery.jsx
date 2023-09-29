import React from "react";
import GalleryHeading from "../components/GalleryHeader";
import GalleryComponent from "../components/GalleryComponent";
import { useEffect } from "react";

const Gallery = ({ galleryChoice }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  return (
    <>
      <GalleryHeading />
      <GalleryComponent galleryChoice={galleryChoice} />
    </>
  );
};

export default Gallery;

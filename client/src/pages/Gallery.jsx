import React from "react";
import GalleryHeading from "../components/GalleryHeader";
import GalleryComponent from "../components/GalleryComponent";
import { useEffect, useState } from "react";

const Gallery = () => {
  return (
    <>
      <GalleryHeading />
      <GalleryComponent />
    </>
  );
};

export default Gallery;